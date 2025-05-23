<?php


class Meow_MWAI_Admin extends MeowCommon_Admin {
  public $core;
  public $contentGeneratorEnabled;
  public $imagesGeneratorEnabled;
  public $playgroundEnabled;
  public $suggestionsEnabled;

  public function __construct( $core ) {
    $this->core = $core;
    parent::__construct( MWAI_PREFIX, MWAI_ENTRY, MWAI_DOMAIN, class_exists( 'MeowPro_MWAI_Core' ) );
    if ( is_admin() ) {
      $this->contentGeneratorEnabled = $this->core->get_option( 'module_generator_content' );
      $this->imagesGeneratorEnabled = $this->core->get_option( 'module_generator_images' );
      $this->playgroundEnabled = $this->core->get_option( 'module_playground' );
      $can_access_settings = $this->core->can_access_settings();
      $can_access_features = $this->core->can_access_features();

      if ( $can_access_settings || $can_access_features ) {
        add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );
      }
      
      if ( $can_access_settings ) {
        add_action( 'admin_menu', array( $this, 'app_menu' ) );
      }

      if ( $can_access_features ) {
        add_action( 'admin_menu', array( $this, 'admin_menu' ) );

        // Only if the Suggestions are enabled.
        $this->suggestionsEnabled = $this->core->get_option( 'module_suggestions' );
                               if ( $this->suggestionsEnabled ) {
                                       add_filter( 'post_row_actions', [ $this, 'post_row_actions' ], 10, 2 );
                                       add_filter( 'page_row_actions', [ $this, 'post_row_actions' ], 10, 2 );
                               }

                                if ( $this->imagesGeneratorEnabled ) {
                                        add_filter( 'media_row_actions', [ $this, 'media_row_actions' ], 10, 2 );
                                }

        add_action( 'admin_footer', [ $this, 'admin_footer' ] );
      }
    }
  }

  function admin_menu() {

    // Generate New (under Posts)
    if ( $this->contentGeneratorEnabled) {
      add_submenu_page( 'edit.php', 'Generate New', 'Generate New', 'read', 'mwai_content_generator', 
        array( $this, 'ai_content_generator' ), 2 );
    }

    // In Tools
    if ( $this->playgroundEnabled ) {
      add_management_page( 'Playground', __( 'Playground', 'ai-engine' ), 'read', 
        'mwai_dashboard', array( $this, 'ai_playground' ) );
    }
    if ( $this->contentGeneratorEnabled ) {
      add_management_page( 'Generate Content', 'Generate Content', 'read', 'mwai_content_generator', 
        array( $this, 'ai_content_generator' ) );
    }
    if ( $this->imagesGeneratorEnabled ) {
      add_management_page( 'Generate Images', 'Generate Images', 'read', 'mwai_images_generator', 
        array( $this, 'ai_image_generator' ) );
    }

    // In the Admin Bar:
    add_action( 'admin_bar_menu', array( $this, 'admin_bar_menu' ), 100 );
  }

  function admin_bar_menu( $wp_admin_bar ) {

    $admin_bar = $this->core->get_option( 'admin_bar' );
    $settings = isset( $admin_bar['settings'] ) && $admin_bar['settings'];
    $playground = isset( $admin_bar['playground'] ) && $admin_bar['playground'];
    $content_generator = isset( $admin_bar['content_generator'] ) && $admin_bar['content_generator'];
    $images_generator = isset( $admin_bar['images_generator'] ) && $admin_bar['images_generator'];

    if ( $settings ) {
      $wp_admin_bar->add_node(  array(
        'id' => 'mwai-settings',
        'title' => '<span class="ab-icon dashicons-before dashicons-admin-settings" style="top: 2px;"></span>' . __( 'AI Engine', 'ai-engine' ),
        'href' => admin_url( 'admin.php?page=mwai_settings' ),
        'meta' => array( 'class' => 'mwai-settings' ),
      ) );
    }

    if ( $content_generator ) {
      $wp_admin_bar->add_node( array(
        'id' => 'mwai-content-generator',
        'title' => MWAI_IMG_WAND_HTML . __( 'Content', 'ai-engine' ),
        'href' => admin_url( 'tools.php?page=mwai_content_generator' ),
        'meta' => array( 'class' => 'mwai-content-generator' ),
      ) );
    }
    if ( $images_generator ) {
      $wp_admin_bar->add_node( array(
        'id' => 'mwai-image-generator',
        'title' => MWAI_IMG_WAND_HTML . __( 'Images', 'ai-engine' ),
        'href' => admin_url( 'tools.php?page=mwai_images_generator' ),
        'meta' => array( 'class' => 'mwai-images-generator' ),
      ) );
    }

    // The Global Magic Wand
    // if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
    // 	$wp_admin_bar->add_node( array(
    // 		'id' => 'mwai-debug',
    // 		'title' => MWAI_IMG_WAND_HTML . __( 'Magic Wand', 'ai-engine' ),
    // 		//'href' => admin_url( 'tools.php?page=mwai_debug' ),
    // 		'meta' => array( 'class' => 'mwai-debug' ),
    // 	) );
    // }
    
    if ( $playground ) {
      $wp_admin_bar->add_node(  array(
        'id' => 'mwai-playground',
        'title' => MWAI_IMG_WAND_HTML . __( 'Playground', 'ai-engine' ),
        'href' => admin_url( 'tools.php?page=mwai_dashboard' ),
        'meta' => array( 'class' => 'mwai-playground' ),
      ) );
    }
  }

  public function ai_playground() {
    echo '<div id="mwai-playground"></div>';
  }

  public function ai_content_generator() {
    echo '<div id="mwai-content-generator"></div>';
  }

  public function ai_image_generator() {
    echo '<div id="mwai-image-generator"></div>';
  }

  function post_row_actions( $actions, $post ) {
    $actions['ai_titles'] = '<a class="mwai-link-title" href="#" data-id="' .
      $post->ID . '" data-title="' . $post->post_title . '">
      ' . MWAI_IMG_WAND_HTML_XS . ' Title</a>';
    $actions['ai_excerpts'] = '<a class="mwai-link-excerpt" href="#" data-id="' .
      $post->ID . '" data-title="' . $post->post_title . '">
      ' . MWAI_IMG_WAND_HTML_XS . ' Excerpt</a>';
    return $actions;
  }

  function media_row_actions( $actions, $post ) {
    if ( strpos( $post->post_mime_type, 'image/' ) === 0 ) {
      $url = admin_url( 'tools.php?page=mwai_images_generator&editId=' . $post->ID );
      $actions['mwai_remix'] = '<a href="' . $url . '">' . MWAI_IMG_WAND_HTML_XS . ' ' . __( 'Edit', 'ai-engine' ) . '</a>';
    }
    return $actions;
  }

  function admin_footer() {
    echo '<div id="mwai-admin-postsList"></div>';
  }

  function admin_enqueue_scripts() {
    $physical_file = MWAI_PATH . '/app/index.js';	
    $cache_buster = file_exists( $physical_file ) ? filemtime( $physical_file ) : MWAI_VERSION;
    wp_register_script( 'mwai-vendor', MWAI_URL . 'app/vendor.js', null, $cache_buster );
    wp_register_script( 'mwai', MWAI_URL . 'app/index.js', [ 'mwai-vendor',
      'wp-element', 'wp-components', 'wp-edit-post', 'wp-plugins', 'wp-i18n'
    ], $cache_buster );
    wp_enqueue_script( 'mwai' );

    // The MD5 of the translation file built by WP uses app/i18n.js instead of app/index.js
    add_filter( 'load_script_translation_file', function( $file, $handle, $domain ) {
      if ( $domain !== 'ai-engine' ) { return $file; }
      $file = str_replace( md5( 'app/index.js' ), md5( 'app/i18n.js' ), $file );
      return $file;
    }, 10, 3 );

    // This is useless for AI Engine, but it avoids issues when themes and plugin calls
    // wp_enqueue_media too late (usually, they call it in the footer). Until someone
    // figures out what the issue is, let's load it here.
    wp_enqueue_media();

    wp_set_script_translations( 'mwai', 'ai-engine' );
    wp_localize_script( 'mwai', 'mwai', [
      'api_url' => get_rest_url( null, 'mwai/v1' ),
      'rest_url' => get_rest_url(),
      'plugin_url' => MWAI_URL,
      'user_data' => $this->core->get_user_data(),
      'prefix' => MWAI_PREFIX,
      'domain' => MWAI_DOMAIN,
      'is_pro' => class_exists( 'MeowPro_MWAI_Core' ),
      'is_registered' => !!$this->is_registered(),
      'rest_nonce' => wp_create_nonce( 'wp_rest' ),
      'session' => $this->core->get_session_id(),
      'options' => $this->core->get_all_options(),
      'chatbots' => $this->core->get_chatbots(),
      'themes' => $this->core->get_themes(),
      'stream' => $this->core->get_option( 'ai_streaming' ),
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