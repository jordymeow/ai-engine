<?php

class Meow_MWAI_Engines_Factory {

  private static function get_default_env_id( $core ) : ?string {
    return $core->get_option( 'ai_default_env' );
  }

  private static function get_default_model( $core ) : ?string {
    return $core->get_option( 'ai_default_model' );
  }

  private static function get_env_from_id( $core, $envId ) : ?array {
    $envs = $core->get_option( 'ai_envs' );
    foreach ( $envs as $env ) {
      if ( $env['id'] === $envId ) {
        return $env;
      }
    }
    throw new Exception( "AI Engine: No environment found for ID ($envId)." );
  }

  private static function get_env_from_type( $core, $type, $envId ) : ?array {
    $types = is_array( $type ) ? $type : [ $type ];

    // Try first to find the env with the ID provided.
    if ( !empty( $envId ) ) {
      $env = self::get_env_from_id( $core, $envId );
      if ( in_array( $env['type'], $types ) ) {
        return $env;
      }
      else {
        $toTypes = implode( ', ', $types );
        $toTypes = trim( $toTypes );
        throw new Exception( "AI Engine: Environment ID ($envId) is not of type $toTypes." );
      }
    }
    // If not, we will try to find the default one.
    $envId = self::get_default_env_id( $core );
    $env = self::get_env_from_id( $core, $envId );
    if ( in_array( $env['type'], $type ) ) {
      return $env;
    }
    // If not, we will try to find the first one.
    $envs = $core->get_option( 'ai_envs' );
    foreach ( $envs as $env ) {
      if ( in_array( $env['type'], $type ) ) {
        return $env;
      }
    }
    throw new Exception( "AI Engine: No environment found for type ($type)." );
  }

  public static function get( $core, $envId = null ) : ?Meow_MWAI_Engines_Core {
    // If no envId is provided, we will use the default one as well as the default model.
    $model = null;
    if ( empty( $envId ) ) {
      $envId = self::get_default_env_id( $core );
      //$model = self::get_default_model( $core );
    }
    $env = self::get_env_from_id( $core, $envId );
    if ( $env['type'] === 'openai' || $env['type'] === 'azure' ) {
      $engine = Meow_MWAI_Engines_OpenAI::create( $core, $env );
      return $engine;
    }
    else if ( $env['type'] === 'google' ) {
      $engine = Meow_MWAI_Engines_Google::create( $core, $env );
      return $engine;
    }
    else if ( $env['type'] === 'anthropic' ) {
      $engine = new Meow_MWAI_Engines_Anthropic( $core, $env );
      return $engine;
    }
    else if ( $env['type'] === 'openrouter' ) {
      $engine = new Meow_MWAI_Engines_OpenRouter( $core, $env );
      return $engine;
    }
    else if ( $env['type'] === 'huggingface' ) {
      $engine = new Meow_MWAI_Engines_HuggingFace( $core, $env );
      return $engine;
    }
    else if ( $env['type'] === 'replicate' ) {
      $engine = new Meow_MWAI_Engines_Replicate( $core, $env );
      return $engine;
    }
    else if ( $env['type'] === 'perplexity' ) {
      $engine = new Meow_MWAI_Engines_Perplexity( $core, $env );
      return $engine;
    } 

    // Last chance via a filter.
    $engine = apply_filters( 'mwai_init_engine', null, $core, $env );
    if ( !is_null( $engine ) ) {
      return $engine;
    }

    throw new Exception( "AI Engine: Unknown engine type ({$env['type']})." );
  }

  public static function get_openai( $core, $envId = null ) : Meow_MWAI_Engines_OpenAI {
    $env = self::get_env_from_type( $core, [ 'openai', 'azure' ], $envId );
    $engine = Meow_MWAI_Engines_OpenAI::create( $core, $env );
    return $engine;
  }

}
