<?php

if ( !class_exists( 'MeowKit_MWAI_Admin' ) ) {

  class MeowKit_MWAI_Admin {
    public static $loaded = false;
    public static $version = '4.0';
    public static $admin_version = '4.0';
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

        // Customize admin footer on Meow Apps pages
        $page = isset( $_GET['page'] ) ? sanitize_text_field( $_GET['page'] ) : null;
        if ( $page === 'meowapps-main-menu' ) {
          add_filter( 'admin_footer_text', [ $this, 'admin_footer_text' ], 100000, 1 );
        }

        MeowKit_MWAI_Admin::$loaded = true;
      }

      // PER-INSTANCE SETUP: Run for each plugin that uses this library
      // Only admins get ratings prompts and news
      if ( $this->is_user_admin() ) {
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
              'license' => sprintf( '<span>' . __( '<a target="_blank" href="https://meowapps.com">Get the <u>Pro Version</u></a>', $this->domain ), $this->prefix ) . '</span>',
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
                  ( $isIssue ? ( sprintf( '<span style="color: #ff3434;">' . __( 'License Issue', $this->domain ), $this->prefix ) . '</span>' ) : ( sprintf( '<span>' . __( '<a target="_blank" href="https://meowapps.com">Get the <u>Pro Version</u></a>', $this->domain ), $this->prefix ) . '</span>' ) ),
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
      <script>
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
      </script>
      <?php
    }

    public function request_verify_ssl() {
      return get_option( 'force_sslverify', false );
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
      if ( isset( $_POST[$this->prefix . '_reset_sub'] ) ) {
        delete_option( $this->prefix . '_pro_serial' );
        delete_option( $this->prefix . '_license' );
        return;
      }
      $html = '<div class="notice notice-error">';
      $html .= sprintf(
        __( '<p>It looks like you are using the free version of the plugin (<b>%s</b>) but a license for the Pro version was also found. The Pro version might have been replaced by the Free version during an update (might be caused by a temporarily issue). If it is the case, <b>please download it again</b> from the <a target="_blank" href="https://meowapps.com">Meow Store</a>. If you wish to continue using the free version and clear this message, click on this button.', $this->domain ),
        $this->nice_name_from_file( $this->mainfile )
      );
      $html .= '<p>
                                                                                                                                                  <form method="post" action="">
                                                                                                                                                  <input type="hidden" name="' . $this->prefix . '_reset_sub" value="true">
                                                                                                                                                  <input type="submit" name="submit" id="submit" class="button" value="'
      . __( 'Remove the license', $this->domain ) . '">
                                                                                                                                                    </form>
                                                                                                                                                    </p>';
      $html .= '</div>';
      wp_kses_post( $html );
    }

    public function admin_menu_start() {
      // Hide the admin if user doesn't like Meow much
      if ( get_option( 'meowapps_hide_meowapps', false ) ) {
        register_setting( 'general', 'meowapps_hide_meowapps' );
        add_settings_field( 'meowapps_hide_ads', 'Meow Apps Menu', [ $this, 'meowapps_hide_dashboard_callback' ], 'general' );
        return;
      }

      // Create standard menu if it does not already exist
      global $submenu;
      if ( !isset( $submenu[ 'meowapps-main-menu' ] ) ) {
        add_menu_page(
          'Meow Apps',
          '<img alt="Meow Apps" style="width: 21px; margin-left: -28px; position: absolute; margin-top: 2px;" src="' . MeowKit_MWAI_Admin::$logo . '" />Meow Apps',
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

      // Add CSS to hide the default icon
      add_action( 'admin_head', function () {
        echo '<style>
                                                                                                                                                                                    #toplevel_page_meowapps-main-menu .wp-menu-image {
                                                                                                                                                                                    display: none;
                                                                                                                                                                                  }
                                                                                                                                                                                </style>';
      } );
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

    public function admin_meow_apps() {
      $html = "<div id='meow-common-dashboard'></div>";
      $html .= "<div style='height: 0; width: 0; overflow: hidden;' id='meow-common-phpinfo'>";
      $html .= $this->get_phpinfo();
      $html .= '</div>';
      $html = preg_replace( "/<img[^>]+\>/i", '', $html );
      echo wp_kses_post( $html );
    }

    public function admin_footer_text( $current ) {
      return sprintf(
        // translators: %1$s is the version of the interface; %2$s is a file path.
        __( 'Thanks for using <a href="https://meowapps.com">Meow Apps</a>! This is the Meow Admin %1$s <br /><i>Loaded from %2$s </i>', $this->domain ),
        MeowKit_MWAI_Admin::$version,
        __FILE__
      );
    }
  }
}
