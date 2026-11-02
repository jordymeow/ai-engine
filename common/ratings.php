<?php

if ( !class_exists( 'MeowKit_MWAI_Ratings' ) ) {

  class MeowKit_MWAI_Ratings {
    public $mainfile;   // plugin main file (media-file-renamer.php)
    public $domain;     // domain used for translation (media-file-renamer)
    public $prefix;      // used for many things (filters, options, etc)
    public $ignored_domains = [ 'mwai-*' ];

    public function __construct( $prefix, $mainfile, $domain ) {
      $this->mainfile = $mainfile;
      $this->domain = $domain;
      $this->prefix = $prefix;

      if ( array_search( $this->domain, $this->ignored_domains ) !== false ) {
        return;
      }
      foreach ( $this->ignored_domains as $ignored_domain ) {
        if ( strpos( $ignored_domain, '*' ) !== false ) {
          $ignored_domain = str_replace( '*', '', $ignored_domain );
          if ( strpos( $this->domain, $ignored_domain ) !== false ) {
            return;
          }
        }
      }

      // Add the hooks
      register_activation_hook( $mainfile, [ $this, 'show_meowapps_create_rating_date' ] );
      if ( is_admin() && time() > $this->create_rating_date() ) {
        add_action( 'admin_footer', [ $this, 'print_review' ] );
      }
    }

    public function show_meowapps_create_rating_date() {
      delete_option( 'meowapps_hide_meowapps' );
      $this->create_rating_date();
    }

    public function create_rating_date() {
      $rating_date = get_option( $this->prefix . '_rating_date' );
      if ( empty( $rating_date ) ) {
        $two_weeks = strtotime( '+2 weeks' );
        $three_weeks = strtotime( '+3 weeks' );
        $rating_date = mt_rand( $two_weeks, $three_weeks );
        update_option( $this->prefix . '_rating_date', $rating_date, false );
      }
      return $rating_date;
    }

    /**
     * The review ask is one quiet line under the plugin's header (NekoHeader reads
     * window.meowReviews), only on the plugin's own screens. It replaced a notice shown on every
     * admin page, which people dismissed while busy elsewhere (Jordy, 10-31). Same timing and the
     * same option as before, so people who already said done or hide are never asked again.
     */
    public function print_review() {
      $slug = $this->nice_short_url_from_file( $this->mainfile );
      $review = [
        'prefix' => $this->prefix,
        'name' => $this->nice_name(),
        'url' => 'https://wordpress.org/support/plugin/' . $slug . '/reviews/#new-post',
        'ajax' => admin_url( 'admin-ajax.php' ),
        'nonce' => wp_create_nonce( 'meowapps_review' ),
      ];
      echo '<script>window.meowReviews = window.meowReviews || {}; window.meowReviews[' .
        wp_json_encode( $slug ) . '] = ' . wp_json_encode( $review ) . ';</script>';
    }

    /**
     * Later / never / done from the review line. admin-ajax, not REST: some plugins only build
     * their admin side when is_admin(), which is true for admin-ajax.php and false for REST, so a
     * REST route registered from here didn't exist for them. Hooked from the admin class.
     */
    public static function ajax_review() {
      check_ajax_referer( 'meowapps_review' );
      if ( !current_user_can( 'manage_options' ) ) {
        wp_send_json_error();
      }
      $prefix = isset( $_POST['prefix'] ) ? sanitize_key( wp_unslash( $_POST['prefix'] ) ) : '';
      $choice = isset( $_POST['choice'] ) ? sanitize_key( wp_unslash( $_POST['choice'] ) ) : '';
      $dates = [
        'later' => mt_rand( strtotime( '+2 weeks' ), strtotime( '+6 weeks' ) ),
        'never' => strtotime( '+5 years' ),
        'done' => strtotime( '+100 years' ),
      ];
      if ( !$prefix || !isset( $dates[ $choice ] ) || get_option( $prefix . '_rating_date' ) === false ) {
        wp_send_json_error();
      }
      update_option( $prefix . '_rating_date', $dates[ $choice ], false );
      wp_send_json_success();
    }

    public function nice_name() {
      $name = $this->nice_name_from_file( $this->mainfile );
      $names = [ 'Wp Retina 2x Pro' => 'Perfect Images', 'Wp Retina 2x' => 'Perfect Images', 'Ai Engine Pro' => 'AI Engine', 'Ai Engine' => 'AI Engine' ];
      return isset( $names[ $name ] ) ? $names[ $name ] : preg_replace( '/ Pro$/', '', $name );
    }

    public function nice_short_url_from_file( $file ) {
      $info = pathinfo( $file );
      if ( !empty( $info ) ) {
        $info['filename'] = str_replace( '-pro', '', $info['filename'] );
        return $info['filename'];
      }
      return '';
    }

    public function nice_name_from_file( $file ) {
      $info = pathinfo( $file );
      if ( !empty( $info ) ) {
        if ( $info['filename'] == 'wplr-sync' ) {
          return 'Photo Engine';
        }
        $info['filename'] = str_replace( '-', ' ', $info['filename'] );
        $file = ucwords( $info['filename'] );
      }
      return $file;
    }
  }
}
