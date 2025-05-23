<?php

class Meow_MWAI_Engines_HuggingFace extends Meow_MWAI_Engines_ChatML
{

  public function __construct( $core, $env )
  {
    parent::__construct( $core, $env );
  }

  protected function set_environment() {
    $env = $this->env;
    $this->apiKey = $env['apikey'];
    if ( !$this->envType === 'huggingface' ) {
      throw new Exception( 'Unknown environment type: ' . $this->envType );
    }
  }

  protected function build_messages( $query ) {
    $messages = parent::build_messages( $query );

    // If the role is not either "user" or "assistant", we need to set it to "assistant".
    foreach ( $messages as &$message ) {
      if ( !in_array( $message['role'], array( 'user', 'assistant' ) ) ) {
        $message['role'] = 'assistant';
      }
    }

    $messages = $this->streamline_messages( $messages );
    return $messages;
  }

  protected function build_body( $query, $streamCallback = null, $extra = null ) {
    $body = parent::build_body( $query, $streamCallback );
    // To use "Text Generation Inference" (OpenAI's API) with HuggingFace, we need to specify TGI as the model.
    $body['model'] = 'tgi';
    // Certain OpenAI features, like function calling, are not compatible with TGI. Currently, the Messages API supports the following chat completion parameters: stream, max_tokens, frequency_penalty, logprobs, seed, temperature, and top_p. Let's remove everything else.
    $body = array_intersect_key( $body, array_flip( array( 'model', 'stream', 'max_tokens', 'frequency_penalty', 'logprobs', 'seed', 'temperature', 'top_p', 'messages' ) ) );
    return $body;
  }

  protected function build_url( $query, $endpoint = null ) {
    $model = $query->model;
    if ( isset( $this->env['customModels'] ) ) {
      foreach ( $this->env['customModels'] as $customModel ) {
        if ( $customModel['name'] === $model ) {
          $endpoint = $customModel['apiUrl']  . '/v1/';
          break;
        }
      }
    }
    if ( $endpoint === null ) {
      throw new Exception( 'Model not found for HuggingFace: ' . $model );
    }
    $url = parent::build_url( $query, $endpoint );
    return $url;
  }

  protected function build_headers( $query ) {
    parent::build_headers( $query );
    $headers = array(
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer ' . $this->apiKey,
      'User-Agent' => 'AI Engine',
    );
    return $headers;
  }

  protected function get_service_name() {
    return "HuggingFace";
  }

  public function get_models() {
    $models = [];
    if ( isset( $this->env['customModels'] ) ) {
      foreach ( $this->env['customModels'] as $model ) {
        $tags = isset( $model['tags'] ) ? $model['tags'] : [];
        if ( !in_array( 'core', $tags ) ) {
          $tags[] = 'core';
        }
        if ( !in_array( 'chat', $tags ) ) {
          $tags[] = 'chat';
        }
        $features = in_array( 'image', $tags ) ? ['text-to-image'] : ['completion'];
        $models[] = array(
          'model' => $model['name'],
          'name' => $model['name'],
          'features' => $features,
          'tags' => $tags,
        );
      }
    }
    return $models;
  }

  public function get_price( Meow_MWAI_Query_Base $query, Meow_MWAI_Reply $reply ) {
    return null;
  }

  // Check if there are errors in the response from OpenAI, and throw an exception if so.
  protected function handle_response_errors( $data ) {
    if ( isset( $data['error'] ) ) {
      $message = $data['error'];
      if ( is_array( $message ) ) {
        $message = $message['message'];
      }
      if ( preg_match( '/API key provided(: .*)\./', $message, $matches ) ) {
        $message = str_replace( $matches[1], '', $message );
      }
      throw new Exception( $message );
    }
  }
}