<?php

if ( !class_exists( 'MeowCommon_Issues' ) ) {

  class MeowCommon_Issues {

    public function __construct( $prefix, $mainfile, $domain ) {
      $this->check_plugins();
    }

    function check_plugins() {
      
      // Previous technique to disable caching on the REST API.
      // if ( class_exists( 'LiteSpeed\Core' ) ) {
      //   $this->check_litespeed();
      // }

      // Recommended technique to disable caching on the REST API by the Litespeed team.
      if ( defined( 'LSCWP_V' ) ) {
        do_action( 'litespeed_control_set_nocache', 'Meow Apps API must not be cached.' );
      }
    }

    function check_litespeed() {
      // By default, the REST API is cached by Litespeed. Why is that?
      // It is absolutely not a good idea, especially on the admin side.
      $cache_rest = get_option( 'litespeed.conf.cache-rest' );
      if ( $cache_rest ) {
        update_option( 'litespeed.conf.cache-rest', 0 );
      }
    }

  }
}

?>