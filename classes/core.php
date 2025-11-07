<?php

require_once( MWAI_PATH . '/vendor/autoload.php' );
require_once( MWAI_PATH . '/constants/init.php' );

define( 'MWAI_IMG_WAND', MWAI_URL . '/images/wand.png' );
define( 'MWAI_IMG_WAND_HTML', "<img style='height: 22px; margin-bottom: -5px; margin-right: 8px;'
  src='" . MWAI_IMG_WAND . "' alt='AI Wand' />" );
define( 'MWAI_IMG_WAND_HTML_XS', "<img style='height: 16px; margin-bottom: -2px;'
  src='" . MWAI_IMG_WAND . "' alt='AI Wand' />" );

class Meow_MWAI_Core {
  public $admin = null;
  public $is_rest = false;
  public $is_cli = false;
  public $site_url = null;
  public $files = null;
  public $tasks = null;
  public $magicWand = null;
  private $options = null;
  private $option_name = 'mwai_options';
  private $themes_option_name = 'mwai_themes';
  private $chatbots_option_name = 'mwai_chatbots';
  private $nonce = null;

  public $chatbot = null;
  public $discussions = null;
  public $search = null;
  public $advisor = null;

  // Service instances for improved architecture
  public $responseIdManager = null;
  public $messageBuilder = null;
  public $sessionService = null;
  public $imageService = null;
  public $usageStatsService = null;
  public $modelEnvironmentService = null;

  public function __construct() {
    Meow_MWAI_Logging::init( 'mwai_options', 'AI Engine' );
    $this->site_url = get_site_url();
    $this->is_rest = MeowCommon_Helpers::is_rest();
    $this->is_cli = defined( 'WP_CLI' );
    $this->files = new Meow_MWAI_Modules_Files( $this );
    $this->tasks = new Meow_MWAI_Modules_Tasks( $this );
    $this->advisor = new Meow_MWAI_Modules_Advisor( $this );

    // Load task examples in Dev Mode
    if ( $this->get_option( 'dev_mode' ) ) {
      new Meow_MWAI_Modules_Tasks_Examples( $this );
    }

    add_action( 'plugins_loaded', [ $this, 'init' ] );
    add_action( 'wp_register_script', [ $this, 'register_scripts' ] );
    add_action( 'wp_enqueue_scripts', [ $this, 'register_scripts' ] );
    add_action( 'admin_enqueue_scripts', [ $this, 'register_scripts' ] );
  }

  #region Init & Scripts
  public function init() {
    global $mwai;
    $this->chatbot = null;
    $this->discussions = null;

    // Initialize services here after autoloader is ready
    $this->responseIdManager = new Meow_MWAI_Services_ResponseIdManager( $this );
    $this->messageBuilder = new Meow_MWAI_Services_MessageBuilder( $this );
    $this->sessionService = new Meow_MWAI_Services_Session( $this );
    $this->imageService = new Meow_MWAI_Services_Image( $this );
    $this->usageStatsService = new Meow_MWAI_Services_UsageStats( $this );
    $this->modelEnvironmentService = new Meow_MWAI_Services_ModelEnvironment( $this );

    // Start session early if needed for REST requests
    if ( $this->is_rest && $this->sessionService->can_start_session() ) {
      session_start();
    }

    new Meow_MWAI_Modules_Security( $this );

    // REST API
    if ( $this->is_rest ) {
      new Meow_MWAI_Rest( $this );
    }

    // WP Admin
    if ( is_admin() ) {
      new Meow_MWAI_Admin( $this );
    }

    // GDPR Module
    if ( $this->get_option( 'chatbot_gdpr_consent' ) ) {
      new Meow_MWAI_Modules_GDPR( $this );
    }

    // Suggestions Module
    if ( $this->get_option( 'module_suggestions' ) && ( is_admin() || $this->is_rest ) ) {
      $this->magicWand = new Meow_MWAI_Modules_Wand( $this );
    }


    // Chatbots & Discussions
    if ( $this->get_option( 'module_chatbots' ) ) {
      $this->chatbot = new Meow_MWAI_Modules_Chatbot();
      // Only instantiate discussions if the feature is enabled
      if ( $this->get_option( 'chatbot_discussions' ) ) {
        $this->discussions = new Meow_MWAI_Modules_Discussions();
      }
    }

    // Search
    if ( $this->get_option( 'module_search' ) ) {
      $this->search = new Meow_MWAI_Modules_Search( $this );
    }

    // Forms Manager (standalone Forms UI + shortcode renderer)
    if ( $this->get_option( 'module_forms' ) ) {
      new Meow_MWAI_Modules_Forms_Manager( $this );
    }

    // Advanced Core
    if ( class_exists( 'MeowPro_MWAI_Core' ) ) {
      new MeowPro_MWAI_Core( $this );
    }

    // Simple API
    $mwai = new Meow_MWAI_API( $this->chatbot, $this->discussions ?? null );

    // MCP
    if ( $this->get_option( 'module_mcp' ) ) {
      new Meow_MWAI_Labs_MCP( $this );

      // Core - Core WordPress MCP tools
      if ( $this->get_option( 'mcp_core' ) ) {
        new Meow_MWAI_Labs_MCP_Core( $this );
      }

      // Dynamic REST - WordPress REST API MCP tools
      if ( $this->get_option( 'mcp_dynamic_rest' ) ) {
        require_once MWAI_PATH . '/labs/mcp-rest.php';
        new Meow_MWAI_Labs_MCP_Rest();
      }

      // Themes - Pro theme management MCP tools
      if ( $this->get_option( 'mcp_themes' ) && class_exists( 'MeowPro_MWAI_MCP_Theme' ) ) {
        new MeowPro_MWAI_MCP_Theme( $this );
      }

      // Plugins - Pro plugin management MCP tools
      if ( $this->get_option( 'mcp_plugins' ) && class_exists( 'MeowPro_MWAI_MCP_Plugin' ) ) {
        new MeowPro_MWAI_MCP_Plugin( $this );
      }
    }
  }

  public function register_scripts() {
    // Register Highlight.js
    wp_register_script( 'mwai_highlight', MWAI_URL . 'vendor/highlightjs/highlight.min.js', [], '11.7', false );
    // Register CSS for the themes
    $themes = $this->get_themes();
    foreach ( $themes as $theme ) {
      if ( $theme['type'] === 'internal' ) {
        $themeId = $theme['themeId'];
        $filename = $themeId . '.css';
        $physical_file = trailingslashit( MWAI_PATH ) . 'themes/' . $filename;
        $cache_buster = file_exists( $physical_file ) ? filemtime( $physical_file ) : MWAI_VERSION;
        wp_register_style( 'mwai_chatbot_theme_' . $themeId, trailingslashit( MWAI_URL )
            . 'themes/' . $filename, [], $cache_buster );
      }
    }
  }

  public function enqueue_theme( $themeId ) {
    if ( empty( $themeId ) ) {
      return;
    }
    wp_enqueue_style( "mwai_chatbot_theme_$themeId" );
  }

  public function enqueue_themes() {
    $themes = $this->get_themes();
    foreach ( $themes as $theme ) {
      if ( $theme['type'] === 'internal' ) {
        $this->enqueue_theme( $theme['themeId'] );
      }
    }
  }

  #endregion

  #region Roles & Capabilities
  public function can_start_session() {
    return $this->sessionService->can_start_session();
  }

  public function can_access_settings() {
    return apply_filters( 'mwai_allow_setup', current_user_can( 'manage_options' ) );
  }

  public function can_access_features() {
    $editor_or_admin = current_user_can( 'editor' ) || current_user_can( 'administrator' );
    return apply_filters( 'mwai_allow_usage', $editor_or_admin );
  }

  public function can_access_public_api( $feature, $extra ) {
    $logged_in = is_user_logged_in();
    return apply_filters( 'mwai_allow_public_api', $logged_in, $feature, $extra );
  }
  #endregion

  #region AI-Related Helpers
  public function run_query( $query, $streamCallback = null, $markdown = false ) {

    // Allow to modify the query before it is sent.
    // Different query types have specific filters for type-safe modifications.
    if ( $query instanceof Meow_MWAI_Query_Embed ) {
      $query = apply_filters( 'mwai_ai_embeddings_query', $query );
    } else if ( $query instanceof Meow_MWAI_Query_Feedback ) {
      $query = apply_filters( 'mwai_ai_feedback_query', $query );
    } else {
      $query = apply_filters( 'mwai_ai_query', $query );
    }

    // Ensure the query is still valid after filtering
    if ( !$query || !is_object( $query ) ) {
      throw new Exception( __( 'Invalid query object after filtering. The mwai_ai_query filter must return a valid query object.', 'ai-engine' ) );
    }

    // Validate that embeddings queries have a non-empty message
    if ( $query instanceof Meow_MWAI_Query_Embed && empty( $query->get_message() ) ) {
      throw new Exception( __( 'Embeddings query cannot have an empty message. Please check that the conversation context is properly extracted.', 'ai-engine' ) );
    }

    // Let's check the default environment and model.
    $this->validate_env_model( $query );

    // Create the engine based on the query's environment
    $engine = Meow_MWAI_Engines_Factory::get( $this, $query->envId );

    // Let's run the query.
    $reply = $engine->run( $query, $streamCallback );

    // Let's allow to modify the reply before it is sent.
    if ( $markdown ) {
      if ( $query instanceof Meow_MWAI_Query_Image || $query instanceof Meow_MWAI_Query_EditImage ) {
        $reply->result = '';
        foreach ( $reply->results as $result ) {
          $reply->result .= "![Image]($result)\n";
        }
      }
    }

    return $reply;
  }

  public function validate_env_model( $query ) {
    return $this->modelEnvironmentService->validate_env_model( $query );
  }

  #endregion

  #region Text-Related Helpers

  // Clean the text perfectly, resolve shortcodes, etc, etc.
  public function clean_text( $rawText = '' ) {
    $text = html_entity_decode( $rawText );
    $text = wp_strip_all_tags( $text );
    $text = preg_replace( '/[\r\n]+/', "\n", $text );
    $text = preg_replace( '/\n+/', "\n", $text );
    $text = preg_replace( '/\t+/', "\t", $text );
    return $text . ' ';
  }

  // Make sure there are no duplicate sentences, and keep the length under a maximum length.
  public function clean_sentences( $text, $maxLength = null ) {
    // Step 1: Identify URLs and replace them with a placeholder.
    $urlPattern = '/\bhttps?:\/\/[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|\/))/';
    preg_match_all( $urlPattern, $text, $urls );
    $urlPlaceholders = [];
    foreach ( $urls[0] as $index => $url ) {
      $placeholder = '{urlPlaceholder' . $index . '}';
      $text = str_replace( $url, $placeholder, $text );
      $urlPlaceholders[$placeholder] = $url;
    }

    $maxLength = (int) ( $maxLength ? $maxLength : $this->get_option( 'context_max_length', 4096 ) );
    $sentences = preg_split( '/(?<=[.?!。．！？])\s+/u', $text, -1, PREG_SPLIT_NO_EMPTY );
    $hashes = [];
    $uniqueSentences = [];
    $total = 0;

    foreach ( $sentences as $sentence ) {
      $sentence = preg_replace( '/^[\pZ\pC]+|[\pZ\pC]+$/u', '', $sentence );
      $hash = md5( $sentence );
      if ( !in_array( $hash, $hashes ) ) {
        $length = mb_strlen( $sentence, 'UTF-8' );
        if ( $total + $length > $maxLength ) {
          continue;
        }
        $hashes[] = $hash;
        $uniqueSentences[] = $sentence;
        $total += $length;
      }
    }

    $freshText = implode( ' ', $uniqueSentences );

    // Step 3: Restore URLs in the final text.
    foreach ( $urlPlaceholders as $placeholder => $url ) {
      $freshText = str_replace( $placeholder, $url, $freshText );
    }

    $freshText = preg_replace( '/^[\pZ\pC]+|[\pZ\pC]+$/u', '', $freshText );
    return $freshText;
  }

  public function get_post_content( $postId ) {
    // Ensure we get fresh post data by clearing cache
    clean_post_cache( $postId );
    $post = get_post( $postId );
    if ( !$post ) {
      return false;
    }
    $text = apply_filters( 'mwai_pre_post_content', $post->post_content, $postId );
    $pattern = '/\[mwai_.*?\]/';
    $text = preg_replace( $pattern, '', $text );
    if ( $this->get_option( 'resolve_shortcodes' ) ) {
      $text = apply_filters( 'the_content', $text );
    }
    else {
      $pattern = "/\[[^\]]+\]/";
      $text = preg_replace( $pattern, '', $text );
      $pattern = "/<!--\s*\/?wp:[^\>]+-->/";
      $text = preg_replace( $pattern, '', $text );
    }
    $text = $this->clean_text( $text );
    $text = $this->clean_sentences( $text );
    $text = apply_filters( 'mwai_post_content', $text, $postId );
    return $text;
  }

  public function markdown_to_html( $content ) {
    $Parsedown = new Parsedown();
    $content = $Parsedown->text( $content );
    return $content;
  }

  public function get_post_language( $postId ) {
    $locale = get_locale();
    $code = strtolower( substr( $locale, 0, 2 ) );
    $humanLanguage = strtr( $code, MWAI_ALL_LANGUAGES );
    $lang = apply_filters( 'wpml_post_language_details', null, $postId );
    if ( !empty( $lang ) ) {
      $locale = $lang['locale'];
      $humanLanguage = $lang['display_name'];
    }
    return strtolower( "$locale ($humanLanguage)" );
  }

  public function do_placeholders( $text ) {
    $defaultPlaceholders = [];
    $dataPlaceholders = $this->get_user_data();
    if ( !empty( $dataPlaceholders ) ) {
      $defaultPlaceholders = array_merge( $defaultPlaceholders, $dataPlaceholders );
    }
    $placeholders = apply_filters( 'mwai_placeholders', $defaultPlaceholders );
    foreach ( $placeholders as $key => $value ) {
      $text = str_replace( '{' . $key . '}', $value, $text );
    }
    return $text;
  }
  #endregion

  #region Image-Related Helpers
  public static function is_image( $file ) {
    global $mwai_core;
    if ( $mwai_core && $mwai_core->imageService ) {
      return $mwai_core->imageService->is_image( $file );
    }
    // Fallback to original implementation if service not available
    $mimeType = self::get_mime_type( $file );
    if ( strpos( $mimeType, 'image' ) !== false ) {
      return true;
    }
    return false;
  }

  public static function get_image_resolution( $url ) {
    global $mwai_core;
    if ( $mwai_core && $mwai_core->imageService ) {
      return $mwai_core->imageService->get_image_resolution( $url );
    }
    // Fallback to original implementation if service not available
    if ( empty( $url ) ) {
      return null;
    }
    $headers = get_headers( $url, 1 );
    if ( strpos( $headers[0], '200' ) === false ) {
      return null;
    }
    $image_info = getimagesize( $url );
    if ( $image_info === false ) {
      return null;
    }
    return [
      'width' => $image_info[0],
      'height' => $image_info[1]
    ];
  }

  public static function get_mime_type( $file ) {
    global $mwai_core;
    if ( $mwai_core && $mwai_core->imageService ) {
      return $mwai_core->imageService->get_mime_type( $file );
    }

    // Fallback implementation - this should rarely be used as imageService is initialized early
    Meow_MWAI_Logging::warn( 'get_mime_type called before imageService is available' );

    // Basic extension-based detection only
    $extension = pathinfo( $file, PATHINFO_EXTENSION );
    $extension = strtolower( $extension );
    $mimeTypes = [
      'jpg' => 'image/jpeg',
      'jpeg' => 'image/jpeg',
      'png' => 'image/png',
      'gif' => 'image/gif',
      'webp' => 'image/webp',
      'bmp' => 'image/bmp',
      'tiff' => 'image/tiff',
      'tif' => 'image/tiff',
      'svg' => 'image/svg+xml',
      'ico' => 'image/x-icon',
      'pdf' => 'application/pdf',
    ];
    return isset( $mimeTypes[$extension] ) ? $mimeTypes[$extension] : null;
  }

  public function download_image( $url ) {
    return $this->imageService->download_image( $url );
  }

  /**
  * Add an image from a URL to the Media Library.
  * @param string $url The URL of the image to be downloaded.
  * @param string $filename The filename of the image, if not set, it will be the basename of the URL.
  * @param string $title The title of the image.
  * @param string $description The description of the image.
  * @param string $caption The caption of the image.
  * @param string $alt The alt text of the image.
  * @return int The attachment ID of the image.
  */
  public function add_image_from_url( $url, $filename = null, $title = null, $description = null, $caption = null, $alt = null, $attachedPost = null, $post_status = 'inherit', $post_type = 'attachment', $ai_metadata = [] ) {
    return $this->imageService->add_image_from_url( $url, $filename, $title, $description, $caption, $alt, $attachedPost, $post_status, $post_type, $ai_metadata );
  }
  #endregion

  #region Context-Related Helpers
  public function retrieve_context( $params, $query, $streamCallback = null ) {
    $contextMaxLength = $params['contextMaxLength'] ?? $this->get_option( 'context_max_length', 4096 );
    $embeddingsEnvId = $params['embeddingsEnvId'] ?? null;

    $context = apply_filters( 'mwai_context_search', [], $query, [
      'embeddingsEnvId' => $embeddingsEnvId,
      'streamCallback' => $streamCallback
    ] );

    // Emit embeddings event if streaming and context was found
    if ( $streamCallback && !empty( $context ) ) {
      $count = 0;
      if ( isset( $context['embeddings'] ) && is_array( $context['embeddings'] ) ) {
        $count = count( $context['embeddings'] );
      }
      else if ( isset( $context['content'] ) ) {
        $count = 1;
      }
      if ( $count > 0 ) {
        $event = Meow_MWAI_Event::embeddings( $count );
        $streamCallback( $event );
      }
    }

    if ( empty( $context ) ) {
      return null;
    }
    else if ( !isset( $context['content'] ) ) {
      Meow_MWAI_Logging::warn( 'A context without content was returned.' );
      return null;
    }
    $context['content'] = $this->clean_sentences( $context['content'], $contextMaxLength );
    $context['length'] = strlen( $context['content'] );
    return $context;
  }
  #endregion

  #region Users/Sessions Helpers

  public function get_nonce( $force = false ) {
    return $this->sessionService->get_nonce( $force );
  }

  // This is a bit hacky, but chatId needs to be retrieved or generated.
  // Maybe we can clean this up later.
  public function fix_chat_id( $query, $params ) {
    return $this->sessionService->fix_chat_id( $query, $params );
  }

  public function get_session_id() {
    return $this->sessionService->get_session_id();
  }

  /**
  * Get the Response ID Manager service
  */
  public function get_response_id_manager() {
    return $this->responseIdManager;
  }

  /**
  * Get the Message Builder service
  */
  public function get_message_builder() {
    return $this->messageBuilder;
  }

  // Get the UserID from the data, or from the current user
  public function get_user_id( $data = null ) {
    return $this->sessionService->get_user_id( $data );
  }

  public function get_session_user_id() {
    return $this->sessionService->get_session_user_id();
  }

  public function get_admin_user() {
    return $this->sessionService->get_admin_user();
  }

  public function get_user_data() {
    return $this->sessionService->get_user_data();
  }

  public function get_ip_address( $force = false ) {
    return $this->sessionService->get_ip_address( $force );
  }

  #endregion

  #region Sanitization
  public function sanitize_sort(
    &$sort,
    $default_accessor = 'created',
    $default_order = 'DESC',
    $allowed_columns = [ 'created', 'updated', 'name', 'id', 'time', 'units', 'price' ]
  ) {

    // Ensure $sort is an array
    if ( !is_array( $sort ) ) {
      $sort = [ 'accessor' => $default_accessor, 'by' => $default_order ];
    }
    // Extract and sanitize the accessor
    $sort_accessor = isset( $sort['accessor'] ) ? $sort['accessor'] : $default_accessor;
    if ( !in_array( $sort_accessor, $allowed_columns ) ) {
      Meow_MWAI_Logging::error( "This sort accessor is not allowed ($sort_accessor)." );
      $sort_accessor = $default_accessor;
    }
    // Extract and sanitize the sort order
    $sort_by = isset( $sort['by'] ) ? strtoupper( $sort['by'] ) : $default_order;
    if ( $sort_by !== 'ASC' && $sort_by !== 'DESC' ) {
      Meow_MWAI_Logging::error( "This sort order is not allowed ($sort_by)." );
      $sort_by = $default_order;
    }
    // Update the sort array with sanitized values
    $sort['accessor'] = $sort_accessor;
    $sort['by'] = $sort_by;
  }
  #endregion

  #region Other Helpers
  public function safe_strlen( $string, $encoding = 'UTF-8' ) {
    if ( function_exists( 'mb_strlen' ) ) {
      return mb_strlen( $string, $encoding );
    }
    else {
      // Fallback implementation for environments without mbstring extension
      return preg_match_all( '/./u', $string, $matches );
    }
  }

  public function check_rest_nonce( $request ) {
    // REST NONCE VERIFICATION:
    // Validates nonce from X-WP-Nonce header using WordPress nonce system.
    // Returns: false (invalid), 1 (0-12 hours old), or 2 (12-24 hours old)
    // WordPress REST permission callbacks accept any truthy value as success.
    // The filter allows custom authorization logic if needed.
    $nonce = $request->get_header( 'X-WP-Nonce' );
    $rest_nonce = wp_verify_nonce( $nonce, 'wp_rest' );
    return apply_filters( 'mwai_rest_authorized', $rest_nonce, $request );
  }

  public function get_random_id( $length = 8, $excludeIds = [] ) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyz';
    $charactersLength = strlen( $characters );
    $randomId = '';
    for ( $i = 0; $i < $length; $i++ ) {
      $randomId .= $characters[ mt_rand( 0, $charactersLength - 1 ) ];
    }
    if ( in_array( $randomId, $excludeIds ) ) {
      return $this->get_random_id( $length, $excludeIds );
    }
    return $randomId;
  }

  public function is_url( $url ) {
    return strpos( $url, 'http' ) === 0 ? true : false;
  }

  public function get_post_types() {
    $excluded = [ 'attachment', 'revision', 'nav_menu_item' ];
    $post_types = [];
    $types = get_post_types( [], 'objects' );

    // Let's get the Post Types that are enabled for Embeddings Sync
    $embeddingsSettings = $this->get_option( 'embeddings' );
    $syncPostTypes = isset( $embeddingsSettings['syncPostTypes'] ) ? $embeddingsSettings['syncPostTypes'] : [];

    foreach ( $types as $type ) {
      $forced = in_array( $type->name, $syncPostTypes );
      // Should not be excluded.
      if ( !$forced && in_array( $type->name, $excluded ) ) {
        continue;
      }
      // Should be public.
      if ( !$forced && !$type->public ) {
        continue;
      }
      $post_types[] = [
        'name' => $type->labels->name,
        'type' => $type->name,
      ];
    }

    // Let's get the Post Types that are enabled for Embeddings Sync
    $embeddingsSettings = $this->get_option( 'embeddings' );
    $syncPostTypes = isset( $embeddingsSettings['syncPostTypes'] ) ? $embeddingsSettings['syncPostTypes'] : [];

    return $post_types;
  }

  public function get_post( $post ) {
    if ( is_numeric( $post ) ) {
      // Force fresh retrieval to avoid cache issues
      clean_post_cache( $post );
      $post = get_post( $post );
    }
    if ( is_object( $post ) ) {
      $post = (array) $post;
    }
    if ( !is_array( $post ) ) {
      return null;
    }
    $language = $this->get_post_language( $post['ID'] );
    $content = $this->get_post_content( $post['ID'] );
    $title = $post['post_title'];
    $excerpt = $post['post_excerpt'];
    $url = get_permalink( $post['ID'] );
    $checksum = wp_hash( $content . $title . $url );
    
    
    return [
      'postId' => (int) $post['ID'],
      'title' => $title,
      'content' => $content,
      'excerpt' => $excerpt,
      'url' => $url,
      'language' => $language ?? 'english',
      'checksum' => $checksum,
    ];
  }

  /**
   * Format a date/time string into a human-readable format
   * @param string $date_string The date string to format
   * @return string Formatted date (e.g., "Just now", "5m ago", "2h ago", "3d ago", "Jan 20th")
   */
  public function format_discussion_date( $date_string ) {
    $date = strtotime( $date_string );
    $now = time();
    $diff = $now - $date;
    
    // Less than a minute
    if ( $diff < 60 ) {
      return 'Just now';
    }
    
    // Less than an hour
    if ( $diff < 3600 ) {
      $minutes = floor( $diff / 60 );
      return $minutes . 'm ago';
    }
    
    // Less than a day
    if ( $diff < 86400 ) {
      $hours = floor( $diff / 3600 );
      return $hours . 'h ago';
    }
    
    // Less than a week
    if ( $diff < 604800 ) {
      $days = floor( $diff / 86400 );
      return $days . 'd ago';
    }
    
    // Format as date
    $is_current_year = date( 'Y', $date ) === date( 'Y', $now );
    if ( $is_current_year ) {
      return date( 'M jS', $date );
    } else {
      return date( 'M jS, Y', $date );
    }
  }
  #endregion

  #region Usage & Costs

  // Quick and dirty token estimation
  // Let's keep this synchronized with Helpers in JS
  public static function estimate_tokens( ...$args ): int {
    global $mwai_core;
    if ( $mwai_core && $mwai_core->usageStatsService ) {
      return $mwai_core->usageStatsService->estimate_tokens( ...$args );
    }
    // Fallback to original implementation if service not available
    $text = '';
    foreach ( $args as $arg ) {
      if ( is_array( $arg ) ) {
        foreach ( $arg as $message ) {
          $text .= isset( $message['content']['text'] ) ? $message['content']['text'] : '';
          $text .= isset( $message['content'] ) && is_string( $message['content'] ) ? $message['content'] : '';
        }
      }
      else if ( is_string( $arg ) ) {
        $text .= $arg;
      }
    }
    $averageTokenLength = 4;
    $words = preg_split( '/\s+/', trim( $text ) );
    $tokenCount = 0;
    foreach ( $words as $word ) {
      $tokenCount += ceil( strlen( $word ) / $averageTokenLength );
    }
    return apply_filters( 'mwai_estimate_tokens', $tokenCount, $text );
  }

  public function record_tokens_usage( $model, $in_tokens, $out_tokens = 0, $returned_price = null ) {
    return $this->usageStatsService->record_tokens_usage( $model, $in_tokens, $out_tokens, $returned_price );
  }

  public function record_audio_usage( $model, $seconds ) {
    return $this->usageStatsService->record_audio_usage( $model, $seconds );
  }

  public function record_images_usage( $model, $resolution, $images ) {
    return $this->usageStatsService->record_images_usage( $model, $resolution, $images );
  }

  public function record_videos_usage( $model, $resolution, $seconds ) {
    return $this->usageStatsService->record_videos_usage( $model, $resolution, $seconds );
  }

  #endregion

  #region Streaming
  public function stream_push( $data, $query = null ) {
    try {
      // Handle new Event objects
      if ( is_object( $data ) && method_exists( $data, 'to_array' ) ) {
        $data = $data->to_array();
      }

      $data = apply_filters( 'mwai_stream_push', $data, $query );
      $out = 'data: ' . json_encode( $data );
      echo $out;
      echo "\n\n";
      if ( ob_get_level() > 0 ) {
        ob_end_flush();
      }
      flush();
    }
    catch ( Exception $e ) {
      // Send error as proper SSE error event
      $errorMessage = 'Oops! Something went wrong on the server. Please try again, and if you are the site developer, check the PHP Error Logs for details.';
      error_log( '[AI Engine Stream Error] ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine() );

      $errorData = [
        'type' => 'error',
        'data' => $errorMessage
      ];
      $out = 'data: ' . json_encode( $errorData );
      echo $out;
      echo "\n\n";
      if ( ob_get_level() > 0 ) {
        ob_end_flush();
      }
      flush();

      // Stop execution after sending error
      die();
    }
  }
  #endregion

  #region Options
  public function get_themes() {
    $themes = get_option( $this->themes_option_name, [] );
    $themes = empty( $themes ) ? [] : $themes;

    $internalThemes = [
      'chatgpt' => [
        'type' => 'internal', 'name' => 'ChatGPT', 'themeId' => 'chatgpt',
        'settings' => [], 'style' => ''
      ],
      'messages' => [
        'type' => 'internal', 'name' => 'Messages', 'themeId' => 'messages',
        'settings' => [], 'style' => ''
      ],
      'timeless' => [
        'type' => 'internal', 'name' => 'Timeless', 'themeId' => 'timeless',
        'settings' => [], 'style' => ''
      ],
    ];
    $customThemes = [];
    foreach ( $themes as $theme ) {
      if ( isset( $internalThemes[$theme['themeId']] ) ) {
        $internalThemes[$theme['themeId']] = $theme;
        continue;
      }
      $customThemes[] = $theme;
    }
    return array_merge( array_values( $internalThemes ), $customThemes );
  }

  public function update_themes( $themes ) {
    update_option( $this->themes_option_name, $themes );
    return $themes;
  }

  public function get_chatbots() {
    $chatbots = get_option( $this->chatbots_option_name, [] );
    $hasChanges = false;
    if ( empty( $chatbots ) ) {
      $chatbots = [ array_merge( MWAI_CHATBOT_DEFAULT_PARAMS, ['name' => 'Default', 'botId' => 'default' ] ) ];
    }
    $hasDefault = false;
    foreach ( $chatbots as &$chatbot ) {
      if ( $chatbot['botId'] === 'default' ) {
        $hasDefault = true;
      }
      foreach ( MWAI_CHATBOT_DEFAULT_PARAMS as $key => $value ) {
        // Use default value if not set.
        if ( !isset( $chatbot[$key] ) ) {
          $chatbot[$key] = $value;
        }
      }

      /*
      This is the best section to rename fields.
      We did this in 2024 for context to instructions, and fileUpload to fileSearch. fileSearch is for assistant file search, and fileUpload is now for chatbot file upload (similar to vision, but for files instead of images).
      */

      // Migrate old file upload params to new unified system
      if ( !isset( $chatbot['fileUpload'] ) ) {
        // Set fileUpload based on old params (imageUpload, fileUploads, or vision checkbox)
        $chatbot['fileUpload'] = !empty( $chatbot['imageUpload'] ) || ( isset( $chatbot['fileUploads'] ) && $chatbot['fileUploads'] > 0 );
        $hasChanges = true;
      }

      // Ensure maxUploads is set
      if ( !isset( $chatbot['maxUploads'] ) ) {
        if ( isset( $chatbot['fileUploads'] ) && $chatbot['fileUploads'] > 0 ) {
          $chatbot['maxUploads'] = $chatbot['fileUploads'];
        } else {
          $chatbot['maxUploads'] = 1; // Default to 1 file
        }
        $hasChanges = true;
      }

      // Sync fileUploads with fileUpload and maxUploads for consistency
      if ( isset( $chatbot['fileUpload'] ) ) {
        $chatbot['fileUploads'] = $chatbot['fileUpload'] ? $chatbot['maxUploads'] : 0;
        $chatbot['multiUpload'] = $chatbot['fileUpload'] && $chatbot['maxUploads'] > 1;
        $chatbot['imageUpload'] = $chatbot['fileUpload']; // Keep imageUpload in sync
      }

      // if ( isset( $chatbot['context'] ) ) {
      //   $chatbot['instructions'] = $chatbot['context'];
      //   unset( $chatbot['context'] );
      //   $hasChanges = true;
      // }
    }
    if ( !$hasDefault ) {
      $defaultBot = array_merge( MWAI_CHATBOT_DEFAULT_PARAMS, ['name' => 'Default', 'botId' => 'default' ] );
      array_unshift( $chatbots, $defaultBot );
      $hasChanges = true;
    }
    if ( $hasChanges ) {
      update_option( $this->chatbots_option_name, $chatbots );
    }
    return $chatbots;
  }

  public function get_chatbot( $botId ) {
    $chatbots = $this->get_chatbots();
    foreach ( $chatbots as $chatbot ) {
      if ( $chatbot['botId'] === (string) $botId ) {
        return $chatbot;
      }
    }
    return null;
  }

  public function get_embeddings_env( $envId ) {
    return $this->modelEnvironmentService->get_embeddings_env( $envId );
  }

  public function get_ai_env( $envId ) {
    return $this->modelEnvironmentService->get_ai_env( $envId );
  }

  public function get_assistant( $envId, $assistantId ) {
    return $this->modelEnvironmentService->get_assistant( $envId, $assistantId );
  }

  public function get_theme( $themeId ) {
    $themes = $this->get_themes();
    foreach ( $themes as $theme ) {
      if ( $theme['themeId'] === $themeId ) {
        // Append custom CSS to theme data for frontend rendering (check for non-empty trimmed string)
        if ( isset( $theme['settings']['customCSS'] ) && trim( $theme['settings']['customCSS'] ) !== '' ) {
          $customCSS = $theme['settings']['customCSS'];
          
          // Add theme class prefix to all CSS rules for proper scoping
          $themeClass = '.mwai-' . $themeId . '-theme';
          $lines = explode( "\n", $customCSS );
          $processedCSS = '';
          $inRule = false;
          
          foreach ( $lines as $line ) {
            $trimmedLine = trim( $line );
            
            // Skip empty lines and comments
            if ( empty( $trimmedLine ) || strpos( $trimmedLine, '/*' ) === 0 ) {
              $processedCSS .= $line . "\n";
              continue;
            }
            
            // If line contains a selector (has { but not })
            if ( strpos( $line, '{' ) !== false && strpos( $line, '}' ) === false ) {
              // Extract selector and the rest
              $parts = explode( '{', $line, 2 );
              $selector = trim( $parts[0] );
              
              // Add theme class prefix if not already present
              if ( strpos( $selector, $themeClass ) !== 0 ) {
                // Handle multiple selectors separated by comma
                $selectors = explode( ',', $selector );
                $prefixedSelectors = array_map( function( $sel ) use ( $themeClass ) {
                  $sel = trim( $sel );
                  // Don't prefix if it's a keyframe or similar
                  if ( strpos( $sel, '@' ) === 0 || strpos( $sel, 'from' ) === 0 || strpos( $sel, 'to' ) === 0 || preg_match( '/^\d+%/', $sel ) ) {
                    return $sel;
                  }
                  return $themeClass . ' ' . $sel;
                }, $selectors );
                $selector = implode( ', ', $prefixedSelectors );
              }
              
              $processedCSS .= $selector . ' {' . ( isset( $parts[1] ) ? $parts[1] : '' ) . "\n";
              $inRule = true;
            } else {
              $processedCSS .= $line . "\n";
            }
          }
          
          $customCSS = $processedCSS;
          
          // For custom themes (type: 'css'), append to style property
          if ( $theme['type'] === 'css' ) {
            $theme['style'] = ( $theme['style'] ?? '' ) . "\n\n/* Custom CSS */\n" . $customCSS;
          }
          // For internal themes, add customCSS as a separate property
          else {
            $theme['customCSS'] = $customCSS;
          }
        }

        // Add CSS URL for cross-site and dynamic loading support
        // Internal themes can use physical file, custom themes use REST endpoint
        $theme_type = $theme['type'] ?? 'internal';
        if ( $theme_type === 'internal' ) {
          $theme['cssUrl'] = MWAI_URL . 'themes/' . $themeId . '.css';
        }
        else {
          // Custom themes use REST endpoint (requires Cross-Site module to be enabled)
          $theme['cssUrl'] = get_rest_url( null, 'mwai-ui/v1/cross-site/theme-css' ) . '?themeId=' . $themeId;
        }

        return $theme;
      }
    }
    return null;
  }

  public function update_chatbots( $chatbots ) {
    $deprecatedFields = [ 'env', 'embeddingsIndex', 'embeddingsNamespace', 'service' ];
    // TODO: I think some HTML fields are missing, guestName, maybe others.
    $htmlFields = [ 'instructions', 'textCompliance', 'aiName', 'userName', 'startSentence' ];
    $keepLineReturnsFields = [ 'instructions' ];
    $whiteSpacedFields = [ 'context' ];
    // Boolean fields that need proper conversion
    $booleanFields = [ 'window', 'copyButton', 'fullscreen', 'localMemory', 'iconBubble', 'centerOpen',
      'imageUpload', 'fileUpload', 'multiUpload', 'fileSearch', 'contentAware', 'aiAvatar', 'userAvatar', 'guestAvatar' ];
    foreach ( $chatbots as &$chatbot ) {
      foreach ( $chatbot as $key => &$value ) {
        if ( in_array( $key, $deprecatedFields ) ) {
          unset( $chatbot[$key] );
          continue;
        }
        if ( in_array( $key, $htmlFields ) ) {
          $value = wp_kses_post( $value );
        }
        else if ( in_array( $key, $whiteSpacedFields ) ) {
          $value = sanitize_textarea_field( $value );
        }
        else if ( in_array( $key, $booleanFields ) ) {
          // Convert various representations to boolean
          if ( is_bool( $value ) ) {
            // Already boolean, keep as is
          } else if ( $value === 1 || $value === '1' || $value === true || $value === 'true' || $value === 'yes' ) {
            // These are true values
            $value = true;
          } else if ( $value === 0 || $value === '0' || $value === false || $value === 'false' || $value === 'no' || $value === '' || $value === null ) {
            // These are false values
            $value = false;
          } else {
            // Default to checking if not empty
            $value = !empty( $value );
          }
        }
        else if ( $key === 'functions' ) {
          $functions = [];
          foreach ( $value as $function ) {
            if ( isset( $function['id'] ) && isset( $function['type'] ) ) {
              $functions[] = [
                'id' => sanitize_text_field( $function['id'] ),
                'type' => sanitize_text_field( $function['type'] ),
              ];
            }
          }
          $value = $functions;
        }
        else if ( $key === 'mcpServers' ) {
          $mcpServers = [];
          foreach ( $value as $server ) {
            if ( isset( $server['id'] ) ) {
              $mcpServers[] = [
                'id' => sanitize_text_field( $server['id'] ),
              ];
            }
          }
          $value = $mcpServers;
        }
        else if ( $key === 'tools' ) {
          // Sanitize tools array (web_search, image_generation, thinking, etc)
          $tools = [];
          if ( is_array( $value ) ) {
            foreach ( $value as $tool ) {
              $sanitized_tool = sanitize_text_field( $tool );
              if ( in_array( $sanitized_tool, ['web_search', 'image_generation', 'thinking', 'code_interpreter'] ) ) {
                $tools[] = $sanitized_tool;
              }
            }
          }
          $value = $tools;
        }
        else if ( $key === 'crossSite' ) {
          // Handle crossSite object
          $crossSite = [
            'enabled' => isset( $value['enabled'] ) ? (bool) $value['enabled'] : false,
            'allowedDomains' => []
          ];
          if ( isset( $value['allowedDomains'] ) && is_array( $value['allowedDomains'] ) ) {
            foreach ( $value['allowedDomains'] as $domain ) {
              $sanitized_domain = sanitize_text_field( $domain );
              if ( !empty( $sanitized_domain ) ) {
                $crossSite['allowedDomains'][] = $sanitized_domain;
              }
            }
          }
          $value = $crossSite;
        }
        else {
          if ( in_array( $key, $keepLineReturnsFields ) ) {
            $value = preg_replace( '/\r\n/', '[==LINE_RETURN==]', $value );
            $value = preg_replace( '/\n/', '[==LINE_RETURN==]', $value );
          }
          $value = sanitize_text_field( $value );
          if ( in_array( $key, $keepLineReturnsFields ) ) {
            $value = preg_replace( '/\[==LINE_RETURN==\]/', "\n", $value );
          }
        }
      }

      // Sync upload params to ensure consistency
      // fileUpload is the master control - respect its value
      $fileUploadEnabled = !empty( $chatbot['fileUpload'] ) || !empty( $chatbot['imageUpload'] );
      $maxFiles = isset( $chatbot['maxUploads'] ) && $chatbot['maxUploads'] > 0 ? (int) $chatbot['maxUploads'] : 1;

      $chatbot['imageUpload'] = $fileUploadEnabled;
      $chatbot['fileUploads'] = $fileUploadEnabled ? $maxFiles : 0;
      $chatbot['multiUpload'] = $fileUploadEnabled && $maxFiles > 1;
    }
    if ( !update_option( $this->chatbots_option_name, $chatbots ) ) {
      Meow_MWAI_Logging::warn( 'Could not update chatbots.' );
      $chatbots = get_option( $this->chatbots_option_name, [] );
      return $chatbots;
    }
    return $chatbots;
  }

  public function populate_dynamic_options( $options ) {
    static $populating = false;

    // Prevent infinite recursion
    if ( $populating ) {
      return $options;
    }

    $populating = true;

    // Languages - use custom languages as the complete list
    $custom_languages = isset( $options['custom_languages'] ) && !empty( $options['custom_languages'] ) 
      ? $options['custom_languages'] 
      : [];
    
    // If no custom languages defined, fall back to defaults
    if ( empty( $custom_languages ) ) {
      $options['languages'] = apply_filters( 'mwai_languages', MWAI_LANGUAGES );
    } else {
      // Process custom languages
      $processed_languages = [];
      foreach ( $custom_languages as $custom_lang ) {
        // Support formats like "Russian (ru)" or just "Russian"
        $custom_lang = trim( $custom_lang );
        if ( !empty( $custom_lang ) ) {
          // Check if language code is provided in parentheses
          if ( preg_match( '/^(.+)\s*\(([a-z]{2,3})\)$/i', $custom_lang, $matches ) ) {
            $lang_name = trim( $matches[1] );
            $lang_code = strtolower( trim( $matches[2] ) );
            $processed_languages[$lang_code] = $lang_name;
          } else {
            // No code provided, add as-is
            $processed_languages[] = $custom_lang;
          }
        }
      }
      
      $options['languages'] = apply_filters( 'mwai_languages', $processed_languages );
    }

    // Consolidate the Engines and their Models
    // PS: We should ABSOLUTELY AVOID to use ai_models directly (except for saving)
    // Engine Example: [ 'name' => 'Ollama', 'type' => 'ollama', inputs => ['apikey', 'endpoint'], models => [] ]
    $options['ai_engines'] = apply_filters( 'mwai_engines', MWAI_ENGINES );
    foreach ( $options['ai_engines'] as &$engine ) {
      if ( $engine['type'] === 'openai' ) {
        $engine['models'] = apply_filters(
          'mwai_openai_models',
          Meow_MWAI_Engines_OpenAI::get_models_static()
        );
      }
      else if ( $engine['type'] === 'anthropic' ) {
        $engine['models'] = apply_filters(
          'mwai_anthropic_models',
          Meow_MWAI_Engines_Anthropic::get_models_static()
        );
      }
      else if ( $engine['type'] === 'perplexity' ) {
        $engine['models'] = apply_filters(
          'mwai_perplexity_models',
          Meow_MWAI_Engines_Perplexity::get_models_static()
        );
      }
      else if ( $engine['type'] === 'mistral' ) {
        $engine['models'] = apply_filters(
          'mwai_mistral_models',
          Meow_MWAI_Engines_Mistral::get_models_static()
        );
      }
      else {
        $engine['models'] = [];
        foreach ( $options['ai_models'] as $model ) {
          if ( $model['type'] === $engine['type'] ) {
            $engine['models'][] = $model;
          }
        }
      }
    }

    // Functions via Code Engine (or custom code)
    $json = [];
    $functions = apply_filters( 'mwai_functions_list', [] );
    foreach ( $functions as $function ) {
      $json[] = Meow_MWAI_Query_Function::toJson( $function );
    }
    $options['functions'] = $json;

    // Addons
    $options['addons'] = apply_filters( 'mwai_addons', [
      [
        'slug' => 'mwai-notifications',
        'name' => 'Notifications',
        'description' => 'Get real-time alerts for new discussions in your chatbot, so you never miss a chance to engage.',
        'install_url' => 'https://meowapps.com/products/mwai-notifications/',
        'settings_url' => null,
        'stars' => 4,
        'enabled' => false
      ],
      [
        'slug' => 'mwai-ollama',
        'name' => 'Ollama',
        'description' => 'Leverage local LLM integration through Ollama; refresh and use your own models for a flexible, cost-free approach.',
        'install_url' => 'https://meowapps.com/products/mwai-ollama/',
        'settings_url' => null,
        'stars' => 3,
        'enabled' => false
      ],
      [
        'slug' => 'mwai-deepseek',
        'name' => 'DeepSeek',
        'description' => 'Support for DeepSeek, a Chinese AI company that provides extremely powerful LLM models.',
        'install_url' => 'https://meowapps.com/products/deepseek/',
        'settings_url' => null,
        'stars' => 3,
        'enabled' => false
      ],
      [
        'slug' => 'mwai-websearch',
        'name' => 'Web Search',
        'description' => 'Enhance chatbot responses by pulling context from Google and Tavily, delivering more accurate answers.',
        'install_url' => 'https://meowapps.com/products/mwai-websearch/',
        'settings_url' => null,
        'stars' => 5,
        'enabled' => false
      ],
      [
        'slug' => 'mwai-better-links',
        'name' => 'Better Links',
        'description' => 'Validate internal and external links and map specific terms to custom URLs, ensuring smoother navigation and references.',
        'install_url' => 'https://meowapps.com/products/mwai-better-links/',
        'settings_url' => null,
        'stars' => 3,
        'enabled' => false
      ],
      [
        'slug' => 'mwai-woo-basics',
        'name' => 'Woo Basics',
        'description' => 'Access essential WooCommerce data so your chatbot can understand products, orders, and more for a richer shopping experience.',
        'install_url' => 'https://meowapps.com/products/mwai-woo-basics/',
        'settings_url' => null,
        'stars' => 2,
        'enabled' => false
      ],
      [
        'slug' => 'mwai-quick-actions',
        'name' => 'Quick Actions',
        'description' => 'Enable dynamic quick actions at chat start or during events, helping users find what they need faster.',
        'install_url' => 'https://meowapps.com/products/mwai-quick-actions/',
        'settings_url' => null,
        'stars' => 3,
        'enabled' => false
      ],
      [
        'slug' => 'mwai-content-parser',
        'name' => 'Content Parser',
        'description' => 'Parse complex website content, including ACF fields and page builders, for more precise embeddings and knowledge retrieval.',
        'install_url' => 'https://meowapps.com/products/mwai-content-parser/',
        'settings_url' => null,
        'stars' => 2,
        'enabled' => false
      ],
      [
        'slug' => 'mwai-visitor-form',
        'name' => 'Visitor Form',
        'description' => 'Add a customizable form triggered by specific events in your chatbot to collect key visitor information seamlessly.',
        'install_url' => 'https://meowapps.com/products/mwai-visitor-form/',
        'settings_url' => null,
        'stars' => 2,
        'enabled' => false
      ],
      [
        'slug' => 'mwai-dynamic-keys',
        'name' => 'Dynamic Keys',
        'description' => 'Rotate multiple API keys dynamically for any environment, balancing usage and ensuring smooth performance.',
        'install_url' => 'https://meowapps.com/products/mwai-dynamic-keys/',
        'settings_url' => null,
        'stars' => 1,
        'enabled' => false
      ],
    ] );

    // Populate usage data from ai_usage to ai_models_usage for the frontend
    $ai_usage = $this->get_option( 'ai_usage', [] );
    $options['ai_models_usage'] = $ai_usage;
    
    // Also include daily usage data
    $ai_usage_daily = $this->get_option( 'ai_usage_daily', [] );
    $options['ai_models_usage_daily'] = $ai_usage_daily;

    $populating = false;
    return $options;
  }

  public function get_all_options( $force = false, $sanitize = false ) {
    if ( $force || is_null( $this->options ) ) {
      $options = get_option( $this->option_name, [] );
      $init_mode = empty( $options );
      foreach ( MWAI_OPTIONS as $key => $value ) {
        if ( !isset( $options[$key] ) ) {
          $options[$key] = $value;
        }
      }
      $options['chatbot_defaults'] = MWAI_CHATBOT_DEFAULT_PARAMS;
      $options['default_limits'] = MWAI_LIMITS;
      
      // Force sanitization if custom_languages is not set (migration)
      $needs_language_migration = !isset( $options['custom_languages'] ) || empty( $options['custom_languages'] );
      
      if ( $sanitize || $init_mode || $needs_language_migration ) {
        $options = $this->sanitize_options( $options );
      }
      $this->options = $options;
    }
    $options = $this->populate_dynamic_options( $this->options );
    return $options;
  }

  // Sanitize options when we update the plugin or perform some updates
  // if we change the structure of the options.
  public function sanitize_options( $options ) {
    $needs_update = false;

    // Removing old options of options renaming should be done here, as it was done before.
    // Check version 2.6.8 for an example.

    // Avoid the logs_path to be a PHP file.
    if ( isset( $options['logs_path'] ) ) {
      $logs_path = $options['logs_path'];
      if ( substr( $logs_path, -4 ) !== '.log' ) {
        $options['logs_path'] = '';
        $needs_update = true;
      }
    }

    // The IDs for the embeddings environments are generated here.
    // TODO: We should handle this more gracefully via an option in the Embeddings Settings.
    $embeddings_default_exists = false;
    if ( isset( $options['embeddings_envs'] ) ) {
      foreach ( $options['embeddings_envs'] as &$env ) {
        if ( !isset( $env['id'] ) ) {
          $env['id'] = $this->get_random_id();
          $needs_update = true;
        }
        if ( $env['id'] === $options['embeddings_default_env'] ) {
          $embeddings_default_exists = true;
        }
      }
    }
    if ( !$embeddings_default_exists ) {
      $options['embeddings_default_env'] = $options['embeddings_envs'][0]['id'] ?? null;
      $needs_update = true;
    }

    // The IDs for the AI environments are generated here.
    $allEnvIds = [];
    $ai_default_exists = false;
    if ( isset( $options['ai_envs'] ) ) {
      foreach ( $options['ai_envs'] as &$env ) {
        if ( !isset( $env['id'] ) ) {
          $env['id'] = $this->get_random_id();
          $needs_update = true;
        }
        if ( $env['id'] === $options['ai_default_env'] ) {
          $ai_default_exists = true;
        }
        $allEnvIds[] = $env['id'];
      }
    }
    if ( !$ai_default_exists ) {
      $options['ai_default_env'] = $options['ai_envs'][0]['id'] ?? null;
      $needs_update = true;
    }

    // The IDs for the MCP environments are generated here.
    if ( isset( $options['mcp_envs'] ) ) {
      foreach ( $options['mcp_envs'] as &$env ) {
        if ( !isset( $env['id'] ) ) {
          $env['id'] = $this->get_random_id();
          $needs_update = true;
        }
      }
    }

    // All the models with an envId that does not exist anymore are removed.
    if ( isset( $options['ai_models'] ) ) {
      $options['ai_models'] = array_values( array_filter(
        $options['ai_models'],
        function ( $model ) use ( $allEnvIds, &$needs_update ) {
          if ( isset( $model['envId'] ) && !in_array( $model['envId'], $allEnvIds ) ) {
            $needs_update = true;
            return false;
          }
          return true;
        }
      ) );
    }

    // Migration: Populate custom_languages if empty for existing installations
    if ( !isset( $options['custom_languages'] ) || empty( $options['custom_languages'] ) ) {
      $options['custom_languages'] = [
        'English (en)',
        'German (de)', 
        'French (fr)',
        'Spanish (es)',
        'Italian (it)',
        'Chinese (zh)',
        'Japanese (ja)',
        'Portuguese (pt)'
      ];
      $needs_update = true;
    }

    if ( $needs_update ) {
      ksort( $options );
      update_option( $this->option_name, $options, false );
    }

    return $options;
  }

  public function update_options( $options ) {
    if ( !update_option( $this->option_name, $options, false ) ) {
      return false;
    }
    $options = $this->get_all_options( true, true );
    return $options;
  }

  public function update_option( $option, $value ) {
    $options = $this->get_all_options( true );
    $options[$option] = $value;
    return $this->update_options( $options );
  }

  public function get_option( $option, $default = null ) {
    $options = $this->get_all_options();
    return $options[$option] ?? $default;
  }

  public function update_ai_env( $env_id, $option, $value ) {
    $options = $this->get_all_options( true );
    foreach ( $options['ai_envs'] as &$env ) {
      if ( $env['id'] === $env_id ) {
        $env[$option] = $value;
        break;
      }
    }
    return $this->update_options( $options );
  }

  public function get_engine_models( $engineType ) {
    // This method is called by engines with just a string type
    // We need to get the models differently
    $options = $this->get_all_options();
    $engines = $options['ai_envs'];
    $models = [];

    // Find all models for this engine type
    foreach ( $engines as $engine ) {
      if ( $engine['type'] === $engineType ) {
        if ( isset( $engine['models'] ) ) {
          foreach ( $engine['models'] as $model ) {
            $models[] = $model;
          }
        }
      }
    }

    // Also check custom models
    if ( isset( $options['ai_models'] ) ) {
      foreach ( $options['ai_models'] as $model ) {
        if ( $model['type'] === $engineType ) {
          $models[] = $model;
        }
      }
    }

    return $models;
  }

  public function reset_options() {
    delete_option( $this->themes_option_name );
    delete_option( $this->chatbots_option_name );
    delete_option( $this->option_name );
    return $this->get_all_options( true );
  }
  #endregion
  
  #region Cron Tracking
  public function track_cron_start( $hook ) {
    // Set running transient (expires in 5 minutes as a safety measure)
    set_transient( 'mwai_cron_running_' . $hook, true, 300 );
  }
  
  public function track_cron_end( $hook, $status = 'success', $error_message = '' ) {
    // Remove running transient
    delete_transient( 'mwai_cron_running_' . $hook );
    
    // Get existing data
    $cron_data = get_transient( 'mwai_cron_last_run' ) ?: [];
    
    // Update this cron's data - use time() for consistency
    $cron_data[$hook] = [
      'time' => time(),
      'status' => $status,
      'error' => $error_message
    ];
    
    // Store for 7 days
    set_transient( 'mwai_cron_last_run', $cron_data, 7 * DAY_IN_SECONDS );
  }
  #endregion
}
