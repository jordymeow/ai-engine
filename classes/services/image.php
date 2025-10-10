<?php

class Meow_MWAI_Services_Image {
  private $core;

  public function __construct( $core ) {
    $this->core = $core;
  }

  public function is_image( $mimeType ) {
    return strpos( $mimeType, 'image/' ) === 0;
  }

  public function get_image_resolution( $imageData ) {
    try {
      $tempFile = tmpfile();
      $tempFilePath = stream_get_meta_data( $tempFile )['uri'];
      fwrite( $tempFile, $imageData );
      $imageSize = getimagesize( $tempFilePath );
      fclose( $tempFile );
      if ( $imageSize !== false ) {
        return $imageSize[0] . 'x' . $imageSize[1];
      }
    }
    catch ( Exception $e ) {
      throw new Exception( 'Failed to get image resolution.' );
    }
    return null;
  }

  public function get_mime_type( $file, $fileData = null ) {
    $mimeType = null;

    // If we have file data, let's use it
    if ( !empty( $fileData ) ) {
      $f = finfo_open();
      $mimeType = finfo_buffer( $f, $fileData, FILEINFO_MIME_TYPE );
    }

    // Try to use mime_content_type for local files
    if ( !$mimeType ) {
      $isUrl = filter_var( $file, FILTER_VALIDATE_URL );
      if ( !$isUrl && function_exists( 'mime_content_type' ) && file_exists( $file ) ) {
        $mimeType = mime_content_type( $file );
      }
    }

    // Otherwise, let's check the file extension (which can actually also be an URL)
    if ( !$mimeType ) {
      $extension = pathinfo( $file, PATHINFO_EXTENSION );
      $extension = strtolower( $extension );
      $mimeTypes = [
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png' => 'image/png',
        'gif' => 'image/gif',
        'webp' => 'image/webp',
        'bmp' => 'image/bmp',
        'tiff' => 'image/tiff',
        'tif' => 'image/tiff',
        'svg' => 'image/svg+xml',
        'ico' => 'image/x-icon',
        'pdf' => 'application/pdf',
      ];
      $mimeType = isset( $mimeTypes[$extension] ) ? $mimeTypes[$extension] : null;
    }

    return $mimeType;
  }

  public function download_image( $url ) {
    // Handle data URLs (base64-encoded images from Google Gemini, etc.)
    if ( strpos( $url, 'data:' ) === 0 ) {
      // Extract base64 data from data URL
      // Format: data:image/png;base64,iVBORw0KGgoAAAANS...
      $parts = explode( ',', $url, 2 );
      if ( count( $parts ) !== 2 ) {
        throw new Exception( 'Invalid data URL format.' );
      }

      // Validate it's an image data URL
      if ( stripos( $parts[0], 'image/' ) === false ) {
        throw new Exception( 'Data URL is not an image.' );
      }

      // Decode base64 data
      $image_data = base64_decode( $parts[1] );
      if ( $image_data === false ) {
        throw new Exception( 'Failed to decode base64 image data.' );
      }

      return $image_data;
    }

    // Validate URL scheme (only allow http/https)
    $parsed_url = parse_url( $url );
    if ( empty( $parsed_url['scheme'] ) || !in_array( $parsed_url['scheme'], [ 'http', 'https' ] ) ) {
      throw new Exception( 'Invalid URL scheme. Only HTTP and HTTPS are allowed.' );
    }

    // Disable redirects to prevent bypass attacks
    $response = wp_safe_remote_get( $url, [
      'timeout' => 60,
      'redirection' => 0  // Prevent redirect-based bypass
    ] );

    if ( is_wp_error( $response ) ) {
      throw new Exception( $response->get_error_message() );
    }

    // Validate response is actually an image
    $content_type = wp_remote_retrieve_header( $response, 'content-type' );
    if ( empty( $content_type ) || stripos( $content_type, 'image/' ) !== 0 ) {
      throw new Exception( 'URL did not return an image. Content-Type: ' . $content_type );
    }

    return wp_remote_retrieve_body( $response );
  }

  /**
  * Add an image from a URL to the Media Library.
  * @param string $url The URL of the image to be downloaded.
  * @param string $filename The filename of the image, if not set, it will be the basename of the URL.
  * @param string $title The title of the image.
  * @param string $description The description of the image.
  * @param string $caption The caption of the image.
  * @param string $alt The alt text of the image.
  * @param array $ai_metadata AI-related metadata (model, latency, env_id).
  * @return int The attachment ID of the image.
  */
  public function add_image_from_url( $url, $filename = null, $title = null, $description = null, $caption = null, $alt = null, $attachedPost = null, $post_status = 'inherit', $post_type = 'attachment', $ai_metadata = [] ) {
    $path_parts = pathinfo( parse_url( $url, PHP_URL_PATH ) );
    $url_filename = $path_parts['basename'];
    $file_type = wp_check_filetype( $url_filename, null );
    $allowed_types = get_allowed_mime_types();

    // For URLs without file extensions (like Google Gemini), default to PNG
    $extension = 'png';
    if ( $file_type && $file_type['ext'] && in_array( $file_type['type'], $allowed_types ) ) {
      $extension = $file_type['ext'];
    }

    if ( !empty( $filename ) ) {
      $custom_file_type = wp_check_filetype( $filename, null );
      if ( !$custom_file_type || !in_array( $custom_file_type['type'], $allowed_types ) ) {
        throw new Exception( 'Invalid custom file type.' );
      }
      // Use the extension from the custom filename if valid
      $extension = $custom_file_type['ext'];
    }

    $image_data = $this->download_image( $url );
    if ( !$image_data ) {
      throw new Exception( 'Could not download the image.' );
    }
    $upload_dir = wp_upload_dir();

    // Filename handling including 'generated_' prefix scenario
    if ( empty( $filename ) ) {
      $filename = sanitize_file_name( $url_filename );
      if ( empty( $extension ) ) { // This condition might now be redundant
        $extension = $file_type['ext'];
      }
      // Filename length check and prepend if conditions met
      if ( strlen( $filename ) > 32 || strlen( $filename ) < 4 || strpos( $filename, 'generated_' ) === 0 ) {
        $filename = uniqid( 'ai_', true ) . '.' . $extension;
      }
      if ( strpos( $filename, '.' ) === false ) {
        $filename .= '.' . $extension;
      }
    }

    // Directory and file path handling
    if ( wp_mkdir_p( $upload_dir['path'] ) ) {
      $file = $upload_dir['path'] . '/' . $filename;
    }
    else {
      $file = $upload_dir['basedir'] . '/' . $filename;
    }

    // Ensure file name uniqueness in the directory
    $i = 1;
    $parts = pathinfo( $file );
    while ( file_exists( $file ) ) {
      $file = $parts['dirname'] . '/' . $parts['filename'] . '-' . $i . '.' . $parts['extension'];
      $i++;
    }

    // Write file to filesystem
    file_put_contents( $file, $image_data );

    // Prepare and insert attachment
    $wp_filetype = wp_check_filetype( basename( $file ), null );
    $attachment = [
      'post_mime_type' => $wp_filetype['type'],
      'post_title' => !is_null( $title ) ? $title : preg_replace( '/\.[^.]+$/', '', basename( $file ) ),
      'post_content' => !is_null( $description ) ? $description : '',
      'post_status' => $post_status,
      'post_excerpt' => !is_null( $caption ) ? $caption : '',
      'post_type' => $post_type,
    ];

    // Use wp_insert_post instead of wp_insert_attachment to allow custom post types
    $attach_id = wp_insert_post( $attachment );

    // Set the attached file manually since we're not using wp_insert_attachment
    update_attached_file( $attach_id, $file );
    require_once( ABSPATH . 'wp-admin/includes/image.php' );
    $attach_data = wp_generate_attachment_metadata( $attach_id, $file );
    wp_update_attachment_metadata( $attach_id, $attach_data );
    if ( !is_null( $alt ) ) {
      update_post_meta( $attach_id, '_wp_attachment_image_alt', $alt );
    }

    // Store AI-related metadata
    if ( !empty( $ai_metadata['model'] ) ) {
      update_post_meta( $attach_id, 'mwai_model', sanitize_text_field( $ai_metadata['model'] ) );
    }
    if ( !empty( $ai_metadata['latency'] ) ) {
      update_post_meta( $attach_id, 'mwai_latency', floatval( $ai_metadata['latency'] ) );
    }
    if ( !empty( $ai_metadata['env_id'] ) ) {
      update_post_meta( $attach_id, 'mwai_env_id', sanitize_text_field( $ai_metadata['env_id'] ) );
    }

    return $attach_id;
  }
}
