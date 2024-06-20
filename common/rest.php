<?php

class MeowCommon_Rest
{
	private $namespace = "meow-common/v1";
	static public $instance = null;

	static public function init_once() {
		if ( !MeowCommon_Rest::$instance ) {
			MeowCommon_Rest::$instance = new self();
		}
	}

	private function __construct() {
		add_action( 'rest_api_init', array( $this, 'rest_api_init' ) );
	}

	function rest_api_init() {
		if ( !current_user_can( 'manage_options' ) ) {
			return;
		}
		register_rest_route( $this->namespace, '/empty_request/', [
			'methods' => 'POST',
			'permission_callback' => function () { 
				return current_user_can( 'manage_options' );
			},
			'callback' => [ $this, 'empty_request' ]
		]);
		register_rest_route( $this->namespace, '/file_operation/', [
			'methods' => 'POST',
			'permission_callback' => function () { 
				return current_user_can( 'manage_options' );
			},
			'callback' => [ $this, 'file_operation' ]
		]);
		register_rest_route( $this->namespace, '/sql_request/', [
			'methods' => 'POST',
			'permission_callback' => function () { 
				return current_user_can( 'manage_options' );
			},
			'callback' => [ $this, 'sql_request' ]
		]);
		register_rest_route( $this->namespace, '/error_logs/', [
			'methods' => 'POST',
			'permission_callback' => function () { 
				$ok = current_user_can( 'manage_options' );
				return $ok;
			},
			'callback' => [ $this, 'rest_error_logs' ]
		]);
		register_rest_route( $this->namespace, '/all_settings/', [
			'methods' => 'POST',
			'permission_callback' => function () { 
				$ok = current_user_can( 'manage_options' );
				return $ok;
			},
			'callback' => [ $this, 'rest_all_settings' ]
		]);
		register_rest_route( $this->namespace, '/update_option/', [
			'methods' => 'POST',
			'permission_callback' => function () { 
				$ok = current_user_can( 'manage_options' );
				return $ok;
			},
			'callback' => [ $this, 'rest_update_option' ]
		]);
	}

	function file_rand( $filesize ) {
		$tmp_file = tmpfile();
		fseek( $tmp_file, $filesize - 1, SEEK_CUR );
		fwrite( $tmp_file, 'a');
		fclose( $tmp_file );
	}

	function empty_request() {
    return new WP_REST_Response( [ 'success' => true ], 200 );
	}
	
	function file_operation() {
		$this->file_rand( 1024 * 10 );
    return new WP_REST_Response( [ 'success' => true ], 200 );
	}
	
	function sql_request() {
		global $wpdb;
		$count = $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->posts}" );
    return new WP_REST_Response( [ 'success' => true, 'data' => $count ], 200 );
	}

	// List all the options with their default values.
	function list_options() {
		return array(
			'meowapps_hide_meowapps' => false,
			'force_sslverify' => false
		);
	}

	function get_all_options() {
		$options = $this->list_options();
		$current_options = array();
		foreach ( $options as $option => $default ) {
			$current_options[$option] = get_option( $option, $default );
		}
		return $current_options;
	}

	function rest_all_settings() {
		return new WP_REST_Response( [ 'success' => true, 'data' => $this->get_all_options() ], 200 );
	}

	function rest_update_option( $request ) {
		$params = $request->get_json_params();
		try {
			$name = $params['name'];
			$options = $this->list_options();
			if ( !array_key_exists( $name, $options ) ) {
				return new WP_REST_Response([ 'success' => false, 'message' => 'This option does not exist.' ], 200 );
			}
			$value = is_bool( $params['value'] ) ? ( $params['value'] ? '1' : '' ) : $params['value'];
			$success = update_option( $name, $value );
			if ( !$success ) {
				return new WP_REST_Response( [ 'success' => false, 'message' => 'Could not update option.' ], 200 );
			}
			return new WP_REST_Response( [ 'success' => true, 'data' => $value ], 200 );
		} 
		catch (Exception $e) {
			return new WP_REST_Response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	function rest_error_logs( $request ) {
		return new WP_REST_Response( [ 'success' => true, 'data' => MeowCommon_Helpers::php_error_logs() ], 200 );
	}

}
