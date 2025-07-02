<?php

trait Meow_MWAI_Engines_Trait_Azure {
  /**
  * Check if environment is Azure
  */
  protected function is_azure( $env ) {
    return isset( $env['type'] ) && $env['type'] === 'azure';
  }

  /**
  * Build Azure endpoint URL
  */
  protected function build_azure_url( $env, $endpoint, $model = null ) {
    $url = trailingslashit( $env['endpoint'] );

    // Add deployment name if model is provided
    if ( $model && !empty( $env['deployments'] ) ) {
      $deployment = $this->get_azure_deployment( $env, $model );
      if ( $deployment ) {
        $url .= 'openai/deployments/' . $deployment . '/';
      }
    }

    // Add the endpoint
    $url .= $endpoint;

    // Add API version
    if ( !empty( $env['apiversion'] ) ) {
      $url .= '?api-version=' . $env['apiversion'];
    }

    return $url;
  }

  /**
  * Get Azure deployment name for a model
  */
  protected function get_azure_deployment( $env, $model ) {
    if ( empty( $env['deployments'] ) ) {
      return $model;
    }

    foreach ( $env['deployments'] as $deployment ) {
      if ( $deployment['model'] === $model ) {
        return $deployment['name'];
      }
    }

    // Default to model name if no deployment found
    return $model;
  }

  /**
  * Build Azure headers
  */
  protected function build_azure_headers( $env, $headers = [] ) {
    if ( !empty( $env['apikey'] ) ) {
      $headers['api-key'] = $env['apikey'];
    }

    // Azure requires Content-Type
    if ( !isset( $headers['Content-Type'] ) ) {
      $headers['Content-Type'] = 'application/json';
    }

    return $headers;
  }

  /**
  * Transform body for Azure compatibility
  */
  protected function transform_for_azure( $body, $env ) {
    // Azure doesn't support certain OpenAI-specific parameters
    $unsupported = [ 'logit_bias', 'user' ];
    foreach ( $unsupported as $param ) {
      if ( isset( $body[$param] ) ) {
        unset( $body[$param] );
      }
    }

    // Azure uses deployment names instead of model names
    if ( isset( $body['model'] ) ) {
      unset( $body['model'] );
    }

    return $body;
  }
}
