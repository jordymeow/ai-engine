<?php

class Meow_MWAI_Modules_Utilities {
  private $core = null;

  public function __construct() {
    global $mwai_core;
    $this->core = $mwai_core;

    // Add meta boxes with AI Engine when needed
    if ( false ) {
      add_action( 'add_meta_boxes', array( $this, 'add_meta_boxes' ) );
    }
  }

  function add_meta_boxes() {

  }

}