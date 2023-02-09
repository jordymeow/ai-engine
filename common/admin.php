<?php

if ( !class_exists( 'MeowCommon_Admin' ) ) {

	class MeowCommon_Admin {

		public static $loaded = false;
		public static $version = "4.0";
		public static $admin_version = "4.0";

		public $prefix; 		// prefix used for actions, filters (mfrh)
		public $mainfile; 	// plugin main file (media-file-renamer.php)
		public $domain; 		// domain used for translation (media-file-renamer)
		public $isPro = false;

		public static $logo = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxIiB2aWV3Qm94PSIwIDAgMTY1IDE2NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8c3R5bGU+CiAgICAuc3Qye2ZpbGw6IzgwNDYyNX0uc3Qze2ZpbGw6I2ZkYTk2MH0KICA8L3N0eWxlPgogIDxwYXRoIGQ9Ik03MiA3YTc2IDc2IDAgMCAxIDg0IDkxQTc1IDc1IDAgMSAxIDcyIDd6IiBmaWxsPSIjNGE2YjhjIi8+CiAgPHBhdGggZD0iTTQ4IDQ4YzIgNSAyIDEwIDUgMTQgNSA4IDEzIDE3IDIyIDIwbDEtMTBjMS0yIDMtMyA1LTNoMTNjMiAwIDQgMSA1IDNsMyA5IDQtMTBjMi0zIDYtMiA5LTJoMTFjMyAyIDMgNSAzIDhsMiAzN2MwIDMtMSA3LTQgOGgtMTJjLTIgMC0zLTItNS00LTEgMS0yIDMtNCAzLTUgMS05IDEtMTMtMS0zIDItNSAyLTkgMnMtOSAxLTEwLTNjLTItNC0xLTggMC0xMi04LTMtMTUtNy0yMi0xMi03LTctMTUtMTQtMjAtMjMtMy00LTUtOC01LTEzIDEtNCAzLTEwIDYtMTMgNC0zIDEyLTIgMTUgMnoiIGZpbGw9IiMxMDEwMTAiLz4KICA8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNDMgNTFsNCAxMS02IDVoLTZjLTMtNS0zLTExIDAtMTYgMi0yIDYtMyA4IDB6Ii8+CiAgPHBhdGggY2xhc3M9InN0MyIgZD0iTTQ3IDYybDMgNmMwIDMgMCA0LTIgNnMtNCAyLTcgMmwtNi05aDZsNi01eiIvPgogIDxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik01MCA2OGw4IDljLTMgMy01IDYtOSA4bC04LTljMyAwIDUgMCA3LTJzMy0zIDItNnoiLz4KICA8cGF0aCBkPSJNODIgNzRoMTJsNSAxOCAzIDExIDgtMjloMTNsMiA0MmgtOGwtMS0yLTEtMzEtMTAgMzItNyAxLTktMzMtMSAyOS0xIDRoLThsMy00MnoiIGZpbGw9IiNmZmYiLz4KICA8cGF0aCBjbGFzcz0ic3QzIiBkPSJNNTggNzdsNSA1Yy0xIDQtMiA4LTcgOGwtNy01YzQtMiA2LTUgOS04eiIvPgogIDxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik02MyA4Mmw5IDUtNiA5LTEwLTZjNSAwIDYtNCA3LTh6Ii8+CiAgPHBhdGggY2xhc3M9InN0MyIgZD0iTTcyIDg3bDMgMS0xIDExLTgtMyA2LTEweiIvPgo8L3N2Zz4K';

		public function __construct( $prefix, $mainfile, $domain, $isPro = false, $disableReview = false, $freeOnly = false ) {

			if ( !MeowCommon_Admin::$loaded ) {
				if ( is_admin() ) {

					if ( MeowCommon_Helpers::is_asynchronous_request() ) {
						return;
					}

					// Check potential issues with this WordPress install, other plugins, etc.
					new MeowCommon_Issues( $prefix, $mainfile, $domain );

					// Create the Meow Apps Menu
					add_action( 'admin_menu', array( $this, 'admin_menu_start' ) );
					$page = isset( $_GET["page"] ) ? sanitize_text_field( $_GET["page"] ) : null;
					if ( $page === 'meowapps-main-menu' ) {
						add_filter( 'admin_footer_text',  array( $this, 'admin_footer_text' ), 100000, 1 );
					}
				}
				MeowCommon_Admin::$loaded = true;
			}

			// Variables for this plugin
			$this->prefix = $prefix;
			$this->mainfile = $mainfile;
			$this->domain = $domain;
			$this->isPro = $isPro;

			// If there is no mainfile, it's either a Pro only Plugin (with no Free version available) or a Theme.
      if ( is_admin() ) {
				$license = get_option( $this->prefix . '_license', "" );
        if ( !empty( $license ) && !$this->isPro ) {
          add_action( 'admin_notices', array( $this, 'admin_notices_licensed_free' ) );
        }
        if ( !$disableReview ) {
          new MeowCommon_Ratings( $prefix, $mainfile, $domain );
        }
				new MeowCommon_News( $domain );
			}
			add_filter( 'plugin_row_meta', array( $this, 'custom_plugin_row_meta' ), 10, 2 );
			add_filter( 'edd_sl_api_request_verify_ssl', array( $this, 'request_verify_ssl' ), 10, 0 );
		}

		function custom_plugin_row_meta( $links, $file ) {
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
				$new_links = array(
					'settings' => 
						sprintf( __( '<a href="admin.php?page=%s_settings">Settings</a>', $this->domain ), $this->prefix ),
					'license' => 
						$this->is_registered() ? 
							('<span style="color: #a75bd6;">' . __( 'Pro Version', $this->domain ) . '</span>') : 
								( $isIssue ? (sprintf( '<span style="color: #ff3434;">' . __( 'License Issue', $this->domain ), $this->prefix ) . '</span>') : (sprintf( '<span>' . __( '<a target="_blank" href="https://meowapps.com">Get the <u>Pro Version</u></a>', $this->domain ), $this->prefix ) . '</span>') ),
				);
				$links = array_merge( $new_links, $links );
			}
			return $links;
		}

		function request_verify_ssl() {
			return get_option( 'force_sslverify', false );
		}

		function nice_name_from_file( $file ) {
			$info = pathinfo( $file );
			if ( !empty( $info ) ) {
				if ( $info['filename'] == 'wplr-sync' ) {
					return "WP/LR Sync";
				}
				$info['filename'] = str_replace( '-', ' ', $info['filename'] );
				$file = ucwords( $info['filename'] );
			}
			return $file;
		}

		function admin_notices_licensed_free() {
			if ( isset( $_POST[$this->prefix . '_reset_sub'] ) ) {
				delete_option( $this->prefix . '_pro_serial' );
				delete_option( $this->prefix . '_license' );
				return;
			}
			$html = '<div class="notice notice-error">';
			$html .= sprintf(
				__( '<p>It looks like you are using the free version of the plugin (<b>%s</b>) but a license for the Pro version was also found. The Pro version might have been replaced by the Free version during an update (might be caused by a temporarily issue). If it is the case, <b>please download it again</b> from the <a target="_blank" href="https://meowapps.com">Meow Store</a>. If you wish to continue using the free version and clear this message, click on this button.', $this->domain ),
				$this->nice_name_from_file( $this->mainfile ) );
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

		function admin_menu_start() {
			// Hide the admin if user doesn't like Meow much
			if ( get_option( 'meowapps_hide_meowapps', false ) ) {
				register_setting( 'general', 'meowapps_hide_meowapps' );
				add_settings_field( 'meowapps_hide_ads', 'Meow Apps Menu', array( $this, 'meowapps_hide_dashboard_callback' ), 'general' );
				return;
			}

			// Create standard menu if it does not already exist
			global $submenu;
			if ( !isset( $submenu[ 'meowapps-main-menu' ] ) ) {
				add_menu_page( 'Meow Apps', '<img alt="Meow Apps" style="width: 24px; margin-left: -30px; position: absolute; margin-top: -3px;" src="' . MeowCommon_Admin::$logo . '" />Meow Apps', 'manage_options', 'meowapps-main-menu',
					array( $this, 'admin_meow_apps' ), '', 82 );
				add_submenu_page( 'meowapps-main-menu', __( 'Dashboard', $this->domain ),
					__( 'Dashboard', $this->domain ), 'manage_options',
					'meowapps-main-menu', array( $this, 'admin_meow_apps' ) );
			}
		}

		function meowapps_hide_dashboard_callback() {
			$html = '<input type="checkbox" id="meowapps_hide_meowapps" name="meowapps_hide_meowapps" value="1" ' .
				checked( 1, get_option( 'meowapps_hide_meowapps' ), false ) . '/>';
			$html .= __( '<label>Hide <b>Meow Apps</b> Menu</label><br /><small>Hide Meow Apps menu and all its components, for a cleaner admin. This option will be reset if a new Meow Apps plugin is installed.<br /><b>Once activated, an option will be added in your General settings to display it again.</b></small>', $this->domain );
			echo MeowCommon_Helpers::wp_kses( $html );
		}

		function is_registered() {
			$is_registered = apply_filters( $this->prefix . '_meowapps_is_registered', false, $this->prefix );
			return $is_registered;
		}

		function get_phpinfo() {
			if ( !current_user_can( 'administrator' ) || !function_exists( 'phpinfo' ) ) {
				return;
			}
			ob_start();
			// phpcs:disable WordPress.PHP.DevelopmentFunctions
			phpinfo( INFO_GENERAL | INFO_CONFIGURATION | INFO_MODULES );
			// phpcs:enable
			$html = ob_get_contents();
			ob_end_clean();
			$html = preg_replace( '%^.*<body>(.*)</body>.*$%ms','$1', $html );
			return $html;
		}
		
		function admin_meow_apps() {
			$html = "<div id='meow-common-dashboard'></div>";
			$html .= "<div style='height: 0; width: 0; overflow: hidden;' id='meow-common-phpinfo'>";
			$html .=  $this->get_phpinfo();
			$html .=  "</div>";
			$html = preg_replace("/<img[^>]+\>/i", "", $html); 
			echo wp_kses_post( $html );
		}

		function admin_footer_text( $current ) {
			return sprintf(
				// translators: %1$s is the version of the interface; %2$s is a file path.
				__( 'Thanks for using <a href="https://meowapps.com">Meow Apps</a>! This is the Meow Admin %1$s <br /><i>Loaded from %2$s </i>', $this->domain ),
				MeowCommon_Admin::$version,
				__FILE__
			);
		}
	}
}
