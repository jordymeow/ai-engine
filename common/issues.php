<?php

if ( !class_exists( 'MeowCommon_Issues' ) ) {

  class MeowCommon_Issues {

    public function __construct( $prefix, $mainfile, $domain ) {
      $this->check_plugins();
    }

    function check_plugins() {
      // if ( class_exists( 'LiteSpeed\Core' ) ) {
      //   $this->check_litespeed();
      // }
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