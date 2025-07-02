<?php

class Meow_MWAI_Rest_Settings extends Meow_MWAI_Rest_Base {
  public function register_routes() {
    register_rest_route( $this->namespace, '/settings/update', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_settings_update' ],
      'permission_callback' => [ $this->core, 'check_rest_nonce' ]
    ] );
    register_rest_route( $this->namespace, '/settings/options', [
      'methods' => 'GET',
      'callback' => [ $this, 'rest_settings_options' ],
      'permission_callback' => [ $this->core, 'check_rest_nonce' ]
    ] );
    register_rest_route( $this->namespace, '/settings/reset', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_settings_reset' ],
      'permission_callback' => [ $this->core, 'check_rest_nonce' ]
    ] );
    register_rest_route( $this->namespace, '/settings/chatbots', [
      'methods' => 'GET',
      'callback' => [ $this, 'rest_settings_get_chatbots' ],
      'permission_callback' => [ $this->core, 'check_rest_nonce' ]
    ] );
    register_rest_route( $this->namespace, '/settings/chatbots', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_settings_update_chatbots' ],
      'permission_callback' => [ $this->core, 'check_rest_nonce' ]
    ] );
    register_rest_route( $this->namespace, '/settings/themes', [
      'methods' => 'GET',
      'callback' => [ $this, 'rest_settings_get_themes' ],
      'permission_callback' => [ $this->core, 'check_rest_nonce' ]
    ] );
    register_rest_route( $this->namespace, '/settings/themes', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_settings_update_themes' ],
      'permission_callback' => [ $this->core, 'check_rest_nonce' ]
    ] );
    register_rest_route( $this->namespace, '/settings/reset-usage', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_settings_reset_usage' ],
      'permission_callback' => [ $this->core, 'check_rest_nonce' ]
    ] );
  }

  public function rest_settings_update( $request ) {
    try {
      $params = $request->get_json_params();
      $filters_options = $params['options'];
      $this->core->update_options( $filters_options );
      $this->core->update_options( [
        'module_suggestions' => isset( $params['options']['module_suggestions'] ),
        'module_chatbots' => isset( $params['options']['module_chatbots'] ),
        'module_search' => isset( $params['options']['module_search'] ),
        'module_tasks' => isset( $params['options']['module_tasks'] ),
        'module_advisor' => isset( $params['options']['module_advisor'] ),
      ] );
      return $this->create_rest_response( [ 'success' => true ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_settings_options( $request ) {
    try {
      $options = $this->core->get_all_options();
      return $this->create_rest_response( [ 'success' => true, 'options' => $options ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_settings_reset( $request ) {
    try {
      $options = $this->core->get_all_options( true );
      $this->core->update_options( $options );
      return $this->create_rest_response( [ 'success' => true, 'options' => $options ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_settings_get_chatbots( $request ) {
    try {
      $chatbots = $this->core->get_chatbots();
      return $this->create_rest_response( [ 'success' => true, 'chatbots' => $chatbots ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_settings_update_chatbots( $request ) {
    try {
      $params = $request->get_json_params();
      $chatbots = $params['chatbots'];
      $this->core->update_chatbots( $chatbots );
      return $this->create_rest_response( [ 'success' => true ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_settings_get_themes( $request ) {
    try {
      $themes = $this->core->get_themes();
      return $this->create_rest_response( [ 'success' => true, 'themes' => $themes ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_settings_update_themes( $request ) {
    try {
      $params = $request->get_json_params();
      $themes = $params['themes'];
      $this->core->update_themes( $themes );
      return $this->create_rest_response( [ 'success' => true ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_settings_reset_usage( $request ) {
    try {
      // Reset the actual backend options that store usage data
      $this->core->update_option( 'ai_usage', [] );
      $this->core->update_option( 'ai_usage_daily', [] );
      
      // Force refresh to get updated options to return to frontend
      $options = $this->core->get_all_options( true );
      
      return $this->create_rest_response( [ 
        'success' => true, 
        'options' => $options 
      ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }
}
