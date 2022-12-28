<?php
class Meow_MWAI_Admin extends MeowCommon_Admin {

	public $core;

	public function __construct( $core ) {
		$this->core = $core;

		parent::__construct( MWAI_PREFIX, MWAI_ENTRY, MWAI_DOMAIN, class_exists( 'MeowPro_MWAI_Core' ) );
		if ( is_admin() ) {
			add_action( 'admin_menu', array( $this, 'app_menu' ) );

			// Load the scripts only if they are needed by the current screen
			$page = isset( $_GET["page"] ) ? sanitize_text_field( $_GET["page"] ) : null;

			// We can check if the screen is used by AI Engine
			$is_mwai_screen = in_array( $page, [ 'mwai_settings', 'mwai_dashboard' ] );
			$is_meowapps_dashboard = $page === 'meowapps-main-menu';
			add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );
		}
	}

	function admin_enqueue_scripts() {

		// Load the scripts
		$physical_file = MWAI_PATH . '/app/index.js';
		$cache_buster = file_exists( $physical_file ) ? filemtime( $physical_file ) : MWAI_VERSION;
		wp_register_script( 'mwai_meow_plugin-vendor', MWAI_URL . 'app/vendor.js',
			['wp-element', 'wp-i18n'], $cache_buster
		);
		wp_register_script( 'mwai_meow_plugin', MWAI_URL . 'app/index.js',
			['mwai_meow_plugin-vendor', 'wp-blocks', 'wp-components', 'wp-data', 'wp-edit-post',
				'wp-element', 'wp-i18n', 'wp-plugins'], $cache_buster
		);
		wp_set_script_translations( 'mwai_meow_plugin', 'ai-engine' );
		wp_enqueue_script('mwai_meow_plugin' );

		// Load the fonts
		// wp_register_style( 'meow-neko-ui-lato-font',
		// 	'//fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&display=swap');
		// wp_enqueue_style( 'meow-neko-ui-lato-font' );

		// Localize and options
		wp_localize_script( 'mwai_meow_plugin', 'mwai_meow_plugin', [
			'api_url' => rest_url( 'ai-engine/v1' ),
			'rest_url' => rest_url(),
			'plugin_url' => MWAI_URL,
			'prefix' => MWAI_PREFIX,
			'domain' => MWAI_DOMAIN,
			'is_pro' => class_exists( 'MeowPro_MWAI_Core' ),
			'is_registered' => !!$this->is_registered(),
			'rest_nonce' => wp_create_nonce( 'wp_rest' ),
			'options' => $this->core->get_all_options(),
		] );
	}

	function is_registered() {
		return apply_filters( MWAI_PREFIX . '_meowapps_is_registered', false, MWAI_PREFIX );
	}

	function app_menu() {
		add_submenu_page( 'meowapps-main-menu', 'AI Engine', 'AI Engine', 'manage_options',
			'mwai_settings', array( $this, 'admin_settings' ) );
	}

	function admin_settings() {
		echo '<div id="mwai-admin-settings"></div>';
	}
}

?>