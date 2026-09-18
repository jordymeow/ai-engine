<?php

spl_autoload_register( function ( $class ) {
  $file = null;

  // Handle specific namespaces first for better organization
  if ( strpos( $class, 'Meow_MWAI_Modules' ) !== false ) {
    $filename = str_replace( 'meow_mwai_modules_', '', strtolower( $class ) );
    $filename = str_replace( '_', '-', $filename );
    $file = MWAI_PATH . '/classes/modules/' . $filename . '.php';
  }
  else if ( strpos( $class, 'Meow_MWAI_Query' ) !== false ) {
    // Remove the prefix
    $filename = str_replace( 'Meow_MWAI_Query_', '', $class );
    // Convert camelCase to kebab-case
    $filename = strtolower( preg_replace( '/([a-z])([A-Z])/', '$1-$2', $filename ) );
    $file = MWAI_PATH . '/classes/query/' . $filename . '.php';
  }
  else if ( strpos( $class, 'Meow_MWAI_Data' ) !== false ) {
    // Remove the prefix
    $filename = str_replace( 'Meow_MWAI_Data_', '', $class );
    // Convert camelCase to kebab-case
    $filename = strtolower( preg_replace( '/([a-z])([A-Z])/', '$1-$2', $filename ) );
    $file = MWAI_PATH . '/classes/data/' . $filename . '.php';
  }
  else if ( strpos( $class, 'Meow_MWAI_Engines' ) !== false ) {
    // Remove the prefix
    $filename = str_replace( 'Meow_MWAI_Engines_', '', $class );
    // Special handling for known engine names
    if ( $filename === 'OpenAI' ) {
      $filename = 'openai';
    }
    else if ( $filename === 'OpenRouter' ) {
      $filename = 'open-router';
    }
    else if ( $filename === 'ChatML' ) {
      $filename = 'chatml';
    }
    else {
      // Convert camelCase to kebab-case for others
      $filename = strtolower( preg_replace( '/([a-z])([A-Z])/', '$1-$2', $filename ) );
    }
    $file = MWAI_PATH . '/classes/engines/' . $filename . '.php';
  }
  else if ( strpos( $class, 'Meow_MWAI_Services' ) !== false ) {
    // Remove the prefix
    $filename = str_replace( 'Meow_MWAI_Services_', '', $class );
    // Convert camelCase to kebab-case
    $filename = strtolower( preg_replace( '/([a-z])([A-Z])/', '$1-$2', $filename ) );
    $file = MWAI_PATH . '/classes/services/' . $filename . '.php';
  }
  else if ( strpos( $class, 'Meow_MWAI_FunctionCallException' ) !== false ) {
    $file = MWAI_PATH . '/classes/exceptions/function-call-exception.php';
  }
  else if ( strpos( $class, 'Meow_MWAI_RefusedException' ) !== false ) {
    $file = MWAI_PATH . '/classes/exceptions/refused-exception.php';
  }
  else if ( strpos( $class, 'Meow_MWAI_Labs' ) !== false ) {
    $filename = str_replace( 'meow_mwai_labs_', '', strtolower( $class ) );
    // Convert underscores to hyphens for consistency
    $filename = str_replace( '_', '-', $filename );
    $file = MWAI_PATH . '/labs/' . $filename . '.php';
  }
  else if ( strpos( $class, 'Meow_MWAI' ) !== false ) {
    $filename = str_replace( 'meow_mwai_', '', strtolower( $class ) );
    $filename = str_replace( '_', '-', $filename );
    $file = MWAI_PATH . '/classes/' . $filename . '.php';
  }
  else if ( strpos( $class, 'MeowKit_MWAI_' ) !== false ) {
    // Strip MeowKit_MWAI_ prefix to get just the class name
    $filename = str_replace( 'meowkit_mwai_', '', strtolower( $class ) );
    $filename = str_replace( '_', '-', $filename );
    $file = MWAI_PATH . '/common/' . $filename . '.php';
  }
  else if ( strpos( $class, 'MeowKitPro_MWAI_' ) !== false ) {
    // Strip MeowKitPro_MWAI_ prefix to get just the class name
    $filename = str_replace( 'meowkitpro_mwai_', '', strtolower( $class ) );
    // Special case for rest_license to maintain backward compatibility
    if ( $filename === 'rest_license' ) {
      $file = MWAI_PATH . '/common/premium/rest_license.php';
    }
    else {
      $filename = str_replace( '_', '-', $filename );
      $file = MWAI_PATH . '/common/premium/' . $filename . '.php';
    }
  }
  else if ( strpos( $class, 'MeowPro_MWAI_Addons' ) !== false ) {
    // Remove the prefix
    $filename = str_replace( 'MeowPro_MWAI_Addons_', '', $class );
    // Convert camelCase to kebab-case
    $filename = strtolower( preg_replace( '/([a-z])([A-Z])/', '$1-$2', $filename ) );
    $file = MWAI_PATH . '/premium/addons/' . $filename . '.php';
  }
  else if ( strpos( $class, 'MeowPro_MWAI' ) !== false ) {
    // Remove the prefix
    $filename = str_replace( 'MeowPro_MWAI_', '', $class );
    // Special handling for known class names
    if ( $filename === 'OpenAI' ) {
      $filename = 'openai';
    }
    else {
      // Convert camelCase to kebab-case
      $filename = strtolower( preg_replace( '/([a-z])([A-Z])/', '$1-$2', $filename ) );
      // Convert underscores to hyphens for consistency
      $filename = str_replace( '_', '-', $filename );
    }
    $file = MWAI_PATH . '/premium/' . $filename . '.php';
  }
  if ( $file && file_exists( $file ) ) {
    require( $file );
  }
} );

require_once( MWAI_PATH . '/common/helpers.php' );

global $mwai_core;
$mwai_core = new Meow_MWAI_Core();

// Registered here rather than from the MCP module: on activation WordPress includes
// the plugin after plugins_loaded has already fired, so no module instance exists to
// hook it. See purge_discovery_cache() for why an activation needs to purge at all.
register_activation_hook( MWAI_ENTRY, function () {
  require_once MWAI_PATH . '/labs/mcp-oauth.php';
  Meow_MWAI_Labs_MCP_OAuth::purge_discovery_cache();
} );
