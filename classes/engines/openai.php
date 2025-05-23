<?php

class Meow_MWAI_Engines_OpenAI extends Meow_MWAI_Engines_ChatML
{
  // Static
  private static $creating = false;

  public static function create( $core, $env ) {
    self::$creating = true;
    if ( class_exists( 'MeowPro_MWAI_OpenAI' ) ) {
      $instance = new MeowPro_MWAI_OpenAI( $core, $env );
    }
    else {
      $instance = new self( $core, $env );
    }
    self::$creating = false;
    return $instance;
  }

  public function __construct( $core, $env )
  {
    $isOwnClass = get_class( $this ) === 'Meow_MWAI_Engines_OpenAI';
    if ( $isOwnClass && !self::$creating ) {
      throw new \Exception( "Please use the create() method to instantiate the Meow_MWAI_Engines_OpenAI class." );
    }
    parent::__construct( $core, $env );
    $this->set_environment();
  }
}
