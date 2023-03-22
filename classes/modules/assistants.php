<?php

class Meow_MWAI_Modules_Assistants {
  private $core = null;
  private $module_woocommerce = false;

  public function __construct() {
    global $mwai_core;
    $this->core = $mwai_core;
    $this->module_woocommerce = $this->core->get_option( 'module_woocommerce' );

    // Add Metadata Metabox to Product Post Type Edit Page
    if ( $this->module_woocommerce ) {
      add_action( 'add_meta_boxes', array( $this, 'add_meta_boxes' ) );
    }
  }

  function add_meta_boxes() {
    if ( get_post_type() !== 'product' ) {
      return;
    }
    add_meta_box( 'meow-mwai-metadata',
      __( 'AI Engine', 'meow-mwai' ),
      array( $this, 'render_metadata_metabox' ),
      'product', 'side', 'high'
    );
  }

  function render_metadata_metabox( $post ) {
    $this->core->uiNeeded = true;
    echo '<div id="mwai-admin-wcAssistant"></div>';
  }
}