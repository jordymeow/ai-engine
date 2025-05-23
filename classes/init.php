<?php

if ( class_exists( 'MeowPro_MWAI_Core' ) && class_exists( 'Meow_MWAI_Core' ) ) {
	function mwai_thanks_admin_notices() {
		echo '<div class="error"><p>' . __( 'Thanks for installing the Pro version of AI Engine :) However, the free version is still enabled. Please disable or uninstall it.', 'ai-engine' ) . '</p></div>';
	}
	add_action( 'admin_notices', 'mwai_thanks_admin_notices' );
	return;
}

spl_autoload_register(function ( $class ) {
  $file = null;
  if ( strpos( $class, 'Meow_MWAI' ) !== false ) {
    $file = MWAI_PATH . '/classes/' . str_replace( 'meow_mwai_', '', strtolower( $class ) ) . '.php';
  }
  if ( strpos( $class, 'Meow_MWAI_Modules' ) !== false ) {
    $file = MWAI_PATH . '/classes/modules/' . str_replace( 'meow_mwai_modules_', '', strtolower( $class ) ) . '.php';
  }
  else if ( strpos( $class, 'Meow_MWAI_Query' ) !== false ) {
    $file = MWAI_PATH . '/classes/queries/' . str_replace( 'meow_mwai_query_', '', strtolower( $class ) ) . '.php';
  }
  else if ( strpos( $class, 'Meow_MWAI_Engines' ) !== false ) {
    $file = MWAI_PATH . '/classes/engines/' . str_replace( 'meow_mwai_engines_', '', strtolower( $class ) ) . '.php';
  }
  else if ( strpos( $class, 'Meow_MWAI_Labs' ) !== false ) {
    $file = MWAI_PATH . '/labs/' . str_replace( 'meow_mwai_labs_', '', strtolower( $class ) ) . '.php';
  }
  else if ( strpos( $class, 'MeowCommon_' ) !== false ) {
    $file = MWAI_PATH . '/common/' . str_replace( 'meowcommon_', '', strtolower( $class ) ) . '.php';
  }
  else if ( strpos( $class, 'MeowCommonPro_' ) !== false ) {
    $file = MWAI_PATH . '/common/premium/' . str_replace( 'meowcommonpro_', '', strtolower( $class ) ) . '.php';
  }
  else if ( strpos( $class, 'MeowPro_MWAI_Addons' ) !== false ) {
    $file = MWAI_PATH . '/premium/addons/' . str_replace( 'meowpro_mwai_addons_', '', strtolower( $class ) ) . '.php';
  }
  else if ( strpos( $class, 'MeowPro_MWAI' ) !== false ) {
    $file = MWAI_PATH . '/premium/' . str_replace( 'meowpro_mwai_', '', strtolower( $class ) ) . '.php';
  }
  if ( $file && file_exists( $file ) ) {
    require( $file );
  }
});

require_once( MWAI_PATH . '/common/helpers.php');

global $mwai_core;
$mwai_core = new Meow_MWAI_Core();
