<?php

/**
 * Workspace: the full-screen, TypingMind-class chat surface inside wp-admin.
 * Free shell, admins only for now (per-role access comes later); Knowledge,
 * MCP Servers and Functions inside it are Pro. It runs on the
 * same chat pipeline as the chatbot (chats/submit + discussions) through the
 * internal "mwai_workspace" bot, with per-conversation env/model overrides.
 * Theme, accent and default model are per-user preferences (user meta).
 */
/**
 * Thrown by the WordPress Tools bridge when the AI wants to run a tool that
 * needs the user's approval. Not an error: the chat pipeline turns it into an
 * approval card in the UI and the turn resumes once the user decides.
 */
class Meow_MWAI_ApprovalRequiredException extends Exception {
  public $tool;
  public $args;

  public function __construct( $tool, $args = [] ) {
    parent::__construct( "The tool '{$tool}' requires the user's approval." );
    $this->tool = (string) $tool;
    $this->args = is_array( $args ) ? $args : [];
  }
}

class Meow_MWAI_Modules_Workspace {
  private $core = null;
  // "WordPress Tools" state for the current chat request: the categories the
  // user enabled, and the tool names attached to the query (feedback routing).
  private $wpToolsCategories = null;
  private $wpToolNames = [];
  // Approval state for the current chat request: tool names the user allowed
  // (once or for the conversation) and tool names they explicitly denied.
  private $wpToolsAllowed = [];
  private $wpToolsDenied = [];
  private $wpToolsTurnKey = '';
  public const PREFS_META = 'mwai_workspace_prefs';
  public const BOT_ID = 'mwai_workspace';
  /**
  * What this site's Workspace API can do, for clients that ship separately from
  * the plugin (the mobile app updates through the App Store, sites update when
  * they feel like it, so the two drift). Bump this whenever a client would need
  * to know that a site is new enough for something, and never renumber it.
  *
  * ADDITIVE ONLY, and this covers two things:
  *
  * 1. Routes under mwai/v1/workspace. Renaming or removing one breaks every
  *    phone in the wild until its owner updates the app.
  * 2. Keys inside the payloads those routes return, build_bootstrap() above in
  *    particular. Adding a key is always safe because clients ignore what they
  *    do not know; removing or renaming one is not. The mobile app decodes that
  *    payload strictly and treats a failed decode as a failed connection, so
  *    dropping a key like modules.embeddings or wp_tools.site_name would not
  *    degrade those devices, it would make their sites unconnectable. A rename
  *    is one quiet line in a plugin diff and total at the other end.
  *
  * To retire a key: add its replacement, keep sending the old one, bump this
  * constant, and only drop the old key once you are willing to tell everyone on
  * an older app to update.
  *
  * 1: pairing, bootstrap, prefs, wp-tools, images, auth-check, pair-check.
  */
  public const API_VERSION = 1;
  /**
  * MCP tools that must never be bridged into the Workspace conversation.
  *
  * mwai_image generates an image and hands back { id, url } as plain text. The image
  * is stored in the Media Library but never becomes part of the conversation, so the
  * model cannot see it on the next turn and follow-ups like "make it wider" or "change
  * the background" have nothing to work from. The Workspace already generates images
  * through the native image_generation tool (gated by the workspace_image option),
  * which keeps the result attached to the chat, so bridging this one only added a
  * second, broken path to the same feature.
  */
  private const EXCLUDED_WP_TOOLS = [ 'mwai_image' ];

  public function __construct( $core ) {
    $this->core = $core;
    add_action( 'admin_menu', [ $this, 'admin_menu' ] );
    add_action( 'admin_enqueue_scripts', [ $this, 'admin_enqueue_scripts' ] );
    add_action( 'admin_head', [ $this, 'admin_head' ] );
    // Hidden pages (no menu parent) get no title from WP: set it ourselves.
    add_filter( 'admin_title', [ $this, 'admin_title' ], 10, 2 );
    add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
    add_filter( 'mwai_internal_chatbot', [ $this, 'internal_chatbot' ], 10, 3 );
    // "This WordPress": expose the site's MCP tools to the AI as plain
    // functions, so every provider (not just MCP-capable ones) can drive
    // this WordPress without a network round-trip.
    add_filter( 'mwai_chatbot_query', [ $this, 'chatbot_query' ], 10, 2 );
    add_filter( 'mwai_ai_feedback', [ $this, 'ai_feedback' ], 10, 3 );
    // Multi-step site work (find, read, edit, verify) burns one depth level
    // per tool round; the default of 5 cuts legitimate tasks short.
    add_filter( 'mwai_function_call_max_depth', function ( $maxDepth, $query ) {
      return ( $query->scope ?? '' ) === 'workspace' ? max( 20, (int) $maxDepth ) : $maxDepth;
    }, 10, 2 );
    // Mobile companion (QR pairing): authorize Application-Password requests
    // from admins on AI Engine's nonce-gated endpoints. See authorize_app_password().
    add_filter( 'mwai_rest_authorized', [ $this, 'authorize_app_password' ], 10, 2 );
  }

  /**
  * AI Engine's chat/discussion endpoints gate on a wp_rest nonce (CSRF
  * protection for the in-admin, cookie-authenticated web app). The iOS
  * companion authenticates with a WordPress Application Password (HTTP Basic),
  * which carries no nonce. Authorize those requests when, and only when, they
  * were authenticated by an Application Password (NOT a cookie) AND resolve to
  * an admin. Cookie-authenticated browser requests are untouched, so their CSRF
  * gate stays intact; Basic auth isn't CSRF-exposed, so satisfying the nonce for
  * a capable user is safe (they can already use the whole WP REST API).
  *
  * The check asks WordPress what authenticated THIS request rather than reading
  * the Authorization header. Servers differ on how Basic credentials reach PHP:
  * Apache with mod_php consumes the header into PHP_AUTH_USER and never exposes
  * it as HTTP_AUTHORIZATION, so a header test failed there even though the app
  * password had authenticated the user perfectly, and every chat message from
  * the mobile app came back as 403. rest_get_authenticated_app_password() is set
  * by core itself, so it is right on every server config, and it can never be
  * true for a browser's cookie session.
  */
  public function authorize_app_password( $authorized, $request ) {
    if ( $authorized ) {
      return $authorized;
    }
    if ( function_exists( 'rest_get_authenticated_app_password' ) && rest_get_authenticated_app_password() ) {
      return current_user_can( 'manage_options' ) ? true : $authorized;
    }
    return $authorized;
  }

  public function can_access() {
    return current_user_can( 'manage_options' );
  }

  private function is_pro() {
    return (bool) apply_filters( MWAI_PREFIX . '_meowapps_is_registered', false, MWAI_PREFIX );
  }

  /**
  * Effective feature availability: the admin-level Settings toggles, with
  * Knowledge, MCP Servers and Functions additionally requiring Pro (their
  * underlying modules are Pro anyway).
  */
  private function feature_flags() {
    $pro = $this->is_pro();
    return [
      'image' => (bool) $this->core->get_option( 'workspace_image' ),
      'web_search' => (bool) $this->core->get_option( 'workspace_web_search' ),
      'wp_tools' => (bool) $this->core->get_option( 'workspace_wp_tools' ),
      'knowledge' => $pro && (bool) $this->core->get_option( 'workspace_knowledge' ),
      'mcp' => $pro && (bool) $this->core->get_option( 'workspace_mcp' ),
      'functions' => $pro && (bool) $this->core->get_option( 'workspace_functions' ),
    ];
  }

  private function is_workspace_page() {
    return is_admin() && isset( $_GET['page'] ) && $_GET['page'] === 'mwai_workspace';
  }

  public function admin_menu() {
    // No menu entry: the Workspace is reached from the Admin Bar and the
    // AI Engine header. An empty parent registers the page without listing it,
    // so admin.php?page=mwai_workspace keeps working.
    add_submenu_page(
      '',
      'AI Workspace',
      'Workspace',
      'manage_options',
      'mwai_workspace',
      [ $this, 'render_page' ]
    );
  }

  public function admin_title( $admin_title, $title ) {
    if ( $this->is_workspace_page() ) {
      return 'AI Workspace' . $admin_title;
    }
    return $admin_title;
  }

  public function render_page() {
    if ( !$this->can_access() ) {
      wp_die( __( 'Sorry, you are not allowed to access this page.', 'ai-engine' ), 403 );
    }
    echo '<div id="mwai-workspace" data-theme="dark"></div>';
  }

  /**
   * The Workspace takes the whole viewport: hide the WP admin chrome on its
   * page only, like the Site Editor does. The div itself is position:fixed.
   */
  public function admin_head() {
    if ( !$this->is_workspace_page() ) {
      return;
    }
    echo '<style>
      #adminmenumain, #wpadminbar, #wpfooter, #screen-meta, #screen-meta-links { display: none !important; }
      html.wp-toolbar { padding-top: 0 !important; }
      #wpcontent, #wpbody-content { margin-left: 0 !important; padding: 0 !important; }
      #wpbody-content .notice, #wpbody-content .updated, #wpbody-content .error { display: none !important; }
    </style>';
  }

  public function admin_enqueue_scripts() {
    if ( !$this->is_workspace_page() || !$this->can_access() ) {
      return;
    }

    $physical_file = MWAI_PATH . '/app/workspace.js';
    $cache_buster = file_exists( $physical_file ) ? filemtime( $physical_file ) : MWAI_VERSION;

    wp_register_script(
      'mwai_workspace',
      MWAI_URL . 'app/workspace.js',
      [ 'wp-element', 'wp-i18n' ],
      $cache_buster
    );
    wp_enqueue_script( 'mwai_workspace' );

    // Syntax highlighting is always on in the Workspace, independently of the
    // chatbot's syntax_highlight option. The bundled dark theme suits the
    // Workspace's code blocks, which stay dark in both themes.
    wp_enqueue_script( 'mwai_highlight' );
    wp_enqueue_style( 'mwai_workspace_highlight', MWAI_URL . 'vendor/highlightjs/stackoverflow-dark.min.css', [], '11.7' );

    wp_enqueue_style( 'mwai_workspace', MWAI_URL . 'app/workspace.css', [], $cache_buster );
    // The Workspace type system (self-hosting these is on the roadmap).
    wp_enqueue_style(
      'mwai_workspace_fonts',
      'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@1,6..72,300;1,6..72,400&family=Spline+Sans+Mono:wght@400;500&display=swap',
      [],
      null
    );

    wp_localize_script( 'mwai_workspace', 'mwai_workspace', array_merge( $this->build_bootstrap(), [
      // Page-only bits: the web app authenticates with the cookie + nonce, the
      // mobile companion with an Application Password (no nonce, no session).
      'rest_nonce' => wp_create_nonce( 'wp_rest' ),
      'session' => $this->core->get_session_id(),
      'debug_mode' => (bool) ( $this->core->get_option( 'module_devtools' ) && $this->core->get_option( 'debug_mode' ) ),
    ] ) );
  }

  /**
  * Everything a Workspace client needs to start: the model catalog, the
  * per-user preferences, the feature flags and the tool catalog. Shared by the
  * admin page (localized at load) and the mobile companion (one REST call).
  */
  private function build_bootstrap() {
    $user = wp_get_current_user();
    return [
      // Version handshake. A client that needs something this site cannot do
      // should be able to say "update AI Engine" instead of guessing at a 404
      // from a route that does not exist yet. The plugin version is for humans
      // and bug reports; api_version is what clients compare against.
      'plugin_version' => MWAI_VERSION,
      'api_version' => self::API_VERSION,
      'rest_url' => untrailingslashit( get_rest_url() ),
      'admin_url' => admin_url(),
      'api_url' => untrailingslashit( get_rest_url( null, 'mwai/v1' ) ),
      'plugin_url' => untrailingslashit( MWAI_URL ),
      'site_name' => get_bloginfo( 'name' ),
      'site_url' => untrailingslashit( home_url() ),
      'stream' => (bool) $this->core->get_option( 'ai_streaming' ),
      'user' => [
        'display_name' => $user->display_name,
        'role' => !empty( $user->roles ) ? $user->roles[0] : '',
      ],
      'prefs' => $this->get_prefs(),
      'envs' => $this->build_envs(),
      'embeddings_envs' => $this->build_embeddings_envs(),
      'mcp_envs' => $this->build_mcp_envs(),
      'functions' => $this->build_functions(),
      'wp_tools' => $this->build_wp_tools(),
      'modules' => [
        'embeddings' => (bool) $this->core->get_option( 'module_embeddings' ),
        'orchestration' => (bool) $this->core->get_option( 'module_orchestration' ),
      ],
      // Admin-level feature availability (Settings > Workspace + Pro).
      'features' => $this->feature_flags(),
      // Features that exist but need Pro: shown as tasteful locked rows.
      'locked_features' => $this->is_pro() ? [] : [ 'knowledge', 'mcp', 'functions' ],
      'is_pro' => $this->is_pro(),
      'upsell_url' => 'https://meowapps.com/ai-engine/',
      'settings_url' => admin_url( 'admin.php?page=mwai_settings' ),
    ];
  }

  private function build_embeddings_envs() {
    if ( !$this->core->get_option( 'module_embeddings' ) ) {
      return [];
    }
    $out = [];
    foreach ( (array) $this->core->get_option( 'embeddings_envs' ) as $env ) {
      if ( !empty( $env['id'] ) ) {
        $out[] = [
          'id' => $env['id'],
          'name' => $env['name'] ?? $env['id'],
          'type' => $env['type'] ?? '',
        ];
      }
    }
    return $out;
  }

  private function build_mcp_envs() {
    if ( !$this->core->get_option( 'module_orchestration' ) ) {
      return [];
    }
    $out = [];
    foreach ( (array) $this->core->get_option( 'mcp_envs' ) as $env ) {
      if ( !empty( $env['id'] ) ) {
        $out[] = [ 'id' => $env['id'], 'name' => $env['name'] ?? $env['id'] ];
      }
    }
    return $out;
  }

  private function build_functions() {
    $out = [];
    $functions = apply_filters( 'mwai_functions_list', [] );
    foreach ( (array) $functions as $f ) {
      $f = is_object( $f ) ? (array) $f : $f;
      if ( !is_array( $f ) || empty( $f['id'] ) || empty( $f['type'] ) ) {
        continue;
      }
      // Editor Assistant functions only make sense inside the block editor.
      if ( $f['type'] === 'editor-assistant' ) {
        continue;
      }
      $out[] = [
        'id' => (string) $f['id'],
        'name' => $f['name'] ?? (string) $f['id'],
        'desc' => $f['description'] ?? '',
        'type' => $f['type'],
      ];
    }
    return $out;
  }

  /**
   * The env + model catalog for the picker: every AI environment with its
   * chat-capable models (same filtering the smoke gate uses).
   */
  private function build_envs() {
    $out = [];
    $envs = $this->core->get_option( 'ai_envs' );
    if ( !is_array( $envs ) ) {
      return $out;
    }
    foreach ( $envs as $env ) {
      try {
        $engine = Meow_MWAI_Engines_Factory::get( $this->core, $env['id'] );
        if ( !$engine ) {
          continue;
        }
        $models = $engine->get_models();
        $chatModels = [];
        foreach ( (array) $models as $m ) {
          $tags = $m['tags'] ?? [];
          $features = $m['features'] ?? [];
          if ( !in_array( 'chat', $tags, true ) || in_array( 'deprecated', $tags, true ) ) {
            continue;
          }
          if ( !empty( $features ) && !in_array( 'completion', $features, true ) ) {
            continue;
          }
          if ( preg_match( '/guard|moderat|safety|embed|whisper|tts|rerank/i', $m['model'] ) ) {
            continue;
          }
          $chatModels[] = [
            'model' => $m['model'],
            'name' => $m['name'] ?? $m['model'],
            // Capability hints for the UI (files/functions warnings).
            'tags' => array_values( array_intersect( $tags, [ 'vision', 'files', 'functions', 'reasoning', 'no-temperature' ] ) ),
            // Whether the model can produce images in a chat turn: OpenAI via
            // the image_generation tool, Gemini Flash Image natively.
            'image' => in_array( 'image_generation', (array) ( $m['tools'] ?? [] ), true ) ||
              in_array( 'image-generation', (array) $features, true ),
            // Whether the provider runs web search server-side for this model. Sent as
            // a resolved boolean like 'image' above: the raw tools array never reaches
            // the UI, so checking it client-side always came back false.
            'web_search' => in_array( 'web_search', (array) ( $m['tools'] ?? [] ), true ),
            // Reasoning levels this model accepts (models.php params.reasoning), so the
            // app's picker can offer only those and reset a stale preference; null when
            // the model declares no list. Additive key: the apps decode bootstrap strictly.
            'reasoning_levels' => !empty( $m['params']['reasoning'] ) && is_array( $m['params']['reasoning'] ) ? array_values( $m['params']['reasoning'] ) : null,
          ];
        }
        if ( !empty( $chatModels ) ) {
          $out[] = [
            'id' => $env['id'],
            'name' => $env['name'],
            'type' => $env['type'],
            'models' => $chatModels,
          ];
        }
      }
      catch ( Exception $e ) {
        // An unusable env (bad key, unknown type) simply doesn't appear.
        continue;
      }
    }
    return $out;
  }

  /**
   * The internal bot behind the Workspace: based on the default chatbot so all
   * pipeline expectations hold, with a neutral personality. Client-sent envId
   * and model override it per conversation.
   */
  public function internal_chatbot( $chatbot, $botId, $params ) {
    if ( $botId !== self::BOT_ID || !empty( $chatbot ) ) {
      return $chatbot;
    }
    if ( !is_user_logged_in() || !$this->can_access() ) {
      return $chatbot;
    }
    $instructions = 'You are a capable, direct assistant. Format your answers in Markdown.';
    // "This WordPress" mode: remember the requested categories for this
    // request (chatbot_query attaches the tools) and tell the AI where it is.
    $wpTools = $params['wpTools'] ?? null;
    if ( is_array( $wpTools ) && !empty( $wpTools ) && $this->core->get_option( 'workspace_wp_tools' ) ) {
      $this->wpToolsCategories = array_values( array_filter( array_map(
        'sanitize_text_field',
        array_slice( $wpTools, 0, 20 )
      ) ) );
      // The user's approval decisions travel with the request (per chat).
      foreach ( [ 'wpToolsAllowed', 'wpToolsDenied' ] as $key ) {
        if ( isset( $params[$key] ) && is_array( $params[$key] ) ) {
          $this->{$key} = array_values( array_filter( array_map(
            'sanitize_text_field',
            array_slice( $params[$key], 0, 50 )
          ) ) );
        }
      }
      // Identifies the current turn for the write-tool result cache.
      $this->wpToolsTurnKey = md5( ( $params['chatId'] ?? '' ) . '|' . ( $params['newMessage'] ?? '' ) );
      $instructions .= "\n\nYou have direct tool access to this WordPress site: " .
        get_bloginfo( 'name' ) . ' (' . home_url() . '). Use the available tools to read, ' .
        'analyze and modify the site when the user asks. Before a destructive or ' .
        'hard-to-undo change (deleting content, changing options), state what you are ' .
        'about to do and ask for confirmation first.';
    }
    $base = $this->core->get_chatbot( 'default' );
    $base = is_array( $base ) ? $base : [];
    return array_merge( $base, [
      'botId' => self::BOT_ID,
      'name' => 'Workspace',
      'scope' => 'workspace',
      'instructions' => $instructions,
      'startSentence' => '',
      'localMemory' => false,
      'window' => false,
      'fullscreen' => false,
      'textInputMaxLength' => 32000,
      'maxMessages' => 100,
      'contentAware' => false,
      'imageUpload' => true,
      'fileUpload' => true,
      'multiUpload' => true,
      // The default bot's tools/knowledge must NOT leak into the Workspace:
      // its features are per-conversation, so only client-sent selections
      // apply (they merge over this config in chat_submit).
      'functions' => [],
      'mcpServers' => [],
      'tools' => [],
      'embeddingsEnvId' => '',
      'embeddingsIndex' => '',
      'embeddingsNamespace' => '',
    ] );
  }

  #region This WordPress (MCP tools as functions)

  private function get_mcp_tools() {
    static $tools = null;
    if ( $tools === null ) {
      $tools = $this->core->get_option( 'module_mcp' ) ? apply_filters( 'mwai_mcp_tools', [] ) : [];
      $tools = is_array( $tools ) ? $tools : [];
    }
    return $tools;
  }

  /**
   * Category catalog for the composer's "This WordPress" popover.
   */
  private function build_wp_tools() {
    $categories = [];
    foreach ( $this->get_mcp_tools() as $tool ) {
      if ( empty( $tool['name'] ) ) {
        continue;
      }
      // Keep the popover honest: never advertise (or count) a tool the query builder
      // refuses to attach.
      if ( in_array( $tool['name'], self::EXCLUDED_WP_TOOLS, true ) ) {
        continue;
      }
      // Same default as the MCP server's tools listing.
      $cat = !empty( $tool['category'] ) ? (string) $tool['category'] : 'AI Engine (Core)';
      if ( !isset( $categories[$cat] ) ) {
        $categories[$cat] = [ 'name' => $cat, 'count' => 0, 'tools' => [] ];
      }
      $categories[$cat]['count']++;
      $categories[$cat]['tools'][] = (string) $tool['name'];
    }
    ksort( $categories );
    return [
      'enabled' => (bool) $this->core->get_option( 'module_mcp' ) && (bool) $this->core->get_option( 'workspace_wp_tools' ),
      'site_name' => get_bloginfo( 'name' ),
      'categories' => array_values( $categories ),
    ];
  }

  public function chatbot_query( $query, $params ) {
    // Enforce the effective feature availability (Settings > Workspace + Pro).
    // The Workspace UI hides disabled features; this is the server-side gate.
    if ( ( $query->scope ?? '' ) === 'workspace' ) {
      $flags = $this->feature_flags();
      if ( !$flags['mcp'] && isset( $query->mcpServers ) ) {
        $query->mcpServers = [];
      }
      if ( !$flags['functions'] && !empty( $query->functions ) ) {
        $query->set_functions( [] );
      }
      if ( !$flags['image'] && !empty( $query->tools ) ) {
        $query->tools = array_values( array_diff( $query->tools, [ 'image_generation' ] ) );
      }
      if ( !$flags['web_search'] && !empty( $query->tools ) ) {
        $query->tools = array_values( array_diff( $query->tools, [ 'web_search' ] ) );
      }
      if ( !$flags['knowledge'] && isset( $query->embeddingsEnvId ) ) {
        $query->embeddingsEnvId = null;
      }
    }
    if ( $this->wpToolsCategories === null || !$this->can_access() ) {
      return $query;
    }
    $existing = [];
    foreach ( (array) $query->functions as $fn ) {
      $existing[$fn->name] = true;
    }
    foreach ( $this->get_mcp_tools() as $tool ) {
      $name = $tool['name'] ?? '';
      $cat = !empty( $tool['category'] ) ? (string) $tool['category'] : 'AI Engine (Core)';
      if ( empty( $name ) || isset( $existing[$name] ) || !in_array( $cat, $this->wpToolsCategories, true ) ) {
        continue;
      }
      if ( in_array( $name, self::EXCLUDED_WP_TOOLS, true ) ) {
        continue;
      }
      if ( !preg_match( '/^[a-zA-Z0-9_-]{1,64}$/', $name ) ) {
        continue;
      }
      $query->add_function( Meow_MWAI_Query_Function::from_raw_schema(
        $name,
        (string) ( $tool['description'] ?? '' ),
        is_array( $tool['inputSchema'] ?? null ) ? $tool['inputSchema'] : null,
        'mcp-bridge'
      ) );
      $existing[$name] = true;
      $this->wpToolNames[$name] = true;
    }
    return $query;
  }

  /**
  * A tool needs the user's approval when it can change the site. Core tools
  * carry MCP annotations (readOnlyHint); tools without annotations are judged
  * by their name, and unknown verbs count as writes: safe by default.
  */
  private function tool_requires_approval( $name ) {
    foreach ( $this->get_mcp_tools() as $tool ) {
      if ( ( $tool['name'] ?? '' ) === $name ) {
        $annotations = $tool['annotations'] ?? null;
        if ( is_array( $annotations ) ) {
          if ( array_key_exists( 'readOnlyHint', $annotations ) ) {
            return empty( $annotations['readOnlyHint'] );
          }
          // Annotated, but silent about writing: the provider knows about
          // annotations and still did not claim to be read-only, so ask. This
          // covers Code Engine functions, whose name is whatever PHP snippet
          // the user wrote and must never be trusted by the heuristic below.
          return true;
        }
        break;
      }
    }
    // No annotations at all: fall back to the name. A destructive verb wins
    // over a read-only one, otherwise a tool like
    // "dbclnr_run_custom_query_delete" reads as safe because it contains
    // "query" and would wipe rows with no dialog.
    if ( preg_match(
      '/(^|_)(delete|remove|drop|truncate|purge|destroy|reset|flush|clear|write|upload|install|uninstall|activate|deactivate|execute|run|import|restore|optimize|repair)(_|$)/i',
      $name
    ) ) {
      return true;
    }
    return !preg_match(
      '/(^|_)(get|list|count|search|query|check|compare|suggest|rank|preview|stats|statistics|status|profile|pulse|digest|mix|insights|ping)(_|$)/i',
      $name
    );
  }

  public function ai_feedback( $value, $needFeedback, $reply ) {
    if ( $value !== null ) {
      return $value;
    }
    $name = $needFeedback['name'] ?? null;
    // Only tools this request explicitly attached are executable, and only
    // for the (admin) user driving the Workspace.
    if ( !$name || empty( $this->wpToolNames[$name] ) || !$this->can_access() ) {
      return $value;
    }
    $args = $needFeedback['arguments'] ?? [];
    if ( is_string( $args ) ) {
      $decoded = json_decode( $args, true );
      $args = is_array( $decoded ) ? $decoded : [];
    }

    // Approval gate: anything that writes to the site pauses the turn and
    // asks the user in the UI, unless they already allowed this tool for the
    // conversation (or this run). A denial is handed to the AI as the result.
    if ( in_array( $name, $this->wpToolsDenied, true ) ) {
      return "The user DENIED running '{$name}'. Do not retry it. Briefly acknowledge this and ask the user how they would like to proceed instead.";
    }
    $needsApproval = $this->tool_requires_approval( $name );
    if ( !in_array( $name, $this->wpToolsAllowed, true ) && $needsApproval ) {
      throw new Meow_MWAI_ApprovalRequiredException( $name, $args );
    }

    // Approving a call re-runs the whole turn, so a write that already ran in
    // a previous pass of the SAME turn would execute twice (duplicate post,
    // double delete). Identical calls within one turn return the first result
    // instead. Keyed by chatId + user message, short-lived, writes only:
    // reads stay fresh and a new user message never hits the cache.
    $cacheKey = '';
    if ( $needsApproval && !empty( $this->wpToolsTurnKey ) ) {
      $cacheKey = 'mwai_ws_tool_' . md5( $this->wpToolsTurnKey . '|' . $name . '|' . wp_json_encode( $args ) );
      $cached = get_transient( $cacheKey );
      if ( is_array( $cached ) && array_key_exists( 'v', $cached ) ) {
        return $cached['v'];
      }
    }

    $out = null;
    $failed = false;
    try {
      // Handlers type the JSON-RPC id as ?int; the provider tool-call id is a
      // string ("call_..."), so pass a neutral int instead.
      //
      // The fifth argument is the MCP server instance, and there is none here:
      // the Workspace runs tools directly rather than over the MCP endpoint. It
      // is still passed, as null, so the filter has one arity everywhere. Firing
      // four arguments here while labs/mcp.php fires five meant a third-party
      // handler registered with add_filter( ..., 10, 5 ) worked over MCP and then
      // died with an ArgumentCountError the moment the same tool ran in the
      // Workspace. Handlers that want the instance must tolerate null.
      $result = apply_filters( 'mwai_mcp_callback', null, $name, $args, 0, null );
      if ( $result === null ) {
        $out = "The tool '{$name}' is not available on this site.";
        $failed = true;
      }
      else {
        // Some handlers return a full JSON-RPC envelope: unwrap it.
        if ( is_array( $result ) && isset( $result['jsonrpc'] ) ) {
          if ( isset( $result['error'] ) ) {
            $out = 'Error: ' . ( $result['error']['message'] ?? 'The tool failed.' );
            $failed = true;
          }
          $result = $result['result'] ?? null;
        }
        if ( $out === null ) {
          // MCP content envelope ({ content: [{type,text}], isError }): flatten
          // the text parts, which is what the model actually needs.
          if ( is_array( $result ) && isset( $result['content'] ) && is_array( $result['content'] ) ) {
            $texts = [];
            foreach ( $result['content'] as $part ) {
              if ( isset( $part['text'] ) ) {
                $texts[] = $part['text'];
              }
            }
            $flat = implode( "\n", $texts );
            $failed = !empty( $result['isError'] );
            $out = $failed ? 'Error: ' . $flat : $flat;
          }
          else {
            $out = $result;
          }
        }
      }
    }
    catch ( Throwable $e ) {
      $out = "Error: the tool '{$name}' crashed (" . $e->getMessage() . '). The other tools should still work.';
      $failed = true;
    }
    // Only successful write results are cached (see the note above); failures
    // may be retried fresh on the next pass.
    if ( $cacheKey !== '' && !$failed ) {
      set_transient( $cacheKey, [ 'v' => $out ], 5 * MINUTE_IN_SECONDS );
    }
    return $out;
  }

  #endregion

  #region Preferences (per WordPress user)

  public function rest_api_init() {
    register_rest_route( 'mwai/v1', '/workspace/prefs', [
      'methods' => [ 'GET', 'POST' ],
      'callback' => [ $this, 'rest_prefs' ],
      'permission_callback' => [ $this, 'can_access' ],
    ] );
    // The full tool catalog only exists in REST context: several providers
    // (AI Engine core among them) register their mwai_mcp_tools filter on
    // rest_api_init, so the admin page's localized copy misses them.
    register_rest_route( 'mwai/v1', '/workspace/wp-tools', [
      'methods' => [ 'GET', 'POST' ],
      'callback' => function () {
        return new WP_REST_Response( [ 'success' => true, 'wp_tools' => $this->build_wp_tools() ], 200 );
      },
      'permission_callback' => [ $this, 'can_access' ],
    ] );
    // One call for everything a client needs at launch (model catalog, prefs,
    // feature flags, tool catalog). The mobile companion uses this instead of
    // assembling it from settings/options + prefs + wp-tools.
    register_rest_route( 'mwai/v1', '/workspace/bootstrap', [
      'methods' => 'GET',
      'callback' => function () {
        return new WP_REST_Response( array_merge( [ 'success' => true ], $this->build_bootstrap() ), 200 );
      },
      'permission_callback' => [ $this, 'can_access' ],
    ] );
    register_rest_route( 'mwai/v1', '/workspace/image-info', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_image_info' ],
      'permission_callback' => [ $this, 'can_access' ],
    ] );
    register_rest_route( 'mwai/v1', '/workspace/image-persist', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_image_persist' ],
      'permission_callback' => [ $this, 'can_access' ],
    ] );

    // Mobile pairing (QR connect).
    register_rest_route( 'mwai/v1', '/workspace/pair-token', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_pair_token' ],
      'permission_callback' => [ $this, 'can_access' ],
    ] );
    // Public on purpose: gated entirely by the one-time, short-lived token.
    register_rest_route( 'mwai/v1', '/workspace/pair', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_pair' ],
      'permission_callback' => '__return_true',
    ] );
    // Public on purpose: it only describes the caller's own request. See rest_auth_check().
    register_rest_route( 'mwai/v1', '/workspace/auth-check', [
      'methods' => 'GET',
      'callback' => [ $this, 'rest_auth_check' ],
      'permission_callback' => '__return_true',
    ] );
    register_rest_route( 'mwai/v1', '/workspace/pair-check', [
      'methods' => 'GET',
      'callback' => [ $this, 'rest_pair_check' ],
      'permission_callback' => [ $this, 'can_access' ],
    ] );
    register_rest_route( 'mwai/v1', '/workspace/devices', [
      'methods' => 'GET',
      'callback' => [ $this, 'rest_devices' ],
      'permission_callback' => [ $this, 'can_access' ],
    ] );
    register_rest_route( 'mwai/v1', '/workspace/devices/revoke', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_device_revoke' ],
      'permission_callback' => [ $this, 'can_access' ],
    ] );
    register_rest_route( 'mwai/v1', '/workspace/devices/rename', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_device_rename' ],
      'permission_callback' => [ $this, 'can_access' ],
    ] );
  }

  #region Mobile pairing (QR connect)

  // Application Passwords named with this prefix are "paired devices".
  public const PAIR_APP_PREFIX = 'Workspace by AI Engine';
  public const PAIR_TOKEN_TTL = 300; // 5 minutes.
  /**
  * Everything that can stop a phone from connecting (a server that drops the
  * Authorization header, a security plugin filtering the REST API, a revoked
  * device) is explained here. The messages below name the problem and link out
  * rather than trying to teach .htaccess in a banner, the same way the MCP
  * self-test points at the same page for its own failures.
  *
  * The fragment matters: that page opens on MCP and OAuth, so a phone user
  * landing at the top would not recognise their problem. If the anchor is ever
  * dropped from the page the link still works, it just lands higher up.
  */
  public const DOC_MOBILE_URL = 'https://meowapps.com/fix-mcp-wordpress-connection/#workspace-mobile';

  private function pairing_available( $user = null ) {
    if ( !class_exists( 'WP_Application_Passwords' ) || !function_exists( 'wp_is_application_passwords_available' ) ) {
      return false;
    }
    if ( !wp_is_application_passwords_available() ) {
      return false;
    }
    if ( $user && !wp_is_application_passwords_available_for_user( $user ) ) {
      return false;
    }
    return true;
  }

  private function pairing_unavailable_reason() {
    if ( !function_exists( 'wp_is_application_passwords_available' ) || !wp_is_application_passwords_available() ) {
      return 'Application Passwords are disabled on this site (they require HTTPS). Enable HTTPS or Application Passwords to connect a mobile app.';
    }
    return 'Application Passwords are not available for this account.';
  }

  /**
  * Admin action: mint a short-lived, single-use pairing token and return the
  * QR payload. The token's hash (not the token) is stored server-side.
  */
  public function rest_pair_token( $request ) {
    if ( !$this->pairing_available( wp_get_current_user() ) ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => $this->pairing_unavailable_reason() ], 200 );
    }
    try {
      $token = bin2hex( random_bytes( 24 ) ); // 48 hex chars: infeasible to guess in 5 min.
    }
    catch ( Exception $e ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'Could not generate a secure token.' ], 500 );
    }
    set_transient(
      'mwai_pair_' . hash( 'sha256', $token ),
      [ 'user_id' => get_current_user_id(), 't' => time() ],
      self::PAIR_TOKEN_TTL
    );
    return new WP_REST_Response( [
      'success' => true,
      'payload' => [ 'v' => 1, 'url' => untrailingslashit( home_url() ), 'pair' => $token ],
      'expires_in' => self::PAIR_TOKEN_TTL,
      'site_name' => get_bloginfo( 'name' ),
    ], 200 );
  }

  /**
  * Public: the mobile app exchanges a valid pairing token for a WordPress
  * Application Password (created for the admin who generated the token).
  */
  public function rest_pair( $request ) {
    // Defense in depth (tokens are already unguessable): rate-limit per IP.
    $ip = method_exists( $this->core, 'get_ip_address' ) ? $this->core->get_ip_address() : ( $_SERVER['REMOTE_ADDR'] ?? '' );
    $rlKey = 'mwai_pair_rl_' . md5( (string) $ip );
    $attempts = (int) get_transient( $rlKey );
    if ( $attempts >= 20 ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'Too many attempts. Please wait a minute.' ], 429 );
    }
    set_transient( $rlKey, $attempts + 1, MINUTE_IN_SECONDS );

    $params = $request->get_json_params();
    $token = isset( $params['token'] ) ? (string) $params['token'] : '';
    $device = isset( $params['device'] ) ? mb_substr( sanitize_text_field( $params['device'] ), 0, 60 ) : '';
    if ( $device === '' ) {
      $device = 'Mobile device';
    }
    if ( $token === '' || !ctype_xdigit( $token ) || strlen( $token ) > 128 ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'Invalid pairing code.' ], 400 );
    }
    $tKey = 'mwai_pair_' . hash( 'sha256', $token );
    $data = get_transient( $tKey );
    if ( !is_array( $data ) || empty( $data['user_id'] ) ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'This pairing code has expired. Generate a new one.' ], 400 );
    }
    delete_transient( $tKey ); // single use.

    $user = get_user_by( 'id', (int) $data['user_id'] );
    if ( !$user || !user_can( $user, 'manage_options' ) ) {
      // The token was consumed above, so a rescan of the same code cannot work: say so.
      return new WP_REST_Response( [ 'success' => false, 'message' => 'That account can no longer connect a mobile app. Generate a new pairing code once it can.' ], 403 );
    }
    if ( !$this->pairing_available( $user ) ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => $this->pairing_unavailable_reason() . ' Once that is fixed, generate a new pairing code.' ], 400 );
    }

    $created = WP_Application_Passwords::create_new_application_password(
      $user->ID,
      [ 'name' => self::PAIR_APP_PREFIX . ' - ' . $device ]
    );
    if ( is_wp_error( $created ) ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => $created->get_error_message() ], 500 );
    }
    list( $password, $item ) = $created;

    return new WP_REST_Response( [
      'success' => true,
      'url' => untrailingslashit( home_url() ),
      'rest_url' => untrailingslashit( get_rest_url() ),
      'site_name' => get_bloginfo( 'name' ),
      'user' => $user->user_login,
      'app_password' => $password, // WordPress reveals this exactly once.
      'uuid' => $item['uuid'] ?? null,
    ], 200 );
  }

  /**
  * What did this server actually do with the credentials the caller sent?
  *
  * A device can pair perfectly and then get 401 on every single call, and from
  * inside WordPress that is invisible: the two usual causes (the server never
  * forwards the Authorization header to PHP, or a security plugin refuses
  * Application Password authentication) both look like "not logged in". The
  * mobile app calls this after an unexpected 401 so it can name the real
  * problem instead of telling the user to reconnect forever.
  *
  * Public on purpose: every field describes the caller's own request, so this
  * tells an attacker exactly what a 401 from any other endpoint already does.
  */
  public function rest_auth_check( $request ) {
    // It answers "were those credentials good?" with a 200, which is no more
    // than any authenticated route already reveals through its 401. Still, the
    // cheerful phrasing is the kind of thing a reviewer stops on, so it gets the
    // same per-IP limiter as the pairing route. A client only ever calls this
    // once, after a failure.
    $ip = method_exists( $this->core, 'get_ip_address' ) ? $this->core->get_ip_address() : ( $_SERVER['REMOTE_ADDR'] ?? '' );
    $rlKey = 'mwai_authchk_rl_' . md5( (string) $ip );
    $attempts = (int) get_transient( $rlKey );
    if ( $attempts >= 30 ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'Too many attempts. Please wait a minute.' ], 429 );
    }
    set_transient( $rlKey, $attempts + 1, MINUTE_IN_SECONDS );

    $header = $request instanceof WP_REST_Request ? (string) $request->get_header( 'authorization' ) : '';
    // Either location counts: mod_php consumes the header into PHP_AUTH_* and
    // leaves get_header() empty, which is still a server that forwards it.
    $sawHeader = $header !== '' || !empty( $_SERVER['PHP_AUTH_USER'] );
    $userId = get_current_user_id();
    $viaAppPassword = function_exists( 'rest_get_authenticated_app_password' )
      && (bool) rest_get_authenticated_app_password();

    if ( !$sawHeader ) {
      // Careful with this wording: "the client sent nothing" and "the client
      // sent credentials and this server stripped them" arrive here completely
      // identically, so naming the server as the culprit would send users to
      // their host for a bug that may be in the client. pair-check is the route
      // that may be confident about it: it probes with a header it knows it sent.
      $reason = 'no_authorization_header';
      // The URL is inlined in the text as well as returned separately: a client
      // that only renders `message` still gives the user somewhere to go.
      $message = 'No credentials reached WordPress. Either the app sent none, or this server does not forward the Authorization header to PHP, which is a common host setting. ' . self::DOC_MOBILE_URL;
    }
    elseif ( !$userId ) {
      $reason = 'credentials_rejected';
      $message = 'WordPress received the credentials but refused them. The app password may have been revoked, or a security plugin may be blocking Application Passwords. ' . self::DOC_MOBILE_URL;
    }
    elseif ( !current_user_can( 'manage_options' ) ) {
      $reason = 'not_admin';
      $message = 'That account is not an administrator, and the Workspace is available to administrators only.';
    }
    else {
      $reason = 'ok';
      $message = 'Authentication is working.';
    }

    return new WP_REST_Response( [
      'success' => true,
      'reason' => $reason,
      'message' => $message,
      'authorization_header' => $sawHeader,
      'authenticated' => $userId > 0,
      'app_password' => $viaAppPassword,
      'can_use_workspace' => $userId > 0 && current_user_can( 'manage_options' ),
      'app_passwords_available' => $this->pairing_available( $userId ? wp_get_current_user() : null ),
      'ssl' => is_ssl(),
      'doc_url' => self::DOC_MOBILE_URL,
    ], 200 );
  }

  /**
  * Admin-side pre-flight for the QR panel: a loopback request back to this same
  * site, carrying an Authorization header, to find out whether the header
  * survives the trip to PHP. When it doesn't, pairing still succeeds (that
  * endpoint is public) and every call after it fails, so the admin gets warned
  * before scanning rather than after three revoked devices.
  *
  * The probe deliberately sends a Bearer token, not Basic credentials: it is a
  * question about the header, not a login attempt, and a fake Basic login would
  * feed the site's own IP to brute-force counters.
  */
  public function rest_pair_check( $request ) {
    $response = wp_remote_get( rest_url( 'mwai/v1/workspace/auth-check' ), [
      'timeout' => 10,
      'headers' => [ 'Authorization' => 'Bearer mwai-header-probe' ],
      'sslverify' => apply_filters( 'mwai_workspace_self_test_sslverify', true ),
    ] );
    // A blocked or failing loopback says nothing about the header: stay quiet
    // rather than warn about a problem that may not exist.
    if ( is_wp_error( $response ) || wp_remote_retrieve_response_code( $response ) !== 200 ) {
      return new WP_REST_Response( [ 'success' => true, 'status' => 'unknown' ], 200 );
    }
    $body = json_decode( wp_remote_retrieve_body( $response ), true );
    if ( !is_array( $body ) || !array_key_exists( 'authorization_header', $body ) ) {
      return new WP_REST_Response( [ 'success' => true, 'status' => 'unknown' ], 200 );
    }
    if ( empty( $body['authorization_header'] ) ) {
      return new WP_REST_Response( [
        'success' => true,
        'status' => 'header_stripped',
        // No URL inline here: the admin panel renders doc_url as a real link.
        'message' => 'This server does not forward the Authorization header to WordPress, so pairing will look like it worked but the app will not be able to connect.',
        'doc_url' => self::DOC_MOBILE_URL,
      ], 200 );
    }
    return new WP_REST_Response( [ 'success' => true, 'status' => 'ok' ], 200 );
  }

  public function rest_devices( $request ) {
    if ( !class_exists( 'WP_Application_Passwords' ) ) {
      return new WP_REST_Response( [ 'success' => true, 'devices' => [], 'available' => false ], 200 );
    }
    $passwords = WP_Application_Passwords::get_user_application_passwords( get_current_user_id() );
    $devices = [];
    foreach ( (array) $passwords as $p ) {
      if ( isset( $p['name'] ) && strpos( $p['name'], self::PAIR_APP_PREFIX ) === 0 ) {
        $devices[] = [
          'uuid' => $p['uuid'] ?? '',
          'name' => $p['name'],
          'created' => $p['created'] ?? null,
          'last_used' => $p['last_used'] ?? null,
          'last_ip' => $p['last_ip'] ?? null,
        ];
      }
    }
    return new WP_REST_Response( [ 'success' => true, 'devices' => $devices, 'available' => $this->pairing_available( wp_get_current_user() ) ], 200 );
  }

  public function rest_device_revoke( $request ) {
    $params = $request->get_json_params();
    $uuid = isset( $params['uuid'] ) ? sanitize_text_field( (string) $params['uuid'] ) : '';
    if ( $uuid === '' || !class_exists( 'WP_Application_Passwords' ) ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'Invalid device.' ], 400 );
    }
    // Only revoke our own paired devices, and only the current user's.
    $userId = get_current_user_id();
    $target = WP_Application_Passwords::get_user_application_password( $userId, $uuid );
    if ( !$target || strpos( $target['name'] ?? '', self::PAIR_APP_PREFIX ) !== 0 ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'That device was not found.' ], 404 );
    }
    $res = WP_Application_Passwords::delete_application_password( $userId, $uuid );
    if ( is_wp_error( $res ) || !$res ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'Could not revoke that device.' ], 200 );
    }
    return new WP_REST_Response( [ 'success' => true ], 200 );
  }

  // The device name lives in the Application Password label ("Workspace by AI
  // Engine - <device>"), so renaming is a label update. iOS reports every phone
  // as "iPhone" unless the app holds Apple's device-name entitlement, which is
  // why the list needs a rename at all.
  public function rest_device_rename( $request ) {
    $params = $request->get_json_params();
    $uuid = isset( $params['uuid'] ) ? sanitize_text_field( (string) $params['uuid'] ) : '';
    $name = isset( $params['name'] ) ? mb_substr( trim( sanitize_text_field( (string) $params['name'] ) ), 0, 60 ) : '';
    if ( $uuid === '' || $name === '' || !class_exists( 'WP_Application_Passwords' ) ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'Please enter a name for this device.' ], 400 );
    }
    $userId = get_current_user_id();
    $target = WP_Application_Passwords::get_user_application_password( $userId, $uuid );
    if ( !$target || strpos( $target['name'] ?? '', self::PAIR_APP_PREFIX ) !== 0 ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'That device was not found.' ], 404 );
    }
    $fullName = self::PAIR_APP_PREFIX . ' - ' . $name;
    $res = WP_Application_Passwords::update_application_password( $userId, $uuid, [ 'name' => $fullName ] );
    if ( is_wp_error( $res ) || !$res ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'Could not rename that device.' ], 200 );
    }
    return new WP_REST_Response( [ 'success' => true, 'name' => $fullName ], 200 );
  }

  #endregion

  #region Images (expiry info + move to Media Library)

  private function get_file_row_by_url( $url ) {
    global $wpdb;
    return $wpdb->get_row( $wpdb->prepare(
      "SELECT * FROM {$wpdb->prefix}mwai_files WHERE url = %s",
      $url
    ), ARRAY_A );
  }

  public function rest_image_info( $request ) {
    $params = $request->get_json_params();
    $urls = isset( $params['urls'] ) && is_array( $params['urls'] ) ? array_slice( $params['urls'], 0, 30 ) : [];
    $images = [];
    foreach ( $urls as $url ) {
      $url = esc_url_raw( (string) $url );
      if ( empty( $url ) ) {
        continue;
      }
      $row = $this->get_file_row_by_url( $url );
      if ( $row ) {
        $images[$url] = [
          'status' => 'file',
          // The files table stores UTC (WP pins PHP to UTC).
          'expires' => !empty( $row['expires'] ) ? strtotime( $row['expires'] . ' +0000' ) : null,
        ];
      }
      else {
        $images[$url] = [ 'status' => attachment_url_to_postid( $url ) ? 'library' : 'unknown' ];
      }
    }
    return new WP_REST_Response( [ 'success' => true, 'now' => time(), 'images' => $images ], 200 );
  }

  public function rest_image_persist( $request ) {
    $params = $request->get_json_params();
    $url = esc_url_raw( (string) ( $params['url'] ?? '' ) );
    $chatId = sanitize_text_field( (string) ( $params['chatId'] ?? '' ) );
    $row = $url ? $this->get_file_row_by_url( $url ) : null;
    if ( !$row || empty( $row['path'] ) || !file_exists( $row['path'] ) ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'This image is not available anymore.' ], 404 );
    }
    $filetype = wp_check_filetype( $row['path'] );
    if ( empty( $filetype['type'] ) || strpos( $filetype['type'], 'image/' ) !== 0 ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'Only images can be saved to the Media Library.' ], 400 );
    }

    $upload = wp_upload_bits( basename( $row['path'] ), null, file_get_contents( $row['path'] ) );
    if ( !empty( $upload['error'] ) ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => $upload['error'] ], 500 );
    }
    $attachmentId = wp_insert_attachment( [
      'post_mime_type' => $filetype['type'],
      'post_title' => sanitize_file_name( pathinfo( $row['path'], PATHINFO_FILENAME ) ),
      'post_status' => 'inherit',
    ], $upload['file'] );
    if ( is_wp_error( $attachmentId ) ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => $attachmentId->get_error_message() ], 500 );
    }
    require_once ABSPATH . 'wp-admin/includes/image.php';
    wp_update_attachment_metadata( $attachmentId, wp_generate_attachment_metadata( $attachmentId, $upload['file'] ) );
    $newUrl = wp_get_attachment_url( $attachmentId );

    // Rewrite the URL in the conversation history so it survives the temp
    // file's expiration (and this Workspace reload shows the new URL).
    if ( !empty( $chatId ) && !empty( $this->core->discussions ) ) {
      $discussion = $this->core->discussions->get_discussion( self::BOT_ID, $chatId );
      if ( $discussion ) {
        $messages = $discussion['messages'];
        foreach ( $messages as $m ) {
          if ( isset( $m->content ) && is_string( $m->content ) ) {
            $m->content = str_replace( $url, $newUrl, $m->content );
          }
        }
        global $wpdb;
        $wpdb->update(
          $this->core->discussions->table_chats,
          [ 'messages' => wp_json_encode( $messages ), 'updated' => date( 'Y-m-d H:i:s' ) ],
          [ 'id' => $discussion['id'] ]
        );
      }
    }

    // Drop the temp file (record + physical) now that the attachment owns the
    // image; the history no longer references the old URL.
    if ( !empty( $this->core->files ) ) {
      $this->core->files->delete_files( [ (int) $row['id'] ] );
    }

    return new WP_REST_Response( [ 'success' => true, 'url' => $newUrl, 'attachmentId' => $attachmentId ], 200 );
  }

  #endregion

  private function get_prefs() {
    $defaults = [
      'theme' => 'dark', 'accent' => 'blue', 'envId' => null, 'model' => null,
      'collapsed' => false, 'prompts' => [],
      'pinned' => [ 'uploads', 'knowledge' ],
      'knowledgeEnvId' => null, 'mcpServers' => [], 'functions' => [],
      'imageMode' => false,
      'webSearchMode' => false,
      'wpMode' => false, 'wpCategories' => [ 'AI Engine (Core)' ],
      'advanced' => [ 'temperature' => null, 'reasoningEffort' => null ],
      'pinnedChats' => [],
      'folders' => [],
    ];
    $prefs = get_user_meta( get_current_user_id(), self::PREFS_META, true );
    return is_array( $prefs ) ? array_merge( $defaults, $prefs ) : $defaults;
  }

  public function rest_prefs( $request ) {
    if ( $request->get_method() === 'POST' ) {
      $params = $request->get_json_params();
      $prefs = $this->get_prefs();
      if ( isset( $params['theme'] ) && in_array( $params['theme'], [ 'dark', 'light' ], true ) ) {
        $prefs['theme'] = $params['theme'];
      }
      if ( isset( $params['accent'] ) ) {
        $prefs['accent'] = sanitize_key( $params['accent'] );
      }
      if ( array_key_exists( 'envId', $params ) ) {
        $prefs['envId'] = $params['envId'] ? sanitize_text_field( $params['envId'] ) : null;
      }
      if ( array_key_exists( 'model', $params ) ) {
        $prefs['model'] = $params['model'] ? sanitize_text_field( $params['model'] ) : null;
      }
      if ( isset( $params['collapsed'] ) ) {
        $prefs['collapsed'] = (bool) $params['collapsed'];
      }
      if ( isset( $params['imageMode'] ) ) {
        $prefs['imageMode'] = (bool) $params['imageMode'];
      }
      if ( isset( $params['webSearchMode'] ) ) {
        $prefs['webSearchMode'] = (bool) $params['webSearchMode'];
      }
      if ( isset( $params['wpMode'] ) ) {
        $prefs['wpMode'] = (bool) $params['wpMode'];
      }
      if ( isset( $params['wpCategories'] ) && is_array( $params['wpCategories'] ) ) {
        $prefs['wpCategories'] = array_values( array_filter( array_map(
          'sanitize_text_field',
          array_slice( $params['wpCategories'], 0, 20 )
        ) ) );
      }
      if ( isset( $params['advanced'] ) && is_array( $params['advanced'] ) ) {
        $temp = $params['advanced']['temperature'] ?? null;
        $effort = $params['advanced']['reasoningEffort'] ?? null;
        $prefs['advanced'] = [
          'temperature' => is_numeric( $temp ) ? max( 0, min( 2, (float) $temp ) ) : null,
          // The full OpenAI scale; the engine snaps it to what the chosen model declares.
          'reasoningEffort' => in_array( $effort, [ 'none', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max' ], true ) ? $effort : null,
        ];
      }
      if ( isset( $params['folders'] ) && is_array( $params['folders'] ) ) {
        $clean = [];
        foreach ( array_slice( $params['folders'], 0, 30 ) as $f ) {
          if ( !is_array( $f ) ) {
            continue;
          }
          $name = mb_substr( sanitize_text_field( $f['name'] ?? '' ), 0, 60 );
          if ( $name === '' ) {
            continue;
          }
          $clean[] = [
            'id' => sanitize_key( $f['id'] ?? uniqid( 'f' ) ),
            'name' => $name,
            'collapsed' => !empty( $f['collapsed'] ),
            'chats' => array_values( array_filter( array_map(
              'sanitize_text_field',
              array_slice( (array) ( $f['chats'] ?? [] ), 0, 200 )
            ) ) ),
          ];
        }
        $prefs['folders'] = $clean;
      }
      if ( isset( $params['pinnedChats'] ) && is_array( $params['pinnedChats'] ) ) {
        $prefs['pinnedChats'] = array_values( array_filter( array_map(
          'sanitize_text_field',
          array_slice( $params['pinnedChats'], 0, 200 )
        ) ) );
      }
      if ( array_key_exists( 'knowledgeEnvId', $params ) ) {
        $prefs['knowledgeEnvId'] = $params['knowledgeEnvId'] ? sanitize_text_field( $params['knowledgeEnvId'] ) : null;
      }
      if ( isset( $params['pinned'] ) && is_array( $params['pinned'] ) ) {
        $allowed = [ 'uploads', 'image', 'web_search', 'knowledge', 'mcp', 'functions', 'wordpress' ];
        $prefs['pinned'] = array_values( array_intersect( array_map( 'sanitize_key', $params['pinned'] ), $allowed ) );
      }
      if ( isset( $params['mcpServers'] ) && is_array( $params['mcpServers'] ) ) {
        $prefs['mcpServers'] = array_values( array_filter( array_map(
          'sanitize_text_field',
          array_slice( $params['mcpServers'], 0, 50 )
        ) ) );
      }
      if ( isset( $params['functions'] ) && is_array( $params['functions'] ) ) {
        $clean = [];
        foreach ( array_slice( $params['functions'], 0, 100 ) as $f ) {
          if ( is_array( $f ) && !empty( $f['id'] ) && !empty( $f['type'] ) ) {
            $clean[] = [ 'type' => sanitize_text_field( $f['type'] ), 'id' => sanitize_text_field( $f['id'] ) ];
          }
        }
        $prefs['functions'] = $clean;
      }
      if ( isset( $params['prompts'] ) && is_array( $params['prompts'] ) ) {
        $clean = [];
        foreach ( array_slice( $params['prompts'], 0, 200 ) as $p ) {
          if ( !is_array( $p ) ) {
            continue;
          }
          $title = mb_substr( sanitize_text_field( $p['title'] ?? '' ), 0, 200 );
          $content = mb_substr( sanitize_textarea_field( $p['content'] ?? '' ), 0, 20000 );
          if ( $title === '' && $content === '' ) {
            continue;
          }
          $clean[] = [
            'id' => sanitize_key( $p['id'] ?? uniqid( 'p' ) ),
            'title' => $title,
            'content' => $content,
          ];
        }
        $prefs['prompts'] = $clean;
      }
      update_user_meta( get_current_user_id(), self::PREFS_META, $prefs );
      return new WP_REST_Response( [ 'success' => true, 'prefs' => $prefs ], 200 );
    }
    return new WP_REST_Response( [ 'success' => true, 'prefs' => $this->get_prefs() ], 200 );
  }

  #endregion
}
