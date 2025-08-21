<?php

class Meow_MWAI_Modules_Forms_Manager {
  private $core = null;

  public function __construct( $core ) {
    $this->core = $core;
    add_action( 'init', [ $this, 'register_post_type' ] );
    add_shortcode( 'mwai_form', [ $this, 'shortcode_render_form' ] );
  }

  public function register_post_type() {
    $labels = [
      'name' => 'AI Forms',
      'singular_name' => 'AI Form',
    ];

    register_post_type( 'mwai_form', [
      'labels' => $labels,
      'public' => false,
      'show_ui' => true, // Allow native edit screens, but keep it out of the menu
      'show_in_menu' => false,
      'show_in_rest' => true, // Enable Gutenberg data model via REST
      'supports' => [ 'title', 'editor' ],
      'capability_type' => 'post',
      'map_meta_cap' => true,
    ] );
  }

  /**
   * [mwai_form id="123"]
   * Render a saved form by ID using the block content and built-in shortcodes.
   */
  public function shortcode_render_form( $atts ) {
    $atts = shortcode_atts( [ 'id' => 0 ], $atts );
    $post_id = intval( $atts['id'] );
    if ( !$post_id ) {
      return '';
    }

    $post = get_post( $post_id );
    if ( !$post || $post->post_type !== 'mwai_form' ) {
      return '';
    }

    // Ensure themes can be enqueued by nested shortcodes if needed
    // Actual scripts/styles will be handled by the individual form shortcodes
    $content = $post->post_content;

    // Apply blocks and shortcodes
    // Let WordPress parse blocks first, then shortcodes within
    $content = do_blocks( $content );
    $content = do_shortcode( $content );
    return $content;
  }
}
