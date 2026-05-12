<?php

class MeowKit_MWAI_Rest {
  private $namespace = 'meow-common/v1';
  public static $instance = null;

  public static function init_once() {
    if ( !MeowKit_MWAI_Rest::$instance ) {
      MeowKit_MWAI_Rest::$instance = new self();
    }
  }

  private function __construct() {
    add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
  }

  /**
   * Capability gate for plugin admin endpoints. Defaults to manage_options but
   * honours a per-plugin filter so a site can grant access to other roles
   * without re-implementing every permission_callback. The filter name is
   * derived from the class name (`MeowKit_<PREFIX>_Rest` => `<prefix>_allow_setup`),
   * so each plugin gets its own filter automatically after Nekofy substitution.
   */
  private function can_setup() {
    static $filter = null;
    if ( $filter === null ) {
      $parts = explode( '_', __CLASS__ );
      $prefix = isset( $parts[1] ) ? strtolower( $parts[1] ) : '';
      $filter = $prefix !== '' ? $prefix . '_allow_setup' : '';
    }
    $default = current_user_can( 'manage_options' );
    return $filter !== '' ? apply_filters( $filter, $default ) : $default;
  }

  public function rest_api_init() {
    if ( !$this->can_setup() ) {
      return;
    }
    $permission = function () {
      return $this->can_setup();
    };
    register_rest_route( $this->namespace, '/empty_request/', [
      'methods' => 'POST',
      'permission_callback' => $permission,
      'callback' => [ $this, 'empty_request' ]
    ] );
    register_rest_route( $this->namespace, '/file_operation/', [
      'methods' => 'POST',
      'permission_callback' => $permission,
      'callback' => [ $this, 'file_operation' ]
    ] );
    register_rest_route( $this->namespace, '/sql_request/', [
      'methods' => 'POST',
      'permission_callback' => $permission,
      'callback' => [ $this, 'sql_request' ]
    ] );
    register_rest_route( $this->namespace, '/error_logs/', [
      'methods' => 'POST',
      'permission_callback' => $permission,
      'callback' => [ $this, 'rest_error_logs' ]
    ] );
    register_rest_route( $this->namespace, '/all_settings/', [
      'methods' => 'POST',
      'permission_callback' => $permission,
      'callback' => [ $this, 'rest_all_settings' ]
    ] );
    register_rest_route( $this->namespace, '/update_option/', [
      'methods' => 'POST',
      'permission_callback' => $permission,
      'callback' => [ $this, 'rest_update_option' ]
    ] );
    register_rest_route( $this->namespace, '/installed_plugins/', [
      'methods' => 'POST',
      'permission_callback' => $permission,
      'callback' => [ $this, 'rest_installed_plugins' ]
    ] );
  }

  public function file_rand( $filesize ) {
    $tmp_file = tmpfile();
    fseek( $tmp_file, $filesize - 1, SEEK_CUR );
    fwrite( $tmp_file, 'a' );
    fclose( $tmp_file );
  }

  public function empty_request() {
    return new WP_REST_Response( [ 'success' => true ], 200 );
  }

  public function file_operation() {
    $this->file_rand( 1024 * 10 );
    return new WP_REST_Response( [ 'success' => true ], 200 );
  }

  public function sql_request() {
    global $wpdb;
    $count = $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->posts}" );
    return new WP_REST_Response( [ 'success' => true, 'data' => $count ], 200 );
  }

  // List all the options with their default values.
  public function list_options() {
    return [
      'meowapps_hide_meowapps' => false,
      'force_sslverify' => false
    ];
  }

  public function get_all_options() {
    $options = $this->list_options();
    $current_options = [];
    foreach ( $options as $option => $default ) {
      $current_options[$option] = get_option( $option, $default );
    }
    return $current_options;
  }

  public function rest_all_settings() {
    return new WP_REST_Response( [ 'success' => true, 'data' => $this->get_all_options() ], 200 );
  }

  public function rest_installed_plugins() {
    if ( !function_exists( 'get_plugins' ) ) {
      require_once ABSPATH . 'wp-admin/includes/plugin.php';
    }
    $all_plugins = get_plugins();
    $result = [];
    foreach ( $all_plugins as $plugin_file => $plugin_data ) {
      // Plugin file looks like "ai-engine/ai-engine.php" — the slug is the
      // first path segment. Some plugins live at the root (single file),
      // those we just skip; we only care about Meow Apps directories anyway.
      $parts = explode( '/', $plugin_file );
      if ( count( $parts ) < 2 ) {
        continue;
      }
      $slug = $parts[0];
      $result[ $slug ] = is_plugin_active( $plugin_file ) ? 'active' : 'inactive';
    }
    return new WP_REST_Response( [ 'success' => true, 'data' => $result ], 200 );
  }

  public function rest_update_option( $request ) {
    $params = $request->get_json_params();
    try {
      $name = $params['name'];
      $options = $this->list_options();
      if ( !array_key_exists( $name, $options ) ) {
        return new WP_REST_Response( [ 'success' => false, 'message' => 'This option does not exist.' ], 200 );
      }
      $value = is_bool( $params['value'] ) ? ( $params['value'] ? '1' : '' ) : $params['value'];
      $success = update_option( $name, $value );
      if ( !$success ) {
        return new WP_REST_Response( [ 'success' => false, 'message' => 'Could not update option.' ], 200 );
      }
      return new WP_REST_Response( [ 'success' => true, 'data' => $value ], 200 );
    }
    catch ( Exception $e ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_error_logs( $request ) {
    return new WP_REST_Response( [ 'success' => true, 'data' => MeowKit_MWAI_Helpers::php_error_logs() ], 200 );
  }

}
