<?php

class Meow_MWAI_Engines_OpenRouter extends Meow_MWAI_Engines_OpenAI
{

  public function __construct( $core, $env )
  {
    parent::__construct( $core, $env );
  }

  protected function set_environment() {
    $env = $this->env;
    $this->apiKey = $env['apikey'];
    if ( $this->envType === 'openrouter' ) {
      $this->endpoint = apply_filters( 'mwai_openrouter_endpoint', 'https://openrouter.ai/api/v1', $this->env );
    }
    else {
      throw new Exception( 'Unknown environment type: ' . $this->envType );
    }
  }

  protected function build_headers( $query ) {
    parent::build_headers( $query );
    $site_url = apply_filters( 'mwai_openrouter_site_url', get_site_url(), $query );
    $site_name = apply_filters( 'mwai_openrouter_site_name', get_bloginfo( 'name' ), $query );
    $headers = array(
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer ' . $this->apiKey,
      'HTTP-Referer' => $site_url,
      'X-Title' => $site_name,
      'User-Agent' => 'AI Engine',
    );
    return $headers;
  }

  private function truncate_float( $number, $precision = 4 ) {
    $factor = pow( 10, $precision );
    return floor( $number * $factor ) / $factor;
  }

  protected function get_service_name() {
    return "OpenRouter";
  }

  public function get_models() {
    return $this->core->get_option( 'openrouter_models' );
  }

  public function handle_tokens_usage( $reply, $query, $returned_model, $returned_in_tokens, $returned_out_tokens ) {
    $returned_in_tokens = !is_null( $returned_in_tokens ) ? $returned_in_tokens : $reply->get_in_tokens( $query );
    $returned_out_tokens = !is_null( $returned_out_tokens ) ? $returned_out_tokens : $reply->get_out_tokens();

    // This is how to retrieve the exact number of tokens used with OpenRouter.
    // However, it doesn't work with streaming and it slows the request.

    if ( !empty( $reply->id ) ) {
      $url = 'https://openrouter.ai/api/v1/generation?id=' . $reply->id;
      try {

        // This is the CURL way
        // $ch = curl_init();
        // curl_setopt( $ch, CURLOPT_URL, $url );
        // curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
        // curl_setopt( $ch, CURLOPT_HTTPHEADER, [ 'Authorization: Bearer ' . $this->apiKey ] );
        // curl_setopt( $ch, CURLOPT_USERAGENT, 'AI Engine' );
        // $res = curl_exec( $ch );
        // curl_close( $ch );
        // $res = json_decode( $res, true );

        // This is the WordPress way
        // It currently doesn't work with OpenRouter (for mysterious reasons)
        // $res = wp_remote_get( $url, array(
        //   'headers' => array(
        //     'Authorization' => 'Bearer ' . $this->apiKey,
        //     'User-Agent' => 'AI Engine',
        //     'Accept' => 'application/json',
        //   ),
        //   'sslverify' => false,
        //   'user-agent' => 'AI Engine',
        //   'timeout' => 30,
        //   'blocking' => false,
        // ) );

        if ( isset( $res['data'] ) ) {
          $data = $res['data'];
          $returned_model = $data['model'];
          $returned_in_tokens = $data['tokens_prompt'];
          $returned_out_tokens = $data['tokens_completion'];
          $price = $res['usage'];
          $usage = $this->core->record_tokens_usage( $returned_model, $returned_in_tokens, $returned_out_tokens );
          $reply->set_usage( $usage );
          return;
        }
      }
      catch ( Exception $e ) {
        error_log( $e->getMessage() );
      }
    }

    $usage = $this->core->record_tokens_usage( $returned_model, $returned_in_tokens, $returned_out_tokens );
    $reply->set_usage( $usage );
  }

  public function get_price( Meow_MWAI_Query_Base $query, Meow_MWAI_Reply $reply ) {
    return parent::get_price( $query, $reply );
  }

  public function retrieve_models() {
    $url = 'https://openrouter.ai/api/v1/models';
    $response = wp_remote_get( $url );
    if ( is_wp_error( $response ) ) {
      throw new Exception( 'AI Engine: ' . $response->get_error_message() );
    }
    $body = json_decode( $response['body'], true );
    $models = array();
    foreach ( $body['data'] as $model ) {
      $family = "n/a";
      $maxCompletionTokens = 4096;
      $maxContextualTokens = 8096;
      $priceIn = 0;
      $priceOut = 0;
      $family = explode( '/', $model['id'] )[0];
      if ( isset( $model['top_provider']['max_completion_tokens'] ) ) {
        $maxCompletionTokens = (int)$model['top_provider']['max_completion_tokens'];
      }
      if ( isset( $model['context_length'] ) ) {
        $maxContextualTokens = (int)$model['context_length'];
      }
      if ( isset( $model['pricing']['prompt'] ) && $model['pricing']['prompt'] > 0 ) {
        $priceIn = floatval( $model['pricing']['prompt'] ) * 1000;
        $priceIn = $this->truncate_float( $priceIn );
      }
      if ( isset( $model['pricing']['completion'] ) && $model['pricing']['completion'] > 0 ) {
        $priceOut = floatval( $model['pricing']['completion'] ) * 1000;
        $priceOut = $this->truncate_float( $priceOut );
      }

      $tags = [ 'core', 'chat' ];
      // If the name contains (beta), (alpha) or (preview), add 'preview' tag and remove from name
      if ( preg_match( '/\((beta|alpha|preview)\)/i', $model['name'], $matches ) ) {
        $tags[] = 'preview';
        $model['name'] = preg_replace( '/\((beta|alpha|preview)\)/i', '', $model['name'] );
      }
      // If the name includes 'Vision', add 'vision' tag
      if ( preg_match( '/vision/i', $model['name'], $matches ) ) {
        $tags[] = 'vision';
      }
      $models[] = array(
        'model' => $model['id'],
        'name' => trim( $model['name'] ),
        'family' => $family,
        'mode' => 'chat',
        'price' => array(
          'in' => $priceIn,
          'out' => $priceOut,
        ),
        'type' => 'token',
		    'unit' => 1 / 1000,
        'maxCompletionTokens' => $maxCompletionTokens,
        'maxContextualTokens' => $maxContextualTokens,
        'tags' => $tags
      );
    }
    return $models; 
  }
}