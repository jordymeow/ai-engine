<?php

if ( !class_exists( 'MeowKit_MWAI_Admin' ) ) {

  class MeowKit_MWAI_Admin {
    public static $loaded = false;
    public static $version = '5.1';
    public static $admin_version = '5.1';
    public static $network_license_modal_added = false;
    public static $network_license_plugins = [];

    /**
     * Storage for instances that need deferred initialization.
     *
     * WordPress Loading Sequence Problem:
     * 1. Load all plugin files
     * 2. Fire 'plugins_loaded' hook        ← Most plugins instantiate Admin here
     * 3. Load wp-includes/pluggable.php    ← current_user_can() defined here
     * 4. Fire 'init' hook                  ← Safe to use pluggable functions
     *
     * When plugins instantiate during 'plugins_loaded', the pluggable functions
     * (current_user_can, wp_get_current_user) don't exist yet. This array stores
     * instances until 'init' when we can safely call those functions.
     *
     * @var array
     */
    private static $deferred_instances = array();

    public $prefix;    // prefix used for actions, filters (mfrh)
    public $mainfile;  // plugin main file (media-file-renamer.php)
    public $domain;    // domain used for translation (media-file-renamer)
    public $isPro = false;

    // Store constructor params that affect per-instance setup
    private $disableReview = false;

    public static $logo = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDYiIHZpZXdCb3g9IjAgMCA2NCA0NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBjbGlwUGF0aD0idXJsKCNjbGlwMF8zMTBfMjI5KSI+CiAgICA8cGF0aCBkPSJNNjQgMzAuNjQwOEM2NCAyNy43OTg1IDYwLjA4MTYgMjUuODMwMyA1NS44Mjk4IDI1LjgzMDNDNTQuODU5MyAyNS44MzAzIDUzLjkzMTEgMjUuOTMzIDUzLjA3NiAyNi4xMjUzQzQ5Ljg4NjUgMTkuMDc5IDQxLjY1MzkgMTMuMDg1MyAzMi4wMDAyIDEzLjA4NTNDMzAuODMzNyAxMy4wODUzIDI5LjY4ODEgMTMuMTcyNyAyOC41Njk4IDEzLjMzOTJDMjcuMjA2OSAxMC4zMDc2IDIyLjY3NjIgMi40MzQyNiAxMS41OTU0IDAuMDgzMDA2NEMxMS4wNDkxIC0wLjAzMjc0NTYgMTAuNDk0NiAwLjI0MDU3OCAxMC4yNTkgMC43NDY5QzguODU5MTMgMy43NTYwOCA0Ljc0MjQ3IDE0LjQxMTYgMTAuMjQwMyAyNS45OTMxQzkuNTgxNjUgMjUuODg2NCA4Ljg4NzUxIDI1LjgzMDMgOC4xNzAyMiAyNS44MzAzQzMuOTE4MzkgMjUuODMwMyAwIDI3Ljc5ODUgMCAzMC42NDA4QzAgMzMuNDgzIDMuOTE4MzkgMzUuMjI3MiA4LjE3MDIyIDM1LjIyNzJDOC43MTEyNyAzNS4yMjcyIDkuMjM5MjUgMzUuMTk4OCA5Ljc0ODkzIDM1LjE0MzVDOS40MzYwMiAzNS4yNjY0IDkuMTIyNzUgMzUuNDA3NSA4LjgxMTcxIDM1LjU2NzdDNS42OTM4OCAzNy4xNzA3IDMuOTY4OCA0MC4wMzEyIDQuOTU5MDQgNDEuOTU2OEM1Ljk0ODkgNDMuODgyNCA5LjI3OTIgNDQuMTQ0MiAxMi4zOTcgNDIuNTQxMkMxMy4wNDY0IDQyLjIwNzQgMTMuNjM0OCA0MS44MTkgMTQuMTUxNiA0MS4zOTZDMTguMjYyNyA0NC40OTY3IDI0LjcyODMgNDUuOTgwOSAzMS45OTk4IDQ1Ljk4MDlDMzkuMjcxMyA0NS45ODA5IDQ1LjczNyA0NC40OTY3IDQ5Ljg0OCA0MS4zOTZDNTAuMzY0NCA0MS44MTkgNTAuOTUzMyA0Mi4yMDc0IDUxLjYwMjYgNDIuNTQxMkM1NC43MjA0IDQ0LjE0NDIgNTguMDUwMyA0My44ODI0IDU5LjA0MDYgNDEuOTU2OEM2MC4wMzA1IDQwLjAzMTIgNTguMzA1NyAzNy4xNzA3IDU1LjE4NzkgMzUuNTY3N0M1NC44NzYxIDM1LjQwNzUgNTQuNTYyMSAzNS4yNjY3IDU0LjI0ODUgMzUuMTQzNUM1NC43NTg5IDM1LjE5ODggNTUuMjg3NiAzNS4yMjc1IDU1LjgyOTQgMzUuMjI3NUM2MC4wODEyIDM1LjIyNzUgNjMuOTk5NiAzMy40ODM0IDYzLjk5OTYgMzAuNjQxMUw2NCAzMC42NDA4WiIgZmlsbD0id2hpdGUiLz4KICAgIDxwYXRoIGQ9Ik0yMi4yMjkzIDM2Ljc0NDNDMjYuNTkzNSAzNi43NDQzIDMwLjEzMTQgMzMuMjA2NCAzMC4xMzE0IDI4Ljg0MjJDMzAuMTMxNCAyNC40NzggMjYuNTkzNSAyMC45NDAxIDIyLjIyOTMgMjAuOTQwMUMxNy44NjUxIDIwLjk0MDEgMTQuMzI3MSAyNC40NzggMTQuMzI3MSAyOC44NDIyQzE0LjMyNzEgMzMuMjA2NCAxNy44NjUxIDM2Ljc0NDMgMjIuMjI5MyAzNi43NDQzWiIgZmlsbD0iIzAwRTI4RSIvPgogICAgPHBhdGggZD0iTTIyLjI2NTUgMzMuMTM2MUMyMy41MDIyIDMzLjEzNjEgMjQuNTA0NyAzMS4yODA1IDI0LjUwNDcgMjguOTkxNUMyNC41MDQ3IDI2LjcwMjQgMjMuNTAyMiAyNC44NDY4IDIyLjI2NTUgMjQuODQ2OEMyMS4wMjg4IDI0Ljg0NjggMjAuMDI2MiAyNi43MDI0IDIwLjAyNjIgMjguOTkxNUMyMC4wMjYyIDMxLjI4MDUgMjEuMDI4OCAzMy4xMzYxIDIyLjI2NTUgMzMuMTM2MVoiIGZpbGw9IiMzQzZFOEIiLz4KICAgIDxwYXRoIGQ9Ik0zMS45OTk4IDM3LjkxNTZDMzMuNDIzNyAzNy45MTU2IDM0LjU3ODEgMzcuMzQwOSAzNC41NzgxIDM2LjYzMTlDMzQuNTc4MSAzNS45MjI5IDMzLjQyMzcgMzUuMzQ4MSAzMS45OTk4IDM1LjM0ODFDMzAuNTc1OCAzNS4zNDgxIDI5LjQyMTUgMzUuOTIyOSAyOS40MjE1IDM2LjYzMTlDMjkuNDIxNSAzNy4zNDA5IDMwLjU3NTggMzcuOTE1NiAzMS45OTk4IDM3LjkxNTZaIiBmaWxsPSIjRkY5NDkzIi8+CiAgICA8cGF0aCBkPSJNNTQuMjUwMyAzNS4xMDU4QzU0Ljc2IDM1LjE2MTEgNTUuMjg3OSAzNS4xODk0IDU1LjgyOSAzNS4xODk0QzYwLjA4MDggMzUuMTg5NCA2My45OTkyIDMzLjQ0NTMgNjMuOTk5MiAzMC42MDNDNjMuOTk5MiAyNy43NjA4IDYwLjA4MDggMjUuNzkyNiA1NS44MjkgMjUuNzkyNkM1NS4xMTE3IDI1Ljc5MjYgNTQuNDE3NiAyNS44NDkgNTMuNzU4NSAyNS45NTU4QzU5LjI1NjcgMTQuMzc0MiA1NS4xMzk3IDMuNzE4NzIgNTMuNzQwMiAwLjcwOTU0NkM1My41MDQ2IDAuMjAzMjI1IDUyLjk1MDEgLTAuMDcwMDk5MSA1Mi40MDM4IDAuMDQ1NjUyOUM0MS4zMjMgMi4zOTY5MSAzNi43OTIzIDEwLjI3MDcgMzUuNDI5OCAxMy4zMDE1QzM0LjQ1NDEgMTMuMTU2NiAzMy40NTc5IDEzLjA3MTEgMzIuNDQ1MiAxMy4wNTE3QzMxLjI3NDMgMjAuMDMzIDI4Ljk2NTYgNDMuOTM2NSA1NC4zNDM2IDM1LjE0MzlDNTQuMzEyMyAzNS4xMzEyIDU0LjI4MTMgMzUuMTE4MSA1NC4yNDk5IDM1LjEwNThINTQuMjUwM1oiIGZpbGw9IiMyQjlERkYiLz4KICAgIDxwYXRoIGQ9Ik00MS43MzQyIDMzLjEzNjFDNDIuOTcwOSAzMy4xMzYxIDQzLjk3MzUgMzEuMjgwNSA0My45NzM1IDI4Ljk5MTVDNDMuOTczNSAyNi43MDI0IDQyLjk3MDkgMjQuODQ2OCA0MS43MzQyIDI0Ljg0NjhDNDAuNDk3NSAyNC44NDY4IDM5LjQ5NSAyNi43MDI0IDM5LjQ5NSAyOC45OTE1QzM5LjQ5NSAzMS4yODA1IDQwLjQ5NzUgMzMuMTM2MSA0MS43MzQyIDMzLjEzNjFaIiBmaWxsPSIjM0M2RThCIi8+CiAgPC9nPgogIDxkZWZzPgogICAgPGNsaXBQYXRoIGlkPSJjbGlwMF8zMTBfMjI5Ij4KICAgICAgPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjQ1Ljk2MTciIGZpbGw9IndoaXRlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDAuMDE5MTY1KSIvPgogICAgPC9jbGlwUGF0aD4KICA8L2RlZnM+Cjwvc3ZnPgo=';

    public function __construct( $prefix, $mainfile, $domain, $isPro = false, $disableReview = false, $freeOnly = false ) {

      // ALWAYS set instance properties first - these are needed regardless of when setup runs
      $this->prefix = $prefix;
      $this->mainfile = $mainfile;
      $this->domain = $domain;
      $this->isPro = $isPro;
      $this->disableReview = $disableReview;
      self::register_copy();

      if ( is_admin() ) {

        // Skip AJAX and REST requests to avoid unnecessary processing
        if ( MeowKit_MWAI_Helpers::is_asynchronous_request() ) {
          return;
        }

        // Check if WordPress pluggable functions are available yet.
        // These are defined in wp-includes/pluggable.php, which WordPress loads
        // AFTER the 'plugins_loaded' hook but BEFORE the 'init' hook.
        if ( !function_exists( 'current_user_can' ) || !function_exists( 'wp_get_current_user' ) ) {
          // Functions don't exist yet - defer admin setup until 'init' hook
          // This is NORMAL behavior when plugins instantiate on 'plugins_loaded'
          $this->defer_admin_setup();
          // Continue to rest of constructor (filters, license checks, etc.)
        } else {
          // Functions already exist - safe to run admin setup immediately
          // This happens when plugins instantiate on 'init' or later
          $this->run_admin_setup();
        }

        // License-related admin notices (doesn't require pluggable functions)
        $license = get_option( $this->prefix . '_license', '' );
        if ( !empty( $license ) && !$this->isPro ) {
          add_action( 'admin_notices', [ $this, 'admin_notices_licensed_free' ] );
        }
      }

      // ALWAYS register these filters (they work at any time)
      add_filter( 'plugin_row_meta', [ $this, 'custom_plugin_row_meta' ], 10, 2 );
      add_filter( 'edd_sl_api_request_verify_ssl', [ $this, 'request_verify_ssl' ], 10, 0 );
    }

    /**
     * Every plugin ships its own copy of this class (renamed per prefix), and they all share one Meow Apps
     * menu. The newest copy owns it, whatever the plugin load order: copies note their version here, in a
     * global every prefix can read, and only the one with the highest $admin_version (the first of them on
     * a tie) builds the page. Older copies don't know this rule, see admin_menu_start() for the takeover.
     */
    private static function register_copy() {
      $newest = isset( $GLOBALS['meowapps_admin_newest'] ) ? $GLOBALS['meowapps_admin_newest'] : null;
      if ( !is_array( $newest ) || version_compare( self::$admin_version, $newest['version'], '>' ) ) {
        $GLOBALS['meowapps_admin_newest'] = [ 'version' => self::$admin_version, 'class' => __CLASS__ ];
      }
    }

    private static function is_newest_copy() {
      return isset( $GLOBALS['meowapps_admin_newest']['class'] ) && $GLOBALS['meowapps_admin_newest']['class'] === __CLASS__;
    }

    /**
     * Defer admin setup until WordPress 'init' hook.
     *
     * This method stores the current instance and registers a one-time
     * 'init' hook callback that will process all deferred instances.
     *
     * Why defer? Because we need current_user_can() to check permissions,
     * and that function doesn't exist until after 'plugins_loaded'.
     */
    private function defer_admin_setup() {
      // Add this instance to the queue for processing on 'init'
      self::$deferred_instances[] = $this;

      // Register the 'init' hook only once (for the first deferred instance)
      if ( count( self::$deferred_instances ) === 1 ) {
        add_action( 'init', array( __CLASS__, 'process_deferred_instances' ) );
      }
    }

    /**
     * Static callback for 'init' hook - processes all deferred instances.
     *
     * By the time 'init' fires, WordPress has loaded pluggable.php and
     * current_user_can() is guaranteed to exist. We process all instances
     * that were created during 'plugins_loaded' or earlier.
     *
     * This is called as a static method because it processes multiple instances.
     */
    public static function process_deferred_instances() {
      // Belt-and-suspenders check: pluggable functions should ALWAYS exist by 'init'
      // If they somehow don't, log a warning and bail (this should never happen)
      if ( !function_exists( 'current_user_can' ) || !function_exists( 'wp_get_current_user' ) ) {
        trigger_error(
          'MeowKit_MWAI_Admin: Pluggable functions still unavailable on init hook. ' .
          'This should never happen and indicates a serious WordPress core issue.',
          E_USER_WARNING
        );
        return;
      }

      // Process each deferred instance's admin setup
      foreach ( self::$deferred_instances as $instance ) {
        $instance->run_admin_setup();
      }

      // Clear the array to free memory (we won't need these references anymore)
      self::$deferred_instances = array();
    }

    /**
     * Run admin setup - both shared (once) and per-instance (each plugin).
     *
     * SHARED SETUP (once for all plugins):
     * - Issues detection
     * - Meow Apps menu creation
     * - Admin footer customization
     *
     * PER-INSTANCE SETUP (once per plugin):
     * - Ratings system
     * - News system
     *
     * This method is called either immediately (if pluggable functions exist)
     * or deferred until 'init' (if they don't). Either way, it's safe to call
     * current_user_can() here.
     */
    private function run_admin_setup() {
      // SHARED SETUP: Only run once for all Meow Apps plugins
      if ( !MeowKit_MWAI_Admin::$loaded ) {
        // Check for potential issues with WordPress install, other plugins, etc.
        new MeowKit_MWAI_Issues( $this->prefix, $this->mainfile, $this->domain );

        // Create the unified Meow Apps menu (priority 5 to ensure early creation)
        add_action( 'admin_menu', [ $this, 'admin_menu_start' ], 5 );

        // Customize admin footer on Meow Apps pages (after the 100000 older copies use, so the newest wins)
        $page = isset( $_GET['page'] ) ? sanitize_text_field( $_GET['page'] ) : null;
        if ( $page === 'meowapps-main-menu' ) {
          add_filter( 'admin_footer_text', [ $this, 'admin_footer_text' ], 100001, 1 );
        }

        // Promote AI Engine on the WordPress 7 Connectors page when AI Engine
        // itself isn't installed. When AI Engine is active, its own banner
        // takes over, so this path only runs on "bare" Meow Apps installs.
        add_action( 'admin_enqueue_scripts', [ $this, 'maybe_render_wpai_promo' ] );

        MeowKit_MWAI_Admin::$loaded = true;
      }

      // PER-INSTANCE SETUP: Run for each plugin that uses this library
      // Only admins get ratings prompts and news
      if ( $this->is_user_admin() ) {
        // Each plugin adds its own row to the dashboard's plugin table. The filter name is shared on
        // purpose (not prefixed): whichever plugin renders the dashboard collects every installed one.
        add_filter( 'meowapps_plugins_status', [ $this, 'status_row' ] );
        // The site facts the Health tab explains, printed in the footer by the newest copy only.
        add_action( 'admin_footer', [ $this, 'print_site_facts' ] );
        if ( !$this->disableReview ) {
          new MeowKit_MWAI_Ratings( $this->prefix, $this->mainfile, $this->domain );
        }
        new MeowKit_MWAI_News( $this->domain );
      }
    }

    /**
     * Check if current user is a site administrator.
     *
     * This method is only called from run_admin_setup(), which guarantees
     * that pluggable functions exist. No error logging needed - if the
     * functions don't exist, we simply return false as a defensive fallback.
     *
     * @return bool True if user can manage options, false otherwise
     */
    public function is_user_admin() {
      // Defensive check (should never fail if called from run_admin_setup)
      if ( !function_exists( 'current_user_can' ) || !function_exists( 'wp_get_current_user' ) ) {
        return false;
      }
      return current_user_can( 'manage_options' );
    }

    public function custom_plugin_row_meta( $links, $file ) {
      $path = pathinfo( $file );
      $pathName = basename( $path['dirname'] );
      $thisPath = pathinfo( $this->mainfile );
      $thisPathName = basename( $thisPath['dirname'] );
      $isActive = is_plugin_active( $file );
      if ( !$isActive ) {
        return $links;
      }
      $isIssue = $this->isPro && !$this->is_registered();
      // A Pro buyer who installed the plugin but never typed a key is not an issue yet: the red
      // "License Issue" made fresh buyers think the purchase was broken (wave 2 audit, 2026-10-21).
      $neverActivated = $isIssue && empty( get_option( $this->prefix . '_pro_serial', '' ) )
        && empty( get_option( $this->prefix . '_license', '' ) );

      // The licenser already knows WHY validation failed and stores it as
      // license['issue'] (licenser.php), but this badge used to render a flat
      // "License Issue" for every case. That sent people to support to ask a
      // question the plugin could have answered: the most common one by far is a
      // licence whose activation slot is held by another site, which reads as
      // "my licence is broken" and gets reported as a billing problem.
      $issueLabel = __( 'License Issue', $this->domain );
      if ( $isIssue ) {
        $license = get_option( $this->prefix . '_license', '' );
        $issue   = is_array( $license ) && !empty( $license['issue'] ) ? $license['issue'] : null;
        // Codes the store actually sends. Verified against EDD Software Licensing
        // rather than guessed: an invented key would silently never match, and a
        // wrong label is worse than the generic one.
        $labels  = [
          // `error` codes, from a failed activation.
          'no_activations_left'           => __( 'License in use on another site', $this->domain ),
          'expired'                       => __( 'License expired', $this->domain ),
          'disabled'                      => __( 'License revoked', $this->domain ),
          'missing'                       => __( 'License key not recognized', $this->domain ),
          'key_mismatch'                  => __( 'License key not recognized', $this->domain ),
          'item_name_mismatch'            => __( 'License is for another plugin', $this->domain ),
          'invalid_item_id'               => __( 'License is for another plugin', $this->domain ),
          'missing_item_id'               => __( 'License is for another plugin', $this->domain ),
          'bundle_activation_not_allowed' => __( 'This license cannot be activated directly', $this->domain ),
          // `license` statuses, when the key is known but not valid here.
          'site_inactive'                 => __( 'License not activated on this site', $this->domain ),
          'inactive'                      => __( 'License not activated on this site', $this->domain ),
          // Genuinely no answer from the store. NOT invalid_response, which means the
          // store replied and we could not make sense of it: blaming the connection
          // there would send people chasing a firewall that is working fine.
          'no_response'                   => __( 'License server unreachable', $this->domain ),
        ];
        if ( $issue !== null && isset( $labels[ $issue ] ) ) {
          $issueLabel = $labels[ $issue ];
        }
      }
      if ( strpos( $pathName, $thisPathName ) !== false ) {
        // In network admin, handle differently (no settings page available)
        if ( is_network_admin() ) {
          if ( $this->isPro && !$this->is_registered() ) {
            // Show "Register License" link for unregistered Pro plugins
            $new_links = [
              'license' => sprintf(
                '<a href="#" class="meowapps-network-license-link" data-prefix="%s" data-plugin="%s" style="color: #d63638;">%s</a>',
                esc_attr( $this->prefix ),
                esc_attr( $this->nice_name_from_file( $this->mainfile ) ),
                __( 'Register License', $this->domain )
              ),
            ];
            // Track this plugin for the modal
            self::$network_license_plugins[ $this->prefix ] = $this->nice_name_from_file( $this->mainfile );
            // Add modal output hook (only once)
            if ( !self::$network_license_modal_added ) {
              add_action( 'admin_footer', [ __CLASS__, 'output_network_license_modal' ] );
              self::$network_license_modal_added = true;
            }
          }
          elseif ( $this->isPro && $this->is_registered() ) {
            // Pro plugin is registered
            $new_links = [
              'license' => '<span style="color: #a75bd6;">' . __( 'Pro Version', $this->domain ) . '</span>',
            ];
          }
          else {
            // Free plugin
            $new_links = [
              'license' => '<span>' . sprintf( __( '<a target="_blank" href="%s">Get the <u>Pro Version</u></a>', $this->domain ), esc_url( $this->pro_url( 'plugins-list' ) ) ) . '</span>',
            ];
          }
        }
        else {
          // Regular admin - show settings and license status
          $new_links = [
            'settings' =>
            sprintf( __( '<a href="admin.php?page=%s_settings">Settings</a>', $this->domain ), $this->prefix ),
            'license' =>
            $this->is_registered() ?
              ( '<span style="color: #a75bd6;">' . __( 'Pro Version', $this->domain ) . '</span>' ) :
                  ( $neverActivated ? sprintf( '<a href="%s">%s</a>', esc_url( admin_url( 'admin.php?page=' . $this->prefix . '_settings' ) ), esc_html__( 'Activate your license', $this->domain ) ) :
                  ( $isIssue ? ( '<span style="color: #ff3434;">' . esc_html( $issueLabel ) . '</span>' ) : ( '<span>' . sprintf( __( '<a target="_blank" href="%s">Get the <u>Pro Version</u></a>', $this->domain ), esc_url( $this->pro_url( 'plugins-list' ) ) ) . '</span>' ) ) ),
          ];
        }
        $links = array_merge( $new_links, $links );
      }
      return $links;
    }

    /**
     * Output the network license registration modal.
     * Called via admin_footer hook in network admin.
     */
    public static function output_network_license_modal() {
      $rest_url = esc_url( rest_url() );
      $nonce = wp_create_nonce( 'wp_rest' );
      ?>
      <div id="meowapps-network-license-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:100000; align-items:center; justify-content:center;">
        <div style="background:#fff; padding:24px; border-radius:8px; max-width:450px; width:90%; box-shadow:0 4px 20px rgba(0,0,0,0.3);">
          <h2 style="margin:0 0 8px 0; font-size:18px;">Register License</h2>
          <p id="meowapps-license-plugin-name" style="margin:0 0 16px 0; color:#666;"></p>
          <input type="text" id="meowapps-license-key-input" placeholder="Enter your license key" style="width:100%; padding:10px; font-size:14px; border:1px solid #8c8f94; border-radius:4px; box-sizing:border-box;" />
          <p id="meowapps-license-message" style="margin:12px 0 0 0; padding:10px; border-radius:4px; display:none;"></p>
          <div style="margin-top:16px; display:flex; gap:10px; justify-content:flex-end;">
            <button type="button" id="meowapps-license-cancel" class="button">Cancel</button>
            <button type="button" id="meowapps-license-submit" class="button button-primary">Validate & Register</button>
          </div>
        </div>
      </div>
      <?php
      ob_start();
      ?>
      (function() {
        var modal = document.getElementById('meowapps-network-license-modal');
        var input = document.getElementById('meowapps-license-key-input');
        var message = document.getElementById('meowapps-license-message');
        var pluginName = document.getElementById('meowapps-license-plugin-name');
        var submitBtn = document.getElementById('meowapps-license-submit');
        var cancelBtn = document.getElementById('meowapps-license-cancel');
        var currentPrefix = '';

        function showMessage(text, isError) {
          message.textContent = text;
          message.style.display = 'block';
          message.style.background = isError ? '#fcf0f1' : '#edfaef';
          message.style.color = isError ? '#d63638' : '#1e7e34';
          message.style.border = '1px solid ' + (isError ? '#d63638' : '#1e7e34');
        }

        function hideMessage() {
          message.style.display = 'none';
        }

        function openModal(prefix, plugin) {
          currentPrefix = prefix;
          pluginName.textContent = plugin;
          input.value = '';
          hideMessage();
          submitBtn.disabled = false;
          submitBtn.textContent = 'Validate & Register';
          modal.style.display = 'flex';
          input.focus();
        }

        function closeModal() {
          modal.style.display = 'none';
          currentPrefix = '';
        }

        // Handle click on "Register License" links
        document.addEventListener('click', function(e) {
          if (e.target.classList.contains('meowapps-network-license-link')) {
            e.preventDefault();
            var prefix = e.target.getAttribute('data-prefix');
            var plugin = e.target.getAttribute('data-plugin');
            openModal(prefix, plugin);
          }
        });

        // Close modal on cancel or clicking outside
        cancelBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) {
          if (e.target === modal) closeModal();
        });

        // Handle escape key
        document.addEventListener('keydown', function(e) {
          if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
          }
        });

        // Handle enter key in input
        input.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') {
            submitBtn.click();
          }
        });

        // Submit license
        submitBtn.addEventListener('click', function() {
          var licenseKey = input.value.trim();
          if (!licenseKey) {
            showMessage('Please enter a license key.', true);
            return;
          }

          submitBtn.disabled = true;
          submitBtn.textContent = 'Validating...';
          hideMessage();

          var restUrl = '<?php echo $rest_url; ?>meow-licenser/' + currentPrefix + '/v1/set_license/';

          fetch(restUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-WP-Nonce': '<?php echo $nonce; ?>'
            },
            body: JSON.stringify({ serialKey: licenseKey })
          })
          .then(function(response) { return response.json(); })
          .then(function(data) {
            if (data.success && data.data && !data.data.issue) {
              showMessage('License registered successfully! Reloading...', false);
              setTimeout(function() { location.reload(); }, 1500);
            } else {
              var errorMsg = 'License validation failed.';
              if (data.data && data.data.issue) {
                errorMsg = 'License issue: ' + data.data.issue;
              }
              showMessage(errorMsg, true);
              submitBtn.disabled = false;
              submitBtn.textContent = 'Validate & Register';
            }
          })
          .catch(function(error) {
            showMessage('Error: ' + error.message, true);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Validate & Register';
          });
        });
      })();
      <?php
      wp_print_inline_script_tag( ob_get_clean() );
    }

    public function request_verify_ssl() {
      return get_option( 'force_sslverify', false );
    }

    /**
     * Tagged link to the store, so a click on "Get the Pro Version" shows up in the sale's
     * attribution (utm_* are saved on each order) instead of arriving as an anonymous visit.
     */
    public function pro_url( $medium ) {
      $slug = basename( dirname( $this->mainfile ) );
      $slug = preg_replace( '/-pro$/', '', $slug );
      return add_query_arg( [
        'utm_source'   => $slug,
        'utm_medium'   => $medium,
        'utm_campaign' => 'get-pro',
      ], 'https://meowapps.com/' );
    }

    public function nice_name_from_file( $file ) {
      $info = pathinfo( $file );
      if ( !empty( $info ) ) {
        if ( $info['filename'] == 'wplr-sync' ) {
          return 'WP/LR Sync';
        }
        $info['filename'] = str_replace( '-', ' ', $info['filename'] );
        $file = ucwords( $info['filename'] );
      }
      return $file;
    }

    public function admin_notices_licensed_free() {
      // Verify the nonce before removing the license from a POST request (CSRF protection).
      if ( isset( $_POST[$this->prefix . '_reset_sub'] )
        && isset( $_POST[ $this->prefix . '_reset_sub_nonce' ] )
        && wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST[ $this->prefix . '_reset_sub_nonce' ] ) ), $this->prefix . '_reset_sub' ) ) {
        delete_option( $this->prefix . '_pro_serial' );
        delete_option( $this->prefix . '_license' );
        return;
      }
      // This notice was silently dead for a long time (no echo). Now that it prints, keep it to the
      // plugins list and the plugin's own screens rather than every admin page.
      $screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
      $page   = isset( $_GET['page'] ) ? sanitize_key( wp_unslash( $_GET['page'] ) ) : '';
      if ( !( ( $screen && $screen->id === 'plugins' ) || strpos( $page, $this->prefix ) === 0 ) ) {
        return;
      }
      $html = '<div class="notice notice-warning">';
      $html .= sprintf(
        __( '<p>You are using the free version of <b>%1$s</b>, but a Pro license was found on this site. The Pro version was probably replaced by the free one during an update. <b>Download Pro again</b> from <a target="_blank" href="%2$s">your account at Meow Apps</a>: your license stays valid. If you prefer to keep the free version, click this button to clear this message.', $this->domain ),
        $this->nice_name_from_file( $this->mainfile ),
        esc_url( 'https://meowapps.com/account/' )
      );
      $html .= '<p>
                                                                                                                                                  <form method="post" action="">
                                                                                                                                                  <input type="hidden" name="' . $this->prefix . '_reset_sub" value="true"><input type="hidden" name="' . $this->prefix . '_reset_sub_nonce" value="' . esc_attr( wp_create_nonce( $this->prefix . '_reset_sub' ) ) . '">
                                                                                                                                                  <input type="submit" name="submit" id="submit" class="button" value="'
      . __( 'Remove the license', $this->domain ) . '">
                                                                                                                                                    </form>
                                                                                                                                                    </p>';
      $html .= '</div>';
      echo wp_kses( $html, [
        'div' => [ 'class' => [] ], 'p' => [], 'b' => [], 'a' => [ 'href' => [], 'target' => [] ],
        'form' => [ 'method' => [], 'action' => [] ],
        'input' => [ 'type' => [], 'name' => [], 'value' => [], 'id' => [], 'class' => [] ],
      ] );
    }

    public function admin_menu_start() {
      if ( !self::is_newest_copy() ) {
        return;
      }

      // Hide the admin if user doesn't like Meow much
      if ( get_option( 'meowapps_hide_meowapps', false ) ) {
        register_setting( 'general', 'meowapps_hide_meowapps', [ 'type' => 'boolean', 'sanitize_callback' => 'rest_sanitize_boolean' ] );
        add_settings_field( 'meowapps_hide_ads', 'Meow Apps Menu', [ $this, 'meowapps_hide_dashboard_callback' ], 'general' );
        return;
      }

      // Create standard menu if it does not already exist.
      // The cat logo is injected as an <img> inside the menu title (rather than passed as
      // the $icon_url argument) so the original SVG fills are preserved; passing it via
      // $icon_url makes WordPress add the .svg class and the admin color scheme strips
      // the colors to a single fill.
      global $submenu;
      $title = '<img alt="Meow Apps" class="meowapps-menu-icon" src="' . MeowKit_MWAI_Admin::$logo . '" />Meow Apps';
      if ( isset( $submenu[ 'meowapps-main-menu' ] ) ) {
        $this->take_over_menu( $title );
      }
      else {
        add_menu_page(
          'Meow Apps',
          $title,
          'manage_options',
          'meowapps-main-menu',
          [ $this, 'admin_meow_apps' ],
          '',
          82
        );
        add_submenu_page(
          'meowapps-main-menu',
          __( 'Dashboard', $this->domain ),
          __( 'Dashboard', $this->domain ),
          'manage_options',
          'meowapps-main-menu',
          [ $this, 'admin_meow_apps' ]
        );
      }

      // Position the cat icon so it sits in the standard icon column in both the
      // expanded and the collapsed (folded) sidebar.
      //
      // The image lives inside the .wp-menu-name title (where the original code
      // put it) so the <img> renders with its native SVG fills. When the sidebar
      // is collapsed, WP hides .wp-menu-name (and everything inside it), so a
      // small JS snippet below clones the same <img> into the .wp-menu-image
      // slot, which WP keeps visible in both states. We use a real <img>
      // (not a background-image) on purpose: at small sizes WP's admin renders
      // background-image SVGs noticeably lighter than the equivalent <img>,
      // and we want the colored cat in both states.
      //
      // The !important rules also override an older "display: none" style that
      // previous-generation Meow Apps common copies inject for .wp-menu-image;
      // if any of them load first, ours still wins.
      // Enqueue the menu-icon CSS/JS through the assets API instead of echoing inline tags.
      add_action( 'admin_enqueue_scripts', function () {
        $css = '
          #toplevel_page_meowapps-main-menu .meowapps-menu-icon { width: 20px; height: auto; position: absolute; margin-left: -28px; margin-top: 3px; }
          #toplevel_page_meowapps-main-menu .wp-menu-image { display: block !important; position: relative; }
          #toplevel_page_meowapps-main-menu .wp-menu-image::before { display: none !important; }
          #toplevel_page_meowapps-main-menu .wp-menu-image .meowapps-menu-icon-folded { display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, calc(-50% - 3px)); width: 20px; height: auto; }
          body.folded #toplevel_page_meowapps-main-menu .wp-menu-image .meowapps-menu-icon-folded { display: block; }
          body.folded #toplevel_page_meowapps-main-menu .meowapps-menu-icon { display: none; }
          @media only screen and (max-width: 960px) {
            body.auto-fold #toplevel_page_meowapps-main-menu .wp-menu-image .meowapps-menu-icon-folded { display: block; }
            body.auto-fold #toplevel_page_meowapps-main-menu .meowapps-menu-icon { display: none; }
          }';
        wp_add_inline_style( 'admin-menu', $css );

        // Clone the in-title cat icon into the .wp-menu-image slot (CSS shows it only when folded).
        $js = 'document.addEventListener("DOMContentLoaded", function () {'
          . 'var li = document.getElementById("toplevel_page_meowapps-main-menu"); if ( !li ) { return; }'
          . 'var src = li.querySelector(".meowapps-menu-icon"); var slot = li.querySelector(".wp-menu-image");'
          . 'if ( !src || !slot || slot.querySelector(".meowapps-menu-icon-folded") ) { return; }'
          . 'var clone = src.cloneNode(); clone.className = "meowapps-menu-icon-folded"; clone.removeAttribute("style"); slot.appendChild(clone);'
          . '});';
        wp_add_inline_script( 'common', $js );
      } );
    }

    /**
     * An older copy of this library (in another plugin, loaded first) already built the menu: it never
     * defers to newer copies, so swap its page callback and title for ours.
     */
    private function take_over_menu( $title ) {
      global $menu, $wp_filter;
      $hook = 'toplevel_page_meowapps-main-menu';
      if ( isset( $wp_filter[ $hook ] ) ) {
        foreach ( $wp_filter[ $hook ]->callbacks as $priority => $callbacks ) {
          foreach ( $callbacks as $callback ) {
            $function = $callback['function'];
            if ( is_array( $function ) && is_object( $function[0] ) && $function[1] === 'admin_meow_apps' ) {
              remove_action( $hook, $function, $priority );
            }
          }
        }
      }
      add_action( $hook, [ $this, 'admin_meow_apps' ] );
      foreach ( (array) $menu as $index => $item ) {
        if ( isset( $item[2] ) && $item[2] === 'meowapps-main-menu' ) {
          $menu[ $index ][0] = $title;
        }
      }
    }

    public function meowapps_hide_dashboard_callback() {
      $html = '<input type="checkbox" id="meowapps_hide_meowapps" name="meowapps_hide_meowapps" value="1" ' .
      checked( 1, get_option( 'meowapps_hide_meowapps' ), false ) . '/>';
      $html .= __( '<label>Hide <b>Meow Apps</b> Menu</label><br /><small>Hide Meow Apps menu and all its components, for a cleaner admin. This option will be reset if a new Meow Apps plugin is installed.<br /><b>Once activated, an option will be added in your General settings to display it again.</b></small>', $this->domain );
      echo MeowKit_MWAI_Helpers::wp_kses( $html );
    }

    public function is_registered() {
      $is_registered = apply_filters( $this->prefix . '_meowapps_is_registered', false, $this->prefix );
      return $is_registered;
    }

    public function get_phpinfo() {
      if ( !$this->is_user_admin() || !function_exists( 'phpinfo' ) ) {
        return;
      }
      ob_start();
      // phpcs:disable WordPress.PHP.DevelopmentFunctions
      phpinfo( INFO_GENERAL | INFO_CONFIGURATION | INFO_MODULES );
      // phpcs:enable
      $html = ob_get_contents();
      ob_end_clean();
      $html = preg_replace( '%^.*<body>(.*)</body>.*$%ms', '$1', $html );
      return $html;
    }

    /**
    * This plugin's row for the dashboard: version, license, whether it is behind, and what the plugin
    * itself reports through '<prefix>_meowapps_status' ([ 'metric' => [ 'value', 'label' ],
    * 'todos' => [ [ 'text', 'severity' => 'error'|'warning'|'info', 'action' => [ 'label', 'url' ] ] ],
    * optional 'state' => 'good'|'warning'|'bad' and 'note' => one short line ).
    * Reads only cached data: nothing here may scan or call out, the dashboard has to open instantly.
    */
    public function status_row( $rows ) {
      $basename = plugin_basename( $this->mainfile );
      $slug = preg_replace( '/-pro$/', '', dirname( $basename ) );
      // Free and Pro of the same plugin side by side (common on dev sites): Pro wins.
      if ( isset( $rows[ $slug ] ) && !empty( $rows[ $slug ]['pro'] ) && !$this->isPro ) {
        return $rows;
      }
      $data = get_file_data( $this->mainfile, [ 'name' => 'Plugin Name', 'version' => 'Version' ] );
      $row = [
        'slug' => $slug,
        'name' => $data['name'],
        'version' => $data['version'],
        'pro' => (bool) $this->isPro,
        'license' => null,
        'latest' => null,
        'behind' => false,
        'action' => null,
        'metric' => null,
        'state' => null,
        'note' => null,
        'todos' => [],
      ];
      if ( $this->isPro ) {
        $license = get_option( $this->prefix . '_license', '' );
        if ( apply_filters( $this->prefix . '_meowapps_is_registered', false ) ) {
          $row['license'] = 'active';
        }
        else {
          $row['license'] = is_array( $license ) && !empty( $license['key'] ) ? 'inactive' : 'none';
          // Same links as the renewal line on the Plugins page: a known key goes straight to the renewal
          // checkout (EDD puts the right tier in the cart), otherwise to the product page.
          $folder = dirname( $basename );
          $utm = [ 'utm_source' => $folder, 'utm_medium' => 'dashboard-license' ];
          $item_key = strtoupper( $this->prefix ) . '_ITEM_ID';
          if ( $row['license'] === 'inactive' && defined( $item_key ) ) {
            $row['license_action'] = [ 'label' => __( 'Renew', $this->domain ), 'external' => true,
              'url' => add_query_arg( array_merge( [ 'edd_license_key' => $license['key'], 'download_id' => constant( $item_key ) ], $utm ),
                'https://meowapps.com/checkout/' ) ];
          }
          else {
            $row['license_action'] = [ 'label' => __( 'Get a license', $this->domain ), 'external' => true,
              'url' => add_query_arg( $utm, 'https://meowapps.com/' . $slug . '/' ) ];
          }
        }
      }
      $info = apply_filters( $this->prefix . '_meowapps_version_info', null );
      if ( is_array( $info ) && !empty( $info['latest'] ) ) {
        $row['latest'] = $info['latest'];
        $row['behind'] = !empty( $info['behind'] );
        $row['action'] = isset( $info['action'] ) ? $info['action'] : null;
      }
      else {
        // Free plugins: wordpress.org updates already land in WordPress's own update entry.
        $updates = get_site_transient( 'update_plugins' );
        $update = is_object( $updates ) && isset( $updates->response[ $basename ] ) ? $updates->response[ $basename ] : null;
        if ( is_object( $update ) && !empty( $update->new_version ) && version_compare( $row['version'], $update->new_version, '<' ) ) {
          $row['latest'] = (string) $update->new_version;
          $row['behind'] = true;
          $row['action'] = [ 'label' => __( 'Update', $this->domain ), 'url' => admin_url( 'plugins.php' ), 'external' => false ];
        }
      }
      $extra = apply_filters( $this->prefix . '_meowapps_status', null );
      if ( is_array( $extra ) ) {
        if ( !empty( $extra['metric']['value'] ) ) {
          $row['metric'] = [ 'value' => (string) $extra['metric']['value'],
            'label' => isset( $extra['metric']['label'] ) ? (string) $extra['metric']['label'] : '' ];
        }
        // Optional: the card's color when the plugin knows better than its to-dos (good|warning|bad),
        // and one short line for when there is nothing to do (Pro can say more than Free).
        if ( isset( $extra['state'] ) && in_array( $extra['state'], [ 'good', 'warning', 'bad' ], true ) ) {
          $row['state'] = $extra['state'];
        }
        if ( !empty( $extra['note'] ) ) {
          $row['note'] = (string) $extra['note'];
        }
        if ( !empty( $extra['todos'] ) && is_array( $extra['todos'] ) ) {
          foreach ( array_slice( $extra['todos'], 0, 3 ) as $todo ) {
            if ( empty( $todo['text'] ) ) {
              continue;
            }
            $row['todos'][] = [
              'text' => (string) $todo['text'],
              'severity' => isset( $todo['severity'] ) && in_array( $todo['severity'], [ 'error', 'warning' ], true ) ? $todo['severity'] : 'info',
              'action' => isset( $todo['action']['url'] ) ? [ 'label' => (string) $todo['action']['label'], 'url' => (string) $todo['action']['url'] ] : null,
            ];
          }
        }
      }
      $rows[ $slug ] = $row;
      return $rows;
    }

    public function print_site_facts() {
      $page = isset( $_GET['page'] ) ? sanitize_text_field( wp_unslash( $_GET['page'] ) ) : '';
      if ( $page !== 'meowapps-main-menu' || !self::is_newest_copy() || !empty( $GLOBALS['meowapps_site_facts_printed'] ) ) {
        return;
      }
      $GLOBALS['meowapps_site_facts_printed'] = true;
      echo '<script type="application/json" id="meow-common-site">' . wp_json_encode( $this->site_facts(), JSON_HEX_TAG | JSON_HEX_AMP ) . '</script>';
      // The plugin rows too: the page itself is rendered by whichever copy registered the menu, often an
      // older one during a rollout, so it cannot be trusted to print them.
      $rows = apply_filters( 'meowapps_plugins_status', [] );
      echo '<script type="application/json" id="meow-common-status">' . wp_json_encode( array_values( $rows ), JSON_HEX_TAG | JSON_HEX_AMP ) . '</script>';
    }

    public function site_facts() {
      global $wpdb, $wp_version;
      if ( !function_exists( 'get_plugins' ) ) {
        require_once ABSPATH . 'wp-admin/includes/plugin.php';
      }
      $all = get_plugins();
      $active = [];
      foreach ( (array) get_option( 'active_plugins', [] ) as $file ) {
        if ( isset( $all[ $file ] ) ) {
          $active[] = $all[ $file ]['Name'] . ' ' . $all[ $file ]['Version'];
        }
      }
      $theme = wp_get_theme();
      return [
        'url' => home_url(),
        'wordpress' => $wp_version,
        'php' => PHP_VERSION,
        'database' => method_exists( $wpdb, 'db_server_info' ) ? (string) $wpdb->db_server_info() : '',
        'server' => isset( $_SERVER['SERVER_SOFTWARE'] ) ? sanitize_text_field( wp_unslash( $_SERVER['SERVER_SOFTWARE'] ) ) : '',
        'memory_limit' => (string) ini_get( 'memory_limit' ),
        'wp_memory_limit' => defined( 'WP_MEMORY_LIMIT' ) ? WP_MEMORY_LIMIT : '',
        'max_execution_time' => (string) ini_get( 'max_execution_time' ),
        'upload_max_filesize' => (string) ini_get( 'upload_max_filesize' ),
        'post_max_size' => (string) ini_get( 'post_max_size' ),
        'max_input_vars' => (string) ini_get( 'max_input_vars' ),
        'https' => is_ssl(),
        'multisite' => is_multisite(),
        'debug' => defined( 'WP_DEBUG' ) && WP_DEBUG,
        'debug_display' => defined( 'WP_DEBUG' ) && WP_DEBUG && ( !defined( 'WP_DEBUG_DISPLAY' ) || WP_DEBUG_DISPLAY ),
        'object_cache' => (bool) wp_using_ext_object_cache(),
        'cron_disabled' => defined( 'DISABLE_WP_CRON' ) && DISABLE_WP_CRON,
        // Minutes the oldest scheduled task is overdue: a few is normal, hours means cron isn't running.
        'cron_overdue' => $this->cron_overdue_minutes(),
        'theme' => $theme->get( 'Name' ) . ' ' . $theme->get( 'Version' ),
        'locale' => get_locale(),
        'timezone' => wp_timezone_string(),
        'plugins' => $active,
      ];
    }

    private function cron_overdue_minutes() {
      $crons = function_exists( '_get_cron_array' ) ? _get_cron_array() : [];
      if ( !is_array( $crons ) || empty( $crons ) ) {
        return 0;
      }
      return max( 0, (int) floor( ( time() - min( array_keys( $crons ) ) ) / 60 ) );
    }

    public function admin_meow_apps() {
      $html = "<div id='meow-common-dashboard'></div>";
      $html .= "<div style='height: 0; width: 0; overflow: hidden;' id='meow-common-phpinfo'>";
      $html .= $this->get_phpinfo();
      $html .= '</div>';
      $html = preg_replace( "/<img[^>]+\>/i", '', $html );
      echo wp_kses_post( $html );
    }

    public function admin_footer_text( $current ) {
      if ( !self::is_newest_copy() ) {
        return $current;
      }
      return sprintf(
        // translators: %1$s is the version of the interface; %2$s is a file path.
        __( 'Thanks for using <a href="https://meowapps.com">Meow Apps</a>! This is the Meow Admin %1$s <br /><i>Loaded from %2$s </i>', $this->domain ),
        MeowKit_MWAI_Admin::$version,
        __FILE__
      );
    }

    /**
     * Renders a promo banner on WordPress 7's Connectors page when AI Engine
     * isn't installed. Kept self-contained so the common library stays simple:
     * no new file, no REST endpoint, dismissal persists in localStorage.
     */
    public function maybe_render_wpai_promo() {
      // WordPress 7+ only.
      if ( ! class_exists( 'WP_Connector_Registry' ) ) {
        return;
      }
      // If AI Engine is installed, its own Connectors banner takes over.
      if ( class_exists( 'Meow_MWAI_Core' ) ) {
        return;
      }
      // Another Meow Apps plugin's common copy may have rendered already.
      if ( defined( 'MEOWAPPS_WPAI_PROMO_RENDERED' ) ) {
        return;
      }
      // Gate on the Connectors screen. The hook suffix differs between the
      // direct file (`options-connectors.php`) and the menu-page variant.
      $screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
      $id = $screen ? $screen->id : ( isset( $GLOBALS['hook_suffix'] ) ? $GLOBALS['hook_suffix'] : '' );
      $targets = array( 'options-connectors', 'options-connectors.php', 'settings_page_options-connectors-wp-admin' );
      if ( ! in_array( $id, $targets, true ) ) {
        return;
      }
      define( 'MEOWAPPS_WPAI_PROMO_RENDERED', true );

      // Install button → WordPress's own plugin-install search page, pre-
      // filtered for AI Engine. One click from there to install. This is the
      // most reliable path: no custom nonces, native progress UI, native
      // filesystem credential prompt if needed.
      $can_install = current_user_can( 'install_plugins' );
      $install_url = $can_install
        ? self_admin_url( 'plugin-install.php?tab=search&type=term&s=AI+Engine' )
        : 'https://wordpress.org/plugins/ai-engine/';
      $wporg_url   = 'https://wordpress.org/plugins/ai-engine/';
      $learn_url   = 'https://meowapps.com/wordpress-7-ai-engine-gateway/';

      // Title is split so "AI Engine" can carry an anchor to wp.org. Keeping
      // the pieces as data (not one HTML string) avoids escaping surprises and
      // keeps the translation unit stable.
      $payload = array(
        'titleBefore' => __( 'Highly recommended: Let ', 'meowapps' ),
        'titleLink'   => __( 'AI Engine', 'meowapps' ),
        'titleAfter'  => __( ' handle your connections.', 'meowapps' ),
        'sub'         => __( 'One plugin for every provider. Keep your AI setup clean and consistent: monitor your API costs in one place, log every single request, and avoid the mess of juggling separate plugins for each AI model.', 'meowapps' ),
        'install'     => __( 'Install AI Engine', 'meowapps' ),
        'learn'       => __( 'Learn more', 'meowapps' ),
        'dismiss'     => __( 'Dismiss', 'meowapps' ),
        'installUrl'  => $install_url,
        'wporgUrl'    => $wporg_url,
        'learnUrl'    => $learn_url,
      );
      wp_register_style( 'meowapps-common-inline', false );
      wp_enqueue_style( 'meowapps-common-inline' );
      ob_start();
      ?>
        .meowapps-wpai-promo {
          margin: 0 0 16px; padding: 14px 18px;
          display: flex; align-items: flex-start; gap: 14px;
          background: #f0f4ff; border: 1px solid #d6deff; border-radius: 4px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 13px; line-height: 1.45; color: #1e1e1e;
        }
        .meowapps-wpai-promo-icon {
          width: 32px; height: 32px; border-radius: 50%;
          background: #2f5fff; color: #fff;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .meowapps-wpai-promo-icon svg { width: 18px; height: 18px; display: block; }
        .meowapps-wpai-promo-body {
          flex: 1; min-width: 0;
          display: flex; flex-direction: column; gap: 10px;
        }
        .meowapps-wpai-promo-text strong { font-weight: 700; display: block; margin-bottom: 3px; }
        .meowapps-wpai-promo-text span { color: #50575e; }
        .meowapps-wpai-promo-titlelink {
          color: #2f5fff; text-decoration: none; border-bottom: 1px dashed #2f5fff;
        }
        .meowapps-wpai-promo-titlelink:hover { color: #2448cc; border-bottom-color: #2448cc; }
        .meowapps-wpai-promo-actions {
          display: flex; gap: 8px; flex-wrap: wrap; align-items: center;
        }
        .meowapps-wpai-promo-btn {
          appearance: none; border: 1px solid transparent; border-radius: 4px;
          padding: 7px 16px; font: inherit; font-size: 12.5px; font-weight: 600;
          cursor: pointer; text-decoration: none;
          transition: background 0.12s ease, border-color 0.12s ease;
        }
        .meowapps-wpai-promo-btn-primary { background: #2f5fff; color: #fff; }
        .meowapps-wpai-promo-btn-primary:hover { background: #2448cc; color: #fff; }
        .meowapps-wpai-promo-btn-secondary { background: #7c3aed; color: #fff; }
        .meowapps-wpai-promo-btn-secondary:hover { background: #6527c9; color: #fff; }
        .meowapps-wpai-promo-btn-dismiss {
          margin-left: auto;
          background: transparent; color: #6b7280;
          font-weight: 500; padding: 7px 10px;
        }
        .meowapps-wpai-promo-btn-dismiss:hover { color: #1e1e1e; background: rgba(0,0,0,0.04); }
      <?php
      wp_add_inline_style( 'meowapps-common-inline', ob_get_clean() );

      wp_register_script( 'meowapps-common-inline', false, array(), false, true );
      wp_enqueue_script( 'meowapps-common-inline' );
      ob_start();
      ?>
      (function () {
        var D = <?php echo wp_json_encode( $payload ); ?>;
        try { if (localStorage.getItem('meowapps-wpai-promo-dismissed') === '1') return; } catch (e) {}

        function build() {
          var host = document.createElement('div');
          host.className = 'meowapps-wpai-promo';
          host.setAttribute('role', 'status');
          var iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
          host.innerHTML = [
            '<span class="meowapps-wpai-promo-icon">', iconSvg, '</span>',
            '<div class="meowapps-wpai-promo-body">',
              '<div class="meowapps-wpai-promo-text">',
                '<strong></strong> <span class="meowapps-wpai-promo-sub"></span>',
              '</div>',
              '<div class="meowapps-wpai-promo-actions"></div>',
            '</div>'
          ].join('');
          // Title carries an anchor on "AI Engine" → wp.org plugin page.
          var strong = host.querySelector('strong');
          strong.appendChild(document.createTextNode(D.titleBefore));
          var tLink = document.createElement('a');
          tLink.href = D.wporgUrl;
          tLink.target = '_blank';
          tLink.rel = 'noopener noreferrer';
          tLink.className = 'meowapps-wpai-promo-titlelink';
          tLink.textContent = D.titleLink;
          strong.appendChild(tLink);
          strong.appendChild(document.createTextNode(D.titleAfter));
          host.querySelector('.meowapps-wpai-promo-sub').textContent = D.sub;
          var actions = host.querySelector('.meowapps-wpai-promo-actions');

          function link(label, cls, href, newTab) {
            var a = document.createElement('a');
            a.className = 'meowapps-wpai-promo-btn ' + cls;
            a.textContent = label;
            a.href = href;
            if (newTab) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
            actions.appendChild(a);
            return a;
          }

          // Install → WordPress's plugin-install search page, pre-filtered.
          // User lands on a familiar screen with AI Engine as the top hit and
          // can install with the native WordPress UX.
          link(D.install, 'meowapps-wpai-promo-btn-primary',   D.installUrl, false);
          link(D.learn,   'meowapps-wpai-promo-btn-secondary', D.learnUrl,   true);

          var d = document.createElement('button');
          d.type = 'button';
          d.className = 'meowapps-wpai-promo-btn meowapps-wpai-promo-btn-dismiss';
          d.textContent = D.dismiss;
          d.addEventListener('click', function () {
            try { localStorage.setItem('meowapps-wpai-promo-dismissed', '1'); } catch (e) {}
            if (host.parentNode) host.parentNode.removeChild(host);
          });
          actions.appendChild(d);
          return host;
        }

        function ensure() {
          if (document.querySelector('.meowapps-wpai-promo')) return;
          var page = document.querySelector('.connectors-page');
          if (page) { page.insertBefore(build(), page.firstChild); return; }
          var header = document.querySelector('.boot-layout__stage header');
          if (header && header.parentNode) {
            header.parentNode.insertBefore(build(), header.nextSibling);
          }
        }

        var tries = 0;
        var iv = setInterval(function () {
          ensure();
          if (document.querySelector('.meowapps-wpai-promo') || ++tries > 40) clearInterval(iv);
        }, 120);

        var app = document.getElementById('options-connectors-wp-admin-app')
               || document.getElementById('options-connectors-app');
        if (app && 'MutationObserver' in window) {
          new MutationObserver(ensure).observe(app, { childList: true, subtree: true });
        }
      })();
      <?php
      wp_add_inline_script( 'meowapps-common-inline', ob_get_clean() );
    }
  }
}
