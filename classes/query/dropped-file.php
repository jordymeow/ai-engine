<?php

class Meow_MWAI_Query_DroppedFile {
  private $data;
  private $rawData;
  private $type; // Defines what the data is about ('refId', 'url', or 'data')
  private $purpose; // Can be 'assistant', 'vision' or 'files' => this needs to be checked
  private $mimeType; // 'image/jpeg' or any other mime type
  private $fileId; // The ID of the file in the database
  public $originalPath; // The original file path (for files loaded from disk)

  /**
   * Fetch content from a URL, handling internal vs external URLs differently.
   * Internal URLs (same site) use wp_remote_get to avoid SSRF blocking issues.
   * External URLs use wp_safe_remote_get for SSRF protection.
   */
  private static function fetch_url_content( $url ) {
    $parts = wp_parse_url( $url );
    if ( !isset( $parts['scheme'] ) || !in_array( $parts['scheme'], [ 'http', 'https' ], true ) ) {
      throw new Exception( 'Invalid URL scheme; only HTTP/HTTPS allowed.' );
    }

    // Check if internal URL by comparing hostnames (handles http/https mismatch)
    $site_host = wp_parse_url( get_site_url(), PHP_URL_HOST );
    $url_host = wp_parse_url( $url, PHP_URL_HOST );
    $is_internal = ( $site_host === $url_host );

    if ( $is_internal ) {
      $response = wp_remote_get( $url, [ 'timeout' => 60, 'sslverify' => false ] );
    }
    else {
      // SSRF protection for external URLs
      $response = wp_safe_remote_get( $url, [ 'timeout' => 60, 'redirection' => 0 ] );
    }

    if ( is_wp_error( $response ) ) {
      throw new Exception( 'AI Engine: Failed to download file: ' . $response->get_error_message() );
    }

    $data = wp_remote_retrieve_body( $response );
    if ( empty( $data ) ) {
      throw new Exception( 'AI Engine: Failed to download file contents from URL.' );
    }

    return $data;
  }

  public static function from_url( $url, $purpose, $mimeType = null, $fileId = null ) {
    if ( empty( $mimeType ) ) {
      $mimeType = Meow_MWAI_Core::get_mime_type( $url );
    }
    return new Meow_MWAI_Query_DroppedFile( $url, 'url', $purpose, $mimeType, $fileId );
  }

  public static function from_data( $data, $purpose, $mimeType = null ) {
    return new Meow_MWAI_Query_DroppedFile( $data, 'data', $purpose, $mimeType );
  }

  public static function from_path( $path, $purpose, $mimeType = null ) {
    // Sanitize path to prevent PHAR deserialization attacks
    $path = Meow_MWAI_Core::sanitize_file_path( $path );
    $data = file_get_contents( $path );
    if ( empty( $mimeType ) ) {
      $mimeType = Meow_MWAI_Core::get_mime_type( $path );
    }
    $droppedFile = new Meow_MWAI_Query_DroppedFile( $data, 'data', $purpose, $mimeType );
    // Store the original path for filename extraction
    $droppedFile->originalPath = $path;
    return $droppedFile;
  }

  public static function from_refId( $refId, $purpose, $mimeType = null ) {
    return new Meow_MWAI_Query_DroppedFile( $refId, 'refId', $purpose, $mimeType );
  }

  /**
   * Create DroppedFile from provider file_id reference (OpenAI, Anthropic, etc.)
   *
   * For PDFs uploaded to provider Files APIs, we only store the file_id
   * Examples: OpenAI 'file-xxx', Anthropic 'file_xxx'
   * These are reference-only - the file data lives on the provider's servers
   * Do NOT try to load file data from these - use get_refId() to get the file_id
   */
  public static function from_provider_file_id( $fileId, $purpose, $mimeType = null ) {
    return new Meow_MWAI_Query_DroppedFile( $fileId, 'provider_file_id', $purpose, $mimeType );
  }

  /**
   * @deprecated Use from_provider_file_id() instead
   * TODO: Remove after March 2026 - Legacy method
   */
  public static function from_openai_file_id( $fileId, $purpose, $mimeType = null ) {
    return self::from_provider_file_id( $fileId, $purpose, $mimeType );
  }

  public function __construct( $data, $type, $purpose, $mimeType = null, $fileId = null ) {
    // TODO: Remove after March 2026 - Legacy type support
    if ( $type === 'openai_file_id' ) {
      $type = 'provider_file_id';
    }
    if ( !empty( $type ) && $type !== 'refId' && $type !== 'url' && $type !== 'data' && $type !== 'provider_file_id' ) {
      throw new Exception( 'AI Engine: The file type can only be refId, url, data, or provider_file_id.' );
    }
    // TODO: Remove after March 2026 - Legacy purpose mapping
    $legacyPurposes = [ 'vision', 'files', 'transcription', 'code_execution', 'assistant-in' ];
    if ( in_array( $purpose, $legacyPurposes, true ) ) {
      $purpose = 'analysis';
    }
    if ( !empty( $purpose ) && $purpose !== 'analysis' && $purpose !== 'generated' ) {
      throw new Exception( 'AI Engine: The file purpose can only be analysis or generated.' );
    }
    $this->data = $data;
    $this->type = $type;
    $this->purpose = $purpose;
    $this->mimeType = $mimeType;
    $this->fileId = $fileId;
  }

  public function get_url() {
    if ( $this->type === 'url' ) {
      return $this->data;
    }
    throw new Exception( 'AI Engine: The file is not an URL.' );
  }

  private function get_raw_data() {
    if ( !empty( $this->rawData ) ) {
      return $this->rawData;
    }
    if ( $this->type === 'provider_file_id' ) {
      // Provider file IDs are reference-only (file data lives on provider's servers)
      // Common mistake: trying to load file data for PDFs in conversation history
      // Fix: Check file mime type before calling get_data()/get_base64()/get_inline_base64_url()
      // For PDFs: use get_refId() to get the file_id string instead
      throw new Exception( 'AI Engine: Cannot get raw data for provider file ID (file_id: ' . $this->data . '). Use get_refId() instead.' );
    }
    if ( $this->type === 'refId' ) {
      global $mwai_core;

      // Prefer loading from disk to avoid HTTP rewrites or CDN issues
      $path = $mwai_core->files->get_path( $this->data );
      if ( !empty( $path ) ) {
        $path = Meow_MWAI_Core::sanitize_file_path( $path );
        if ( file_exists( $path ) && is_readable( $path ) ) {
          $data = file_get_contents( $path );
          if ( $data === false ) {
            throw new Exception( 'AI Engine: Failed to read file contents for refId: ' . $this->data );
          }
          $this->rawData = $data;
          return $this->rawData;
        }
      }

      // Fallback to the public URL if the local path is unavailable
      $url = $mwai_core->files->get_url( $this->data );
      if ( empty( $url ) ) {
        throw new Exception( 'AI Engine: Could not find file URL for refId: ' . $this->data );
      }
      $this->rawData = self::fetch_url_content( $url );
      return $this->rawData;
    }
    else if ( $this->type === 'url' ) {
      // For internal URLs, try to read from disk first (more efficient)
      $site_host = wp_parse_url( get_site_url(), PHP_URL_HOST );
      $url_host = wp_parse_url( $this->data, PHP_URL_HOST );
      if ( $site_host === $url_host ) {
        $upload_dir = wp_upload_dir();
        // Normalize protocols for comparison (http vs https)
        $normalized_url = preg_replace( '/^https?:/', '', $this->data );
        $normalized_upload_url = preg_replace( '/^https?:/', '', $upload_dir['baseurl'] );
        if ( strpos( $normalized_url, $normalized_upload_url ) === 0 ) {
          $local_path = str_replace( $normalized_upload_url, $upload_dir['basedir'], $normalized_url );
          $local_path = Meow_MWAI_Core::sanitize_file_path( $local_path );
          if ( file_exists( $local_path ) && is_readable( $local_path ) ) {
            $this->rawData = file_get_contents( $local_path );
            if ( $this->rawData !== false ) {
              return $this->rawData;
            }
          }
        }
      }

      // Fetch via HTTP (handles internal vs external URLs with SSRF protection)
      $this->rawData = self::fetch_url_content( $this->data );
      return $this->rawData;
    }
    else if ( $this->type === 'data' ) {
      return $this->data;
    }
    throw new Exception( 'AI Engine: The file is not data or an URL.' );
  }

  public function get_data() {
    if ( $this->type === 'provider_file_id' ) {
      // Provider file IDs are just references, no data loading needed
      throw new Exception( 'AI Engine: Cannot get data for provider file ID. Use get_refId() instead.' );
    }
    if ( $this->type === 'refId' || $this->type === 'url' ) {
      return $this->get_raw_data();
    }
    else if ( $this->type === 'data' ) {
      return $this->data;
    }
    throw new Exception( 'AI Engine: The file is not data or an URL.' );
  }

  public function get_base64() {
    $data = $this->get_raw_data();
    return base64_encode( $data );
  }

  // Will return something like "data:image/jpeg;base64,{data}"
  public function get_inline_base64_url() {
    $b64 = $this->get_base64();
    return "data:{$this->mimeType};base64,{$b64}";
  }

  public function get_type() {
    return $this->type;
  }

  public function get_purpose() {
    return $this->purpose;
  }

  public function get_mimeType() {
    return $this->mimeType;
  }

  public function is_image() {
    return strpos( $this->mimeType, 'image' ) !== false;
  }

  public function get_fileId() {
    return $this->fileId;
  }

  public function get_refId() {
    if ( $this->type === 'refId' || $this->type === 'provider_file_id' ) {
      return $this->data;
    }
    return null;
  }

  // Return a filename for this file. If the file is an URL, use the basename of
  // its path. If the file is raw data, generate a generic name based on the mime type.
  public function get_filename() {
    // If we have an original path (from from_path), use its basename
    if ( !empty( $this->originalPath ) ) {
      return basename( $this->originalPath );
    }
    if ( $this->type === 'refId' ) {
      global $mwai_core;
      $path = $mwai_core->files->get_path( $this->data );
      return basename( $path );
    }
    if ( $this->type === 'url' ) {
      $path = parse_url( $this->data, PHP_URL_PATH );
      return basename( $path );
    }
    if ( $this->type === 'data' ) {
      if ( !empty( $this->mimeType ) ) {
        $parts = explode( '/', $this->mimeType );
        $ext = end( $parts );
        return 'file.' . $ext;
      }
      return 'file.bin';
    }
    return 'file';
  }
}
