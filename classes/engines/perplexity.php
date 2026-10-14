<?php

class Meow_MWAI_Engines_Perplexity extends Meow_MWAI_Engines_ChatML {
  // Streaming
  protected $streamInTokens = null;
  protected $streamOutTokens = null;
  protected $streamContent = null;
  protected $streamBuffer = null;
  protected $inCitations = null;

  public function __construct( $core, $env ) {
    parent::__construct( $core, $env );
  }

  protected function set_environment() {
    $env = $this->env;
    $this->apiKey = $env['apikey'] ?? null;
  }

  protected function get_service_name() {
    return 'Perplexity';
  }

  public function get_models() {
    return apply_filters( 'mwai_perplexity_models', MWAI_PERPLEXITY_MODELS );
  }

  public static function get_models_static() {
    return MWAI_PERPLEXITY_MODELS;
  }

  protected function build_url( $query, $endpoint = null ) {
    $endpoint = apply_filters( 'mwai_perplexity_endpoint', 'https://api.perplexity.ai', $this->env );
    return rtrim( $endpoint, '/' ) . '/chat/completions';
  }

  protected function build_messages( $query ) {
    $messages = parent::build_messages( $query );
    $filtered = [];
    $haveSeenUser = false;
    foreach ( $messages as $message ) {
      if ( !$haveSeenUser ) {
        if ( $message['role'] === 'assistant' ) {
          continue;
        }
        if ( $message['role'] === 'user' ) {
          $haveSeenUser = true;
        }
        $filtered[] = $message;
      }
      else {
        $filtered[] = $message;
      }
    }

    return $filtered;
  }

  protected function build_headers( $query ) {
    if ( $query->apiKey ) {
      $this->apiKey = $query->apiKey;
    }
    if ( empty( $this->apiKey ) ) {
      throw new Exception( 'No Perplexity API Key provided. Check your settings.' );
    }
    return [
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer ' . $this->apiKey,
      'User-Agent' => 'AI Engine',
    ];
  }

  protected function build_body( $query, $streamCallback = null, $extra = null ) {
    $body = parent::build_body( $query, $streamCallback, $extra );
    return $body;
  }

  public function reset_stream() {
    $this->inCitations = null;
    return parent::reset_stream();
  }

  // Let's override the stream handler only to capture the citations
  protected function stream_data_handler( $json ) {
    if ( isset( $json['citations'] ) ) {
      $this->inCitations = $json['citations'];
    }
    return parent::stream_data_handler( $json );
  }

  /**
  * In Perplexity, we intercept the final choices and insert citations
  * as ([domain1](https://...), [domain2](https://...))
  * based on [1][2][3] references in the text.
  */
  protected function finalize_choices( $choices, $responseData, $query ) {
    $citations = isset( $responseData['citations'] ) ? $responseData['citations'] : null;
    if ( empty( $citations ) && !empty( $this->inCitations ) ) {
      $citations = $this->inCitations;
    }
    if ( empty( $citations ) ) {
      return parent::finalize_choices( $choices, $responseData, $query );
    }

    foreach ( $choices as &$choice ) {
      if ( isset( $choice['message']['content'] ) && is_string( $choice['message']['content'] ) ) {
        $content = $choice['message']['content'];
        $content = preg_replace_callback( '/\[(\d+)\](?:\s*\[(\d+)\])*/', function ( $matches ) use ( $citations ) {
          preg_match_all( '/\[(\d+)\]/', $matches[0], $refs );
          $links = [];
          foreach ( $refs[1] as $refNumber ) {
            $index = (int) $refNumber - 1;
            if ( isset( $citations[$index] ) ) {
              $url = $citations[$index];
              $domain = parse_url( $url, PHP_URL_HOST );
              if ( !empty( $domain ) ) {
                $domain = str_replace( 'www.', '', $domain );
              }
              $links[] = '[' . $domain . '](' . $url . ')';
            }
          }
          // If we gathered at least one link, return them all in a parenthetical group
          // e.g. " ([google.com](https://google.com), [othersite.io](https://othersite.io))"
          // Otherwise, just return the original matches (fallback).
          return !empty( $links ) ? ' (' . implode( ', ', $links ) . ')' : $matches[0];
        }, $content );
        $choice['message']['content'] = $content;
      }
    }

    return $choices;
  }

  /**
   * Connection check for Perplexity API.
   * Perplexity retired Sonar's async Chat Completions on 2026-09-27, so the key is checked with
   * GET /v1/models first. The old async list stays as a fallback in case /v1/models is ever
   * unavailable on an account (written without a live key to test against).
   */
  public function connection_check() {
    try {
      $endpoint = apply_filters( 'mwai_perplexity_endpoint', 'https://api.perplexity.ai', $this->env );
      if ( empty( $this->apiKey ) ) {
        throw new Exception( 'No Perplexity API Key provided. Check your settings.' );
      }
      $options = [
        'headers' => [
          'Authorization' => 'Bearer ' . $this->apiKey,
          'User-Agent' => 'AI Engine',
        ],
        'method' => 'GET',
        'timeout' => 10,
        'sslverify' => MWAI_SSL_VERIFY
      ];

      $verified = false;
      foreach ( [ '/v1/models', '/async/chat/completions?limit=1' ] as $path ) {
        $response = wp_remote_get( rtrim( $endpoint, '/' ) . $path, $options );
        if ( is_wp_error( $response ) ) {
          throw new Exception( $response->get_error_message() );
        }
        $code = (int) wp_remote_retrieve_response_code( $response );
        $data = json_decode( wp_remote_retrieve_body( $response ), true );
        if ( $code === 200 && is_array( $data ) ) {
          $verified = true;
          break;
        }
        // A missing route means "try the next one"; anything else (a bad key, a quota) is the answer.
        if ( !in_array( $code, [ 404, 405, 410 ], true ) ) {
          $message = $data['error']['message'] ?? ( 'HTTP ' . $code );
          throw new Exception( $message );
        }
      }
      if ( !$verified ) {
        throw new Exception( 'Invalid response from Perplexity API' );
      }

      // Get available models from our constants
      $models = $this->get_models();
      $modelNames = array_map( function( $model ) {
        return $model['model'] ?? $model['name'] ?? 'unknown';
      }, array_slice( $models, 0, 5 ) );
      
      return [
        'success' => true,
        'service' => 'Perplexity',
        'message' => 'Connection successful',
        'details' => [
          'endpoint' => $endpoint,
          'model_count' => count( $models ),
          'sample_models' => $modelNames
        ]
      ];
    }
    catch ( Exception $e ) {
      throw new Exception( 'Perplexity connection failed: ' . $e->getMessage() );
    }
  }

}
