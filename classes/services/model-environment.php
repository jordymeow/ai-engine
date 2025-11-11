<?php

class Meow_MWAI_Services_ModelEnvironment {
  private $core;

  public function __construct( $core ) {
    $this->core = $core;
  }

  public function validate_env_model( $query ) {
    if ( !$query || !is_object( $query ) ) {
      throw new Exception( 'Invalid query object provided to validate_env_model.' );
    }

    // The query object uses envId (string ID) for the environment
    $env = $query->envId ?? null;
    $model = $query->model;
    
    // For assistant queries with a valid envId already set, respect it
    if ( $query instanceof Meow_MWAI_Query_Assistant && !empty( $env ) && !empty( $query->assistantId ) ) {
      // Set model to 'n/a' for assistants since they don't need a model
      if ( empty( $model ) ) {
        $query->model = 'n/a';
      }
      return;
    }

    if ( empty( $env ) && empty( $model ) ) {
      // Use specialized defaults based on query type
      if ( $query instanceof Meow_MWAI_Query_Image ) {
        $this->set_default_env_and_model( $query, 'ai_images_default_env', 'ai_images_default_model' );
      }
      else if ( $query instanceof Meow_MWAI_Query_Transcribe ) {
        $this->set_default_env_and_model( $query, 'ai_audio_default_env', 'ai_audio_default_model' );
      }
      else if ( $query instanceof Meow_MWAI_Query_Embed ) {
        $this->set_default_env_and_model( $query, 'ai_embeddings_default_env', 'ai_embeddings_default_model' );
      }
      else {
        $this->set_default_env_and_model( $query, 'ai_default_env', 'ai_default_model' );
      }
    }
    else if ( empty( $env ) && !empty( $model ) ) {
      // If the model is available in the list of models, we can use it
      $envs = $this->core->get_option( 'ai_envs' );
      $models = $this->core->get_option( 'ai_models' );

      // First check custom models
      if ( !empty( $models ) ) {
        foreach ( $models as $currentModel ) {
          if ( $currentModel['model'] === $model && isset( $currentModel['envId'] ) ) {
            $query->envId = $currentModel['envId'];
            // Note: Don't set $query->env here as it expects an object, not a string
            $query->model = $currentModel['model'];
            return;
          }
        }
      }

      // Then check models in environments
      foreach ( $envs as $envId => $env ) {
        if ( isset( $env['models'] ) ) {
          foreach ( $env['models'] as $envModel ) {
            if ( $envModel['model'] === $model ) {
              $query->envId = $envId;
              // Note: Don't set $query->env here as it expects an object, not a string
              $query->model = $model;
              return;
            }
          }
        }
      }

      throw new Exception( 'The environment is required.' );
    }
    else if ( !empty( $env ) && empty( $model ) ) {
      // EnvId is set but model is empty - get first model from selected environment
      $envData = $this->get_ai_env( $env );
      if ( !empty( $envData['models'] ) && is_array( $envData['models'] ) ) {
        $firstModel = reset( $envData['models'] );
        if ( !empty( $firstModel['model'] ) ) {
          $query->model = $firstModel['model'];
          return;
        }
      }

      // Fallback: if environment has no models, try type-specific defaults
      if ( $query instanceof Meow_MWAI_Query_Image ) {
        $this->set_default_model_only( $query, 'ai_images_default_model' );
      }
      else if ( $query instanceof Meow_MWAI_Query_Transcribe ) {
        $this->set_default_model_only( $query, 'ai_audio_default_model' );
      }
      else if ( $query instanceof Meow_MWAI_Query_Embed ) {
        $this->set_default_model_only( $query, 'ai_embeddings_default_model' );
      }
      else {
        $this->set_default_model_only( $query, 'ai_default_model' );
      }
    }
    else {
      // We have both, let's continue
    }
  }

  private function set_default_env_and_model( $query, $envOption, $modelOption ) {
    $env = $this->core->get_option( $envOption );
    $model = $this->core->get_option( $modelOption );
    if ( !empty( $env ) ) {
      // Use envId property which is what the query object uses
      $query->envId = $env;
      // Note: Don't set $query->env here as it expects an object, not a string
    }
    if ( !empty( $model ) ) {
      $query->model = $model;
    }
  }

  private function set_default_model_only( $query, $modelOption ) {
    // Only set the model, preserve existing envId
    $model = $this->core->get_option( $modelOption );
    if ( !empty( $model ) ) {
      $query->model = $model;
    }
  }

  public function get_embeddings_env( $envId = null ) {
    // Use provided envId or fall back to default
    if ( empty( $envId ) ) {
      $envId = $this->core->get_option( 'embeddings_default_env' );
    }
    
    // Get embeddings environments (not AI environments)
    $envs = $this->core->get_option( 'embeddings_envs' );
    if ( !empty( $envs ) ) {
      foreach ( $envs as $env ) {
        if ( isset( $env['id'] ) && $env['id'] === $envId ) {
          return $env;
        }
      }
    }
    
    return null;
  }

  public function get_ai_env( $envId ) {
    $envs = $this->core->get_option( 'ai_envs' );
    if ( !empty( $envs ) ) {
      foreach ( $envs as $env ) {
        if ( isset( $env['id'] ) && $env['id'] === $envId ) {
          return $env;
        }
      }
    }
    return null;
  }

  public function get_assistant( $envId, $assistantId ) {
    $env = $this->get_ai_env( $envId );
    if ( isset( $env['assistants'] ) ) {
      foreach ( $env['assistants'] as $assistant ) {
        if ( $assistant['id'] === $assistantId ) {
          return $assistant;
        }
      }
    }
    return null;
  }

  public function get_engine_models( $query ) {
    $envId = $query->envId;
    $env = $this->get_ai_env( $envId );
    $models = apply_filters( 'mwai_engine_models', [], $env, $query );
    return $models;
  }
}
