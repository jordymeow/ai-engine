<?php

use Yethee\Tiktoken\Vocab\Vocab;
use Yethee\Tiktoken\Vocab\VocabLoader;

/**
 * Fetches the Tiktoken vocab through the WordPress HTTP API instead of the library's
 * fopen( 'https://...' ), which emits a PHP warning and fails on hosts with allow_url_fopen = 0.
 * The cache file name matches the library's own (sha1 of the URI), so existing caches keep working.
 */
class Meow_MWAI_Services_TiktokenVocabLoader implements VocabLoader {
  private $cacheDir;

  public function __construct( $cacheDir ) {
    $this->cacheDir = $cacheDir;
  }

  public function load( string $uri ): Vocab {
    if ( !preg_match( '@^https?://@i', $uri ) ) {
      return Vocab::fromFile( $uri );
    }

    $cacheFile = $this->cacheDir . DIRECTORY_SEPARATOR . sha1( $uri );
    if ( file_exists( $cacheFile ) ) {
      return Vocab::fromFile( $cacheFile );
    }

    if ( !is_dir( $this->cacheDir ) && !@mkdir( $this->cacheDir, 0750, true ) ) {
      throw new RuntimeException( "Directory does not exist and cannot be created: {$this->cacheDir}" );
    }
    if ( !is_writable( $this->cacheDir ) ) {
      throw new RuntimeException( "Directory is not writable: {$this->cacheDir}" );
    }

    $tmpFile = $cacheFile . '.' . wp_generate_password( 8, false ) . '.tmp';
    $response = wp_remote_get( $uri, [
      'timeout' => 60,
      'stream' => true,
      'filename' => $tmpFile,
    ] );

    if ( is_wp_error( $response ) ) {
      @unlink( $tmpFile );
      throw new RuntimeException( "Could not download vocab from {$uri}: " . $response->get_error_message() );
    }
    $code = wp_remote_retrieve_response_code( $response );
    if ( $code !== 200 || !file_exists( $tmpFile ) || filesize( $tmpFile ) === 0 ) {
      @unlink( $tmpFile );
      throw new RuntimeException( "Could not download vocab from {$uri} (HTTP {$code})." );
    }

    if ( !@rename( $tmpFile, $cacheFile ) ) {
      @unlink( $tmpFile );
      throw new RuntimeException( "Could not write vocab cache file: {$cacheFile}" );
    }

    return Vocab::fromFile( $cacheFile );
  }
}
