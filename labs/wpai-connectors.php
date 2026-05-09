<?php
/**
 * WP AI Client: Connectors integration.
 *
 * WordPress 7+ ships an `/wp-admin/options-connectors.php` page backed by
 * `WP_Connector_Registry`. The page is a sealed React SPA: no HTML filter, only
 * the registry. What we do:
 *
 *   1. Show a banner on the page offering to let AI Engine manage the
 *      connectors (opt-in — the user most likely landed there by accident).
 *   2. When opted in ("managed"): on `wp_connectors_init`, register one
 *      connector per AI Engine environment and remove anything else. The page
 *      then mirrors AI Engine's own configuration, nothing more.
 *   3. Bridge `connectors_ai_{id}_api_key` ↔ AI Engine env apikey so either
 *      screen stays in sync.
 *
 * @package MeowApps
 */

class Meow_MWAI_Labs_WPAI_Connectors {
  const OPTION_MODE = 'mwai_wpai_connectors_mode'; // 'observe' | 'managed' | 'off'

  /** Optional credentials URLs per engine type. Only for the UX nicety of
   *  "Get an API key →" on cards; AI Engine itself doesn't need these. */
  const CREDENTIALS_URLS = [
    'openai'     => 'https://platform.openai.com/api-keys',
    'anthropic'  => 'https://console.anthropic.com/settings/keys',
    'google'     => 'https://aistudio.google.com/api-keys',
    'mistral'    => 'https://console.mistral.ai/api-keys/',
    'openrouter' => 'https://openrouter.ai/keys',
    'perplexity' => 'https://www.perplexity.ai/settings/api',
    'replicate'  => 'https://replicate.com/account/api-tokens',
  ];

  private $core = null;

  public function __construct( $core ) {
    $this->core = $core;

    // Gate on WP AI Client availability.
    if ( ! class_exists( 'WP_Connector_Registry' ) ) {
      return;
    }

    // The banner is shown unless the user explicitly dismissed with 'off'.
    // We hook the global admin_footer and gate on the screen id, because the
    // hook suffix differs between `/wp-admin/options-connectors.php` (loaded
    // as `options-connectors.php`) and the menu-page variant.
    if ( $this->get_mode() !== 'off' ) {
      add_action( 'admin_footer', [ $this, 'maybe_render_banner' ] );
    }

    // AJAX: flip the mode.
    add_action( 'wp_ajax_mwai_wpai_connectors_set_mode', [ $this, 'ajax_set_mode' ] );

    // When managed: own the registry and bridge the keys both ways.
    if ( $this->get_mode() === 'managed' ) {
      add_action( 'wp_connectors_init', [ $this, 'customize_registry' ], 20 );
      add_action( 'updated_option', [ $this, 'maybe_bridge_key_to_env' ], 10, 3 );
      add_action( 'added_option',   [ $this, 'maybe_bridge_key_to_env_added' ], 10, 2 );

      // Reverse: AI Engine env key → WP Connectors option.
      add_action( 'update_option_mwai_options', [ $this, 'mirror_envs_to_wp_connectors' ], 10, 2 );

      // On admin page loads, reconcile keys so the WP Connectors page reflects
      // the current AI Engine state even if it was edited elsewhere.
      add_action( 'admin_init', [ $this, 'initial_sync' ], 99 );

      // Flip `isConnected` for any bridged env that has a key, so the
      // Connectors page shows providers as connected even when the AiClient
      // registry doesn't know about them (e.g. OpenRouter, Mistral).
      add_filter( 'script_module_data_options-connectors-wp-admin', [ $this, 'mark_bridged_as_connected' ], 20 );

      // Fully take over the WP AI plugin's credentials gate. Once the user
      // chose "managed", AI Engine is the source of truth for which providers
      // are usable: the WP AI plugin shouldn't be vetoing on its own (its
      // checks ignore Ollama, OpenRouter, Mistral, etc., and its live
      // wp_ai_client_prompt('Test') round-trip can fail for providers WP core
      // doesn't ship an AiClient adapter for). We declare credentials present
      // when at least one AI Engine env is usable, and skip the live test.
      add_filter( 'wpai_has_ai_credentials', [ $this, 'declare_credentials_present' ], 10, 1 );
      add_filter( 'wpai_pre_has_valid_credentials_check', [ $this, 'declare_credentials_valid' ], 10, 1 );
    }
  }

  /**
   * Filter for `wpai_has_ai_credentials`. Returns true if AI Engine has at
   * least one usable env (api-key env with a key, or any keyless type like
   * Ollama). Lets the WP AI plugin proceed past its own narrow check, which
   * only counts api_key-method connectors with the matching option set.
   */
  public function declare_credentials_present( $has_credentials ): bool {
    if ( $has_credentials ) {
      return true;
    }
    foreach ( $this->core->get_all_options()['ai_envs'] ?? [] as $env ) {
      $type = $env['type'] ?? '';
      if ( ! $type ) {
        continue;
      }
      if ( $type === 'ollama' ) {
        return true;
      }
      if ( ! empty( $env['apikey'] ) ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Filter for `wpai_pre_has_valid_credentials_check`. Skip the WP AI
   * plugin's live `wp_ai_client_prompt('Test')` validation: AI Engine handles
   * its own provider routing, and the AiClient registry doesn't know about
   * providers like OpenRouter or Mistral, so the live test would falsely
   * report them as invalid.
   */
  public function declare_credentials_valid( $valid ): bool {
    return true;
  }

  public function mark_bridged_as_connected( array $data ): array {
    if ( empty( $data['connectors'] ) || ! is_array( $data['connectors'] ) ) {
      return $data;
    }
    $env_by_type = $this->envs_indexed_by_type();
    foreach ( $data['connectors'] as $id => &$c ) {
      $env = $env_by_type[ $id ] ?? null;
      if ( $env && ! empty( $env['apikey'] ) && isset( $c['authentication'] ) ) {
        $c['authentication']['isConnected'] = true;
        if ( empty( $c['authentication']['keySource'] ) || $c['authentication']['keySource'] === 'none' ) {
          $c['authentication']['keySource'] = 'database';
        }
      }
    }
    return $data;
  }

  /** Reentrance guard for cross-bridging. */
  private static $bridging = false;

  // ───────────────────────────────────────────────────────────────────────
  // Mode helpers.
  // ───────────────────────────────────────────────────────────────────────

  private function get_mode(): string {
    $mode = get_option( self::OPTION_MODE, null );
    if ( $mode === null ) {
      // One-shot migration from the pre-rename key (was 'mwai_wp7_...').
      $legacy = get_option( 'mwai_wp7_connectors_mode', null );
      if ( $legacy !== null ) {
        update_option( self::OPTION_MODE, $legacy );
        delete_option( 'mwai_wp7_connectors_mode' );
        $mode = $legacy;
      }
    }
    if ( $mode === null ) {
      $mode = 'observe';
    }
    return in_array( $mode, [ 'observe', 'managed', 'off' ], true ) ? $mode : 'observe';
  }

  public function ajax_set_mode(): void {
    check_ajax_referer( 'mwai_wpai_connectors', 'nonce' );
    if ( ! current_user_can( 'manage_options' ) ) {
      wp_send_json_error( [ 'message' => 'forbidden' ], 403 );
    }
    $mode = isset( $_POST['mode'] ) ? sanitize_key( wp_unslash( $_POST['mode'] ) ) : '';
    if ( ! in_array( $mode, [ 'observe', 'managed', 'off' ], true ) ) {
      wp_send_json_error( [ 'message' => 'invalid mode' ], 400 );
    }
    update_option( self::OPTION_MODE, $mode );
    if ( $mode === 'managed' ) {
      $this->initial_sync();
    }
    wp_send_json_success( [ 'mode' => $mode ] );
  }

  // ───────────────────────────────────────────────────────────────────────
  // Registry customization (managed mode).
  // ───────────────────────────────────────────────────────────────────────

  public function customize_registry( WP_Connector_Registry $registry ): void {
    $env_by_type  = $this->envs_indexed_by_type();
    $engine_names = $this->engine_names_by_type();

    // Build the set of provider ids AI Engine has configured.
    $ours = array_keys( $env_by_type );

    // Remove any existing connector that AI Engine doesn't manage. Keeps the
    // page tidy: only cards for providers the user actually has envs for.
    foreach ( array_keys( $registry->get_all_registered() ) as $id ) {
      if ( ! in_array( $id, $ours, true ) ) {
        $registry->unregister( $id );
      }
    }

    // Register / re-register each AI Engine-owned provider.
    foreach ( $env_by_type as $type => $env ) {
      $name        = $engine_names[ $type ] ?? ucwords( $type );
      $description = $this->describe_bridge( $type, $env_by_type );
      $auth        = [ 'method' => $type === 'ollama' ? 'none' : 'api_key' ];
      if ( isset( self::CREDENTIALS_URLS[ $type ] ) ) {
        $auth['credentials_url'] = self::CREDENTIALS_URLS[ $type ];
      }
      // WP core's _wp_register_default_connectors() auto-fills these for its own
      // defaults; third-party register() calls don't get that treatment, and the
      // WP AI plugin's has_ai_credentials() skips any connector with an empty
      // setting_name. Mirror what WP core would have set so our connectors are
      // recognised as having credentials.
      if ( $auth['method'] === 'api_key' ) {
        $sanitized_id = str_replace( '-', '_', $type );
        $auth['setting_name']  = "connectors_ai_{$sanitized_id}_api_key";
        $constant_case         = strtoupper( preg_replace( '/([a-z])([A-Z])/', '$1_$2', $sanitized_id ) ) . '_API_KEY';
        $auth['constant_name'] = $constant_case;
        $auth['env_var_name']  = $constant_case;
      }
      $args = [
        'name'           => $name,
        'description'    => $description,
        'type'           => 'ai_provider',
        'authentication' => $auth,
      ];
      if ( $registry->is_registered( $type ) ) {
        $registry->unregister( $type );
      }
      $registry->register( $type, $args );
    }
  }

  /** @return array<string,string> type → human name, e.g. ['openai' => 'OpenAI']. */
  private function engine_names_by_type(): array {
    $options = $this->core->get_all_options();
    $map = [];
    foreach ( $options['ai_engines'] ?? [] as $engine ) {
      if ( ! empty( $engine['type'] ) ) {
        $map[ $engine['type'] ] = $engine['name'] ?? $engine['type'];
      }
    }
    return $map;
  }

  private function envs_indexed_by_type(): array {
    $options = $this->core->get_all_options();
    $by_type = [];
    if ( ! empty( $options['ai_envs'] ) ) {
      foreach ( $options['ai_envs'] as $env ) {
        $type = $env['type'] ?? '';
        if ( $type && ! isset( $by_type[ $type ] ) ) {
          $by_type[ $type ] = $env;
        }
      }
    }
    return $by_type;
  }

  private function describe_bridge( string $connector_id, array $env_by_type ): string {
    $env = $env_by_type[ $connector_id ] ?? null;
    if ( $env && ! empty( $env['name'] ) ) {
      /* translators: %s: AI Engine environment name. */
      return sprintf( __( 'Using the "%s" environment from AI Engine.', 'ai-engine' ), $env['name'] );
    }
    return __( 'Add an environment in AI Engine to enable this.', 'ai-engine' );
  }


  // ───────────────────────────────────────────────────────────────────────
  // Key bridge.
  // ───────────────────────────────────────────────────────────────────────

  public function maybe_bridge_key_to_env_added( $option, $value ): void {
    $this->maybe_bridge_key_to_env( $option, '', $value );
  }

  /**
   * When the user saves a key on the WP Connectors page, mirror it to the
   * first AI Engine environment of that provider type.
   */
  public function maybe_bridge_key_to_env( $option, $old_value, $new_value ): void {
    if ( self::$bridging ) {
      return;
    }
    if ( strpos( $option, 'connectors_ai_' ) !== 0 || substr( $option, -8 ) !== '_api_key' ) {
      return;
    }
    if ( $old_value === $new_value ) {
      return;
    }
    $provider_id = substr( $option, strlen( 'connectors_ai_' ), -strlen( '_api_key' ) );
    $provider_id = str_replace( '_', '-', $provider_id );
    $options = $this->core->get_all_options();
    if ( empty( $options['ai_envs'] ) ) {
      return;
    }
    foreach ( $options['ai_envs'] as $env ) {
      if ( isset( $env['type'] ) && $env['type'] === $provider_id ) {
        self::$bridging = true;
        try {
          $this->core->update_ai_env( $env['id'], 'apikey', (string) $new_value );
        } finally {
          self::$bridging = false;
        }
        return;
      }
    }
  }

  /**
   * When AI Engine options are saved, mirror each bridged env's key to the
   * matching WP Connectors option so the `/options-connectors.php` page shows
   * the provider as connected.
   */
  public function mirror_envs_to_wp_connectors( $old_value, $new_value ): void {
    if ( self::$bridging ) {
      return;
    }
    if ( ! is_array( $new_value ) || empty( $new_value['ai_envs'] ) ) {
      return;
    }
    self::$bridging = true;
    try {
      $seen = [];
      foreach ( $new_value['ai_envs'] as $env ) {
        $type = $env['type'] ?? '';
        $key  = $env['apikey'] ?? '';
        if ( ! $type || isset( $seen[ $type ] ) ) {
          continue;
        }
        $seen[ $type ]   = true;
        $option_name = 'connectors_ai_' . str_replace( '-', '_', $type ) . '_api_key';
        $current     = get_option( $option_name, '' );
        if ( $current !== $key ) {
          update_option( $option_name, $key );
        }
      }
    } finally {
      self::$bridging = false;
    }
  }

  /** One-shot initial sync from AI Engine envs → WP Connectors options. */
  public function initial_sync(): void {
    $options = $this->core->get_all_options();
    if ( ! empty( $options ) ) {
      $this->mirror_envs_to_wp_connectors( [], $options );
    }
  }

  // ───────────────────────────────────────────────────────────────────────
  // Banner on the Connectors page.
  // ───────────────────────────────────────────────────────────────────────

  public function maybe_render_banner(): void {
    $screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
    $id = $screen ? $screen->id : ( $GLOBALS['hook_suffix'] ?? '' );
    $targets = [ 'options-connectors', 'options-connectors.php', 'settings_page_options-connectors-wp-admin' ];
    if ( ! in_array( $id, $targets, true ) ) {
      return;
    }
    $this->render_banner();
  }

  public function render_banner(): void {
    $mode        = $this->get_mode();
    $nonce       = wp_create_nonce( 'mwai_wpai_connectors' );
    $ajaxUrl     = admin_url( 'admin-ajax.php' );
    $settingsUrl = admin_url( 'admin.php?page=mwai_settings&nekoTab=settings' );
    $isManaged   = $mode === 'managed';

    // Copy — short, calm, informative. No marketing shouting.
    $title = $isManaged
      ? __( 'Managed by AI Engine.', 'ai-engine' )
      : __( 'AI Engine can manage your connectors.', 'ai-engine' );

    if ( $isManaged ) {
      $sub = __( 'All WordPress AI requests run through AI Engine.', 'ai-engine' );
    }
    else {
      $sub = __( 'Add Insights, cost tracking, MCP tools, and six more providers in one click.', 'ai-engine' );
    }

    $payload = [
      'nonce'     => $nonce,
      'ajaxUrl'   => $ajaxUrl,
      'settings'  => $settingsUrl,
      'managed'   => $isManaged,
      'title'     => $title,
      'sub'       => $sub,
      'enable'    => __( 'Enable', 'ai-engine' ),
      'dismiss'   => __( 'Dismiss', 'ai-engine' ),
      'configure' => __( 'Configure', 'ai-engine' ),
      'stop'      => __( 'Stop', 'ai-engine' ),
      'learnMore' => __( 'Learn more', 'ai-engine' ),
      'learnUrl'  => 'https://meowapps.com/wordpress-7-ai-engine-gateway/',
      'manageLead' => __( 'Need another provider? Add or edit environments in', 'ai-engine' ),
      'manageLink' => __( 'AI Engine settings', 'ai-engine' ),
    ];
    ?>
    <style>
      /* Injected below the Connectors page header. Uses a quiet, native look
         so it sits inside the SPA as if it belonged there. */
      .mwai-wpai-banner {
        margin: 0 0 16px;
        padding: 12px 16px;
        display: flex; align-items: center; gap: 12px;
        background: #f0f4ff;
        border: 1px solid #d6deff;
        border-radius: 4px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 13px; line-height: 1.4;
        color: #1e1e1e;
      }
      .mwai-wpai-banner.is-managed { background: #e8f8ef; border-color: #c3ecd3; }
      .mwai-wpai-banner-icon {
        width: 32px; height: 32px; border-radius: 50%;
        background: #2f5fff; color: #fff;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }
      .mwai-wpai-banner.is-managed .mwai-wpai-banner-icon { background: #10b981; }
      .mwai-wpai-banner-icon svg { width: 18px; height: 18px; display: block; }
      .mwai-wpai-banner-text { flex: 1; min-width: 0; }
      .mwai-wpai-banner-text strong { font-weight: 600; }
      .mwai-wpai-banner-text span { color: #50575e; }
      .mwai-wpai-banner-actions { display: flex; gap: 6px; flex-shrink: 0; }
      .mwai-wpai-btn {
        appearance: none;
        border: 1px solid transparent;
        border-radius: 3px;
        padding: 4px 12px;
        font: inherit; font-size: 12px; font-weight: 500;
        cursor: pointer;
        text-decoration: none;
        transition: background 0.12s ease, border-color 0.12s ease;
      }
      .mwai-wpai-btn-primary { background: #2f5fff; color: #fff; }
      .mwai-wpai-btn-primary:hover { background: #2448cc; color: #fff; }
      .mwai-wpai-banner.is-managed .mwai-wpai-btn-primary { background: #10b981; }
      .mwai-wpai-banner.is-managed .mwai-wpai-btn-primary:hover { background: #0d9b6d; }
      .mwai-wpai-btn-ghost { background: transparent; color: #50575e; border-color: transparent; }
      .mwai-wpai-btn-ghost:hover { background: rgba(0,0,0,0.04); color: #1e1e1e; }
      .mwai-wpai-btn[disabled] { opacity: 0.5; cursor: default; }
    </style>
    <script>
    (function () {
      var D = <?php echo wp_json_encode( $payload ); ?>;

      function build() {
        var host = document.createElement('div');
        host.className = 'mwai-wpai-banner' + (D.managed ? ' is-managed' : '');
        host.setAttribute('role', 'status');
        // Checkmark when managed (high-confidence success). Spark icon
        // when we're just inviting the user to turn the takeover on.
        var iconSvg = D.managed
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="5 12 10 17 19 7"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
        host.innerHTML = [
          '<span class="mwai-wpai-banner-icon">', iconSvg, '</span>',
          '<div class="mwai-wpai-banner-text">',
            '<strong></strong> <span class="mwai-wpai-banner-sub"></span>',
          '</div>',
          '<div class="mwai-wpai-banner-actions"></div>',
        ].join('');
        host.querySelector('strong').textContent = D.title;
        host.querySelector('.mwai-wpai-banner-sub').textContent = D.sub;

        var actions = host.querySelector('.mwai-wpai-banner-actions');
        function btn(label, cls, onClick, href) {
          var b = document.createElement((onClick === 'link' || href) ? 'a' : 'button');
          b.className = 'mwai-wpai-btn ' + cls;
          b.textContent = label;
          if (href) {
            b.href = href;
            b.target = '_blank';
            b.rel = 'noopener noreferrer';
          } else if (onClick === 'link') {
            b.href = D.settings;
          } else {
            b.addEventListener('click', onClick);
          }
          actions.appendChild(b);
        }
        function toggle(mode) {
          return function (e) {
            var t = e.currentTarget; t.disabled = true;
            var f = new FormData();
            f.append('action', 'mwai_wpai_connectors_set_mode');
            f.append('nonce', D.nonce);
            f.append('mode', mode);
            fetch(D.ajaxUrl, { method: 'POST', credentials: 'same-origin', body: f })
              .then(function () { window.location.reload(); })
              .catch(function () { t.disabled = false; });
          };
        }
        if (D.managed) {
          btn(D.configure, 'mwai-wpai-btn-primary', 'link');
          btn(D.stop, 'mwai-wpai-btn-ghost', toggle('observe'));
        } else {
          btn(D.enable, 'mwai-wpai-btn-primary', toggle('managed'));
          btn(D.learnMore, 'mwai-wpai-btn-ghost', null, D.learnUrl);
          btn(D.dismiss, 'mwai-wpai-btn-ghost', toggle('off'));
        }
        return host;
      }

      // Insert as the first child of .connectors-page so it inherits the
      // same column width and padding as the provider cards. Fall back to
      // placing it after the page header if .connectors-page isn't found.
      function ensureBanner() {
        if (document.querySelector('.mwai-wpai-banner')) return;
        var page = document.querySelector('.connectors-page');
        if (page) {
          page.insertBefore(build(), page.firstChild);
          return;
        }
        var header = document.querySelector('.boot-layout__stage header');
        if (header && header.parentNode) {
          header.parentNode.insertBefore(build(), header.nextSibling);
        }
      }

      // When managed, rewrite the trailing "search the plugin directory" line
      // and redirect any "Edit" button clicks to AI Engine's settings, since
      // editing a connector here would modify WP AI Client state — not AI
      // Engine state — and that divergence would be confusing.
      function tweakManagedPage() {
        if (!D.managed) return;
        var page = document.querySelector('.connectors-page');
        if (!page) return;

        // Replace the "search the plugin directory" hint with a pointer to AI
        // Engine. We flag the <p> with data-mwai so we don't keep re-writing.
        var ps = page.querySelectorAll('p');
        for (var i = 0; i < ps.length; i++) {
          var p = ps[i];
          if (p.dataset.mwaiReplaced) continue;
          var t = (p.textContent || '').toLowerCase();
          if (t.indexOf('plugin directory') !== -1 || t.indexOf('search') !== -1) {
            p.innerHTML = '';
            var a = document.createElement('a');
            a.href = D.settings;
            a.textContent = D.manageLink;
            p.appendChild(document.createTextNode(D.manageLead + ' '));
            p.appendChild(a);
            p.appendChild(document.createTextNode('.'));
            p.dataset.mwaiReplaced = '1';
          }
        }

        // Redirect Edit clicks.
        var buttons = page.querySelectorAll('button');
        for (var j = 0; j < buttons.length; j++) {
          var b = buttons[j];
          if (b.dataset.mwaiIntercepted) continue;
          if ((b.textContent || '').trim() === 'Edit') {
            b.dataset.mwaiIntercepted = '1';
            b.addEventListener('click', function (e) {
              e.preventDefault();
              e.stopPropagation();
              window.location.href = D.settings;
            }, true);
          }
        }
      }

      function run() { ensureBanner(); tweakManagedPage(); }

      var tries = 0;
      var iv = setInterval(function () {
        run();
        if (document.querySelector('.mwai-wpai-banner') && ++tries > 40) clearInterval(iv);
      }, 120);

      var app = document.getElementById('options-connectors-wp-admin-app')
             || document.getElementById('options-connectors-app');
      if (app && 'MutationObserver' in window) {
        new MutationObserver(run).observe(app, { childList: true, subtree: true });
      }
    })();
    </script>
    <?php
  }
}
