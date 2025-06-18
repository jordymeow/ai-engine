<?php

class Meow_MWAI_Modules_Files {
	private $core = null;
  private $wpdb = null;
	private $namespace = 'mwai-ui/v1';
  private $db_check = false;
  private $table_files = null;
  private $table_filemeta = null;

  public function __construct( $core ) {
		global $wpdb;
		$this->core = $core;
    $this->wpdb = $wpdb;
    $this->table_files = $this->wpdb->prefix . 'mwai_files';
    $this->table_filemeta = $this->wpdb->prefix . 'mwai_filemeta';
		add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
    if ( !wp_next_scheduled( 'mwai_files_cleanup' ) ) {
      wp_schedule_event( time(), 'hourly', 'mwai_files_cleanup' );
    }
    add_action( 'mwai_files_cleanup', [ $this, 'cleanup_expired_files' ] );
	}

  public function cleanup_expired_files() {
    $current_time = current_time( 'mysql' );
    $expired_files = [];
    if ( $this->check_db() ) {
      $expired_files = $this->wpdb->get_results( 
        "SELECT * FROM $this->table_files WHERE expires IS NOT NULL AND expires < '{$current_time}'"
      );
    }
    $expired_posts = get_posts( [
      'post_type' => 'attachment',
      'meta_key' => '_mwai_file_expires',
      'meta_value' => $current_time,
      'meta_compare' => '<'
    ] );
    $fileRefs = [];
    foreach ( $expired_files as $file ) {
      $fileRefs[] = $file->refId;
    }
    foreach ( $expired_posts as $post ) {
      $fileRefs[] = get_post_meta( $post->ID, '_mwai_file_id', true );
    }
    $this->delete_expired_files( $fileRefs );
  }

  public function delete_expired_files( $fileRefs ) {

    // Give a chance to other process to delete the files (for example, in the case of files hosted by Assistants)
    $fileRefs = apply_filters( 'mwai_files_delete', $fileRefs );

    if ( !is_array( $fileRefs ) ) {
      $fileRefs = [ $fileRefs ];
    }
    foreach ( $fileRefs as $refId ) {
      $file = null;
      if ( $this->check_db() ) {
        $file = $this->wpdb->get_row( $this->wpdb->prepare( "SELECT *
          FROM $this->table_files
          WHERE refId = %s", $refId
        ) );
      } 
      if ( $file ) {
        $this->wpdb->delete( $this->table_files, [ 'refId' => $refId ] );
        $this->wpdb->delete( $this->table_filemeta, [ 'file_id' => $file->id ] );
        if ( file_exists( $file->path ) ) {
          unlink( $file->path );
        }
      }
      else {
        $posts = get_posts( [ 'post_type' => 'attachment', 'meta_key' => '_mwai_file_id', 'meta_value' => $refId ] );
        if ( $posts ) {
          foreach ( $posts as $post ) {
            wp_delete_attachment( $post->ID, true );
          }
        }
      }
    }
  }

  public function get_path( $refId ) {
    $file = null;
    if ( $this->check_db() ) {
      $file = $this->wpdb->get_row( $this->wpdb->prepare( "SELECT *
        FROM $this->table_files
        WHERE refId = %s", $refId
      ) );
    }
    if ( $file ) {
      return $file->path;
    }
    else {
      $posts = get_posts( [ 'post_type' => 'attachment', 'meta_key' => '_mwai_file_id', 'meta_value' => $refId ] );
      if ( $posts ) {
        foreach ( $posts as $post ) {
          return get_attached_file( $post->ID );
        }
      }
    }
    return null;
  }

  public function get_base64_data( $refId ) {
    $path = $this->get_path( $refId );
    if ( $path ) {
      $content = file_get_contents( $path );
      $data = base64_encode( $content );
      return $data;
    }
    return null;
  }

  public function is_image( $refId ) {
    $info = $this->get_info( $refId );
    return $info['type'] === 'image';
  }

  public function get_mime_type( $refId ) {
    $path = $this->get_path( $refId );
    if ( $path ) {
      return Meow_MWAI_Core::get_mime_type( $path );
    }
    $url = $this->get_url( $refId );
    if ( $url ) {
      return Meow_MWAI_Core::get_mime_type( $url );
    }
    return null;
  }

  public function get_data( $refId ) {
    $path = $this->get_path( $refId );
    if ( $path ) {
      $content = file_get_contents( $path );
      return $content;
    }
    return null;
  }

  public function get_info( $refId ) {
    $info = null;
    if ( $this->check_db() ) {
      $info = $this->wpdb->get_row( $this->wpdb->prepare( "SELECT *
        FROM $this->table_files
        WHERE refId = %s", $refId
      ), ARRAY_A );
    }
    if ( !$info ) {
      $posts = get_posts( [ 'post_type' => 'attachment', 'meta_key' => '_mwai_file_id', 'meta_value' => $refId ] );
      if ( $posts ) {
        $post = $posts[0];
        $info = [
          'refId' => $refId,
          'url' => wp_get_attachment_url( $post->ID ),
          'path' => get_attached_file( $post->ID )
        ];
      }
    }
    if ( $info ) {
      $info['metadata'] = $this->get_metadata( $refId );
    }
    return $info;
  }

  public function get_url( $refId ) {
    $file = null;
    if ( $this->check_db() ) {
      $file = $this->wpdb->get_row( $this->wpdb->prepare( "SELECT *
        FROM $this->table_files
        WHERE refId = %s", $refId
      ) );
    }
    if ( $file ) {
      return $file->url;
    }
    else {
      $posts = get_posts( [ 'post_type' => 'attachment', 'meta_key' => '_mwai_file_id', 'meta_value' => $refId ] );
      if ( $posts ) {
        foreach ( $posts as $post ) {
          return wp_get_attachment_url( $post->ID );
        }
      }
    }
    return null;
  }

  /**
   * Handle a base-64 PNG returned by gpt-image-1: save as a temp file,
   * register it in the Files DB, and give back a public URL.
   *
   * @param string $b64_json  Raw base-64 image payload from OpenAI.
   * @param string $purpose   Optional purpose flag. Default 'generated'.
   * @param int    $ttl       Time-to-live in seconds. Default 1 hour.
   * @param string $target    Target location: 'uploads' or 'library'. Default 'uploads'.
   * @param array  $metadata  Additional metadata to store with the file.
   *
   * @return string|WP_Error Public URL or WP_Error on failure.
   */
  public function save_temp_image_from_b64( string $b64_json,
  string $purpose = 'generated', int $ttl = HOUR_IN_SECONDS, string $target = 'uploads', array $metadata = [] )
  {
    // 1) Decode → binary.
    $binary = base64_decode( $b64_json );
    if ( !$binary ) {
      return new WP_Error( 'mwai_bad_b64', 'Invalid base-64 payload.' );
    }

    // 2) Make a transient file in the server tmp dir.
    $tmp_path = wp_tempnam( 'mwai-image' );   // Creates an empty file.
    $filename = 'mwai-generated-' . time() . '-' . wp_generate_password( 8, false ) . '.png';
    file_put_contents( $tmp_path, $binary );

    // 3) Reuse the normal upload flow (target based on user preference, expiry = $ttl).
    try {
      // Extract envId from metadata if available
      $envId = isset( $metadata['query_envId'] ) ? $metadata['query_envId'] : null;
      
      $refId = $this->upload_file(
        $tmp_path,        // path on disk
        $filename,        // desired filename
        $purpose,         // purpose
        $metadata,        // metadata (now includes query info)
        $envId,           // envId from query
        $target,          // target (uploads or library based on user settings)
        $ttl              // expiry in seconds
      );
      // 4) Clean up temp file if it was uploaded to library (but not if uploads)
      // For uploads target, the temp file IS the final file
      if ( $target === 'library' && file_exists( $tmp_path ) ) {
        @unlink( $tmp_path );
      }
      
      // 5) Turn refId → URL.
      return $this->get_url( $refId );
    }
    catch ( Exception $e ) {
      // Clean up temp file on error
      if ( file_exists( $tmp_path ) ) {
        @unlink( $tmp_path );
      }
      return new WP_Error( 'mwai_upload_failed', $e->getMessage() );
    }
  }

  #region REST endpoints

  public function rest_api_init() {
		register_rest_route( $this->namespace, '/files/upload', array(
			'methods' => 'POST',
			'callback' => array( $this, 'rest_upload' ),
			'permission_callback' => array( $this->core, 'check_rest_nonce' )
		) );
    register_rest_route( $this->namespace, '/files/list', array(
			'methods' => 'POST',
			'callback' => array( $this, 'rest_list' ),
			'permission_callback' => array( $this->core, 'check_rest_nonce' )
		) );
    register_rest_route( $this->namespace, '/files/delete', array(
			'methods' => 'POST',
			'callback' => array( $this, 'rest_delete' ),
			'permission_callback' => array( $this->core, 'check_rest_nonce' )
		) );
	}


  /* 
  * Record a new file in the Files database.
  * This doesn't handle the upload or anything.
  */
  public function commit_file( $fileInfo ) {
    if ( !$this->check_db() ) {
      throw new Exception( 'Could not create database table.' );
    }
    $now = date( 'Y-m-d H:i:s' );
    if ( empty( $fileInfo['refId'] ) ) {
      if ( !empty( $fileInfo['url'] ) ) {
        $fileInfo['refId'] = $this->generate_refId( $fileInfo['url'] );
      }
      else {
        throw new Exception( 'File ID (or URL) is required.' );
      }
    }
    if ( empty( $fileInfo['type'] ) ) {
      $fileInfo['type'] = Meow_MWAI_Core::is_image( $fileInfo['url'] ) ? 'image' : 'file';
    }
    $success = $this->wpdb->insert( $this->table_files, [
      'refId' => $fileInfo['refId'],
      'envId' => empty( $fileInfo['envId'] ) ? null : $fileInfo['envId'],
      'userId' => empty( $fileInfo['userId'] ) ? $this->core->get_user_id() : $fileInfo['userId'],
      'purpose' => empty( $fileInfo['purpose'] ) ? null : $fileInfo['purpose'],
      'type' => empty( $fileInfo['type'] ) ? null : $fileInfo['type'],
      'status' => empty( $fileInfo['status'] ) ? null : $fileInfo['status'],
      'created' => empty( $fileInfo['created'] ) ? $now : $fileInfo['created'],
      'updated' => empty( $fileInfo['updated'] ) ? $now : $fileInfo['updated'],
      'expires' => empty( $fileInfo['expires'] ) ? null : $fileInfo['expires'],
      'path' => empty( $fileInfo['path'] ) ? null : $fileInfo['path'],
      'url' => empty( $fileInfo['url'] ) ? null : $fileInfo['url']
    ] );
    // check for error
    if ( !$success ) {
      throw new Exception( 'Error while adding file in the DB (' . $this->wpdb->last_error . ')' );
    }
    return $this->wpdb->insert_id;
  }

  // Generate a refId from a URL or random, and make sure it's unique
  public function generate_refId( $attempts = 0 ) {
    $refId = md5( date( 'Y-m-d H:i:s' ) . '-' . $attempts );
    $file = $this->wpdb->get_row( $this->wpdb->prepare( "SELECT *
        FROM $this->table_files
        WHERE refId = %s", $refId
      ) );
    if ( $file ) {
      return $this->generate_refId( $attempts + 1 );
    }
    return $refId;
  }

  public function upload_file( $path, $filename = null, $purpose = null,
    $metadata = null, $envId = null, $target = null, $expiry = null ) {
    require_once( ABSPATH . 'wp-admin/includes/image.php' );
    require_once( ABSPATH . 'wp-admin/includes/file.php' );
    require_once( ABSPATH . 'wp-admin/includes/media.php' );

    $target = empty( $target ) ? $this->core->get_option( 'image_local_upload' ) : $target;
    $expiry = empty( $expiry ) ? $this->core->get_option( 'image_expires' ) : $expiry;

    $expires = ( $expiry === 'never' || empty( $expiry ) ) ? null : date( 'Y-m-d H:i:s', time() + intval( $expiry ) );
    $refId = $this->generate_refId();
    $url = null;
    if ( empty( $filename ) ) {
      $parsed_url = parse_url( $path, PHP_URL_PATH );
      $filename = basename( $parsed_url );
      $extension = pathinfo( $filename, PATHINFO_EXTENSION );
    }
    else {
      $extension = pathinfo( $filename, PATHINFO_EXTENSION );
    }
    $newFilename = $refId . '.' . $extension;
    $unique_filename = wp_unique_filename( wp_upload_dir()['path'], $newFilename );
    $destination = wp_upload_dir()['path'] . '/' . $unique_filename;

    if ( $target === 'uploads' ) {
      if ( !$this->check_db() ) {
        throw new Exception( 'Could not create database table.' );
      }
      if ( !copy( $path, $destination ) ) {
        throw new Exception( 'Could not move the file.' );
      }
      $url = wp_upload_dir()['url'] . '/' . $unique_filename;
      
      $now = date( 'Y-m-d H:i:s' );
      $fileId = $this->commit_file( [
        'refId' => $refId,
        'envId' => $envId,
        'purpose' => $purpose,
        'type' => null,
        'status' => 'uploaded',
        'created' => $now,
        'updated' => $now,
        'expires' => $expires,
        'path' => $destination,
        'url' => $url
      ] );
      if ( $metadata && is_array( $metadata ) ) {
        foreach ( $metadata as $metaKey => $metaValue ) {
          $this->add_metadata( $fileId, $metaKey, $metaValue );
        }
      }
      
    }
    else if ( $target === 'library' ) {
      
      if ( filter_var( $path, FILTER_VALIDATE_URL ) ) {
        $tmp = download_url( $path );
        if ( is_wp_error( $tmp ) ) {
            throw new Exception( $tmp->get_error_message() );
        }
        $file_array = [ 'name' => $unique_filename, 'tmp_name' => $tmp ];
      }
      else {
        $file_array = [ 'name' => $unique_filename, 'tmp_name' => $path ];
      }
      
      
      $id = media_handle_sideload( $file_array, 0 );
      if ( is_wp_error( $id ) ) {
        throw new Exception( $id->get_error_message() );
      }
      
      $url = wp_get_attachment_url( $id );
      update_post_meta( $id, '_mwai_file_id', $refId );
      update_post_meta( $id, '_mwai_file_expires', $expires );
      
      // Store additional metadata
      if ( $metadata && is_array( $metadata ) ) {
        foreach ( $metadata as $metaKey => $metaValue ) {
          update_post_meta( $id, '_mwai_' . $metaKey, $metaValue );
        }
      }
      
      // Store purpose and envId as post meta
      if ( $purpose ) {
        update_post_meta( $id, '_mwai_purpose', $purpose );
      }
      if ( $envId ) {
        update_post_meta( $id, '_mwai_envId', $envId );
      }
    }

    return $refId;
  }

  public function add_metadata( $fileId, $metaKey, $metaValue ) {
    $data = [
      'file_id' => $fileId,
      'meta_key' => $metaKey,
      'meta_value' => $metaValue
    ];
    $res = $this->wpdb->insert( $this->table_filemeta, $data );
    if ( $res === false ) {
      Meow_MWAI_Logging::warn( "Error while writing files metadata (" . $this->wpdb->last_error . ")" );
      return false;
    }
    return $this->wpdb->insert_id;
  }

  public function update_refId( $fileId, $refId ) {
    if ( $this->check_db() ) {
      $this->wpdb->update( $this->table_files, [ 'refId' => $refId ], [ 'id' => $fileId ] );
    }
  }

  public function update_purpose( $fileId, $purpose ) {
    if ( $this->check_db() ) {
      $this->wpdb->update( $this->table_files, [ 'purpose' => $purpose ], [ 'id' => $fileId ] );
    }
  }

  public function update_envId( $fileId, $envId ) {
    if ( $this->check_db() ) {
      $this->wpdb->update( $this->table_files, [ 'envId' => $envId ], [ 'id' => $fileId ] );
    }
  }

  public function get_metadata( $refId, $fileId = null ) {
    if ( !$fileId ) {
      $fileId = $this->get_id_from_refId( $refId );
    }
    if ( $fileId ) {
      $sql = $this->wpdb->prepare( "SELECT * FROM $this->table_filemeta WHERE file_id = %d", $fileId );
      $metadata = $this->wpdb->get_results( $sql, ARRAY_A );
      $meta = [];
      foreach ( $metadata as $metaItem ) {
        $meta[$metaItem['meta_key']] = $metaItem['meta_value'];
      }
      return $meta;
    }
    return null;
  }

  public function search( $userId = null, $purpose = null, $metadata = [], $envId = null ) {
    list( $sql, $params ) = $this->_buildQuery( $userId, $purpose, $metadata, $envId, true );
    $finalQuery = $this->wpdb->prepare( $sql, $params );
    $files = $this->wpdb->get_results( $finalQuery, ARRAY_A );
    foreach ( $files as &$file ) {
      $file['metadata'] = $this->get_metadata( $file['refId'] );
    }
    return $files;
  }

  public function list( $userId = null, $purpose = null, $metadata = [],
    $envId = null, $limit = 10, $offset = 0 )
  {
    list( $countSql, $countParams ) = $this->_buildQuery( $userId, $purpose, $metadata, $envId, false );
    $total = $this->wpdb->get_var( $this->wpdb->prepare( $countSql, $countParams ) );

    list( $fileSql, $fileParams ) = $this->_buildQuery( $userId, $purpose, $metadata, $envId, true );
    if ( $limit ) {
      $fileSql .= " LIMIT %d";
      $fileParams[] = $limit;
    }
    if ( $offset ) {
      $fileSql .= " OFFSET %d";
      $fileParams[] = $offset;
    }
    $files = $this->wpdb->get_results( $this->wpdb->prepare( $fileSql, $fileParams ), ARRAY_A );
    foreach ( $files as &$file ) {
      $file['metadata'] = $this->get_metadata( $file['refId'] );
    }
    return [ 'files' => $files, 'total' => $total ];
  }

  private function _buildQuery( $userId, $purpose, $metadata, $envId, $selectStar ) {
    $sql = $selectStar ? "SELECT * FROM $this->table_files WHERE 1=1" : "SELECT COUNT(*) FROM $this->table_files WHERE 1=1";
    $params = [];

    // Based on the old "search" function
    $actualUserId = $this->core->get_user_id();
    $canAdmin = $this->core->can_access_settings();
    if ( $userId !== $actualUserId ) {
      if ( !$canAdmin ) {
        throw new Exception( 'You are not allowed to access files from another user.' );
      }
    }
    if ( $userId ) {
      $sql .= " AND userId = %d";
      $params[] = $userId;
    }
    if ( $purpose ) {
      if ( is_array( $purpose ) ) {
        $sql .= " AND (";
        foreach ( $purpose as $p ) {
          $sql .= " purpose = %s OR";
          $params[] = $p;
        }
        $sql = rtrim( $sql, 'OR' );
        $sql .= ")";
      }
      else {
        $sql .= " AND purpose = %s";
        $params[] = $purpose;
      }
    }
    if ( $metadata ) {
      foreach ( $metadata as $metaKey => $metaValue ) {
        $sql .= " AND EXISTS ( SELECT * FROM $this->table_filemeta
          WHERE file_id = $this->table_files.id AND meta_key = %s AND meta_value = %s )";
        $params[] = $metaKey;
        $params[] = $metaValue;
      }
    }
    if ( $envId ) {
      $sql .= " AND envId = %s";
      $params[] = $envId;
    }
    $sql .= " ORDER BY updated DESC";
    return [ $sql, $params ];
  }

  // public function search( $userId = null, $purpose = null, $metadata = [], $limit = 10, $offset = 0 ) {
  //   $sql = "SELECT * FROM $this->table_files WHERE 1=1";
  //   $actualUserId = $this->core->get_user_id();
  //   $canAdmin = $this->core->can_access_settings();
  //   if ( $userId !== $actualUserId ) {
  //     if ( !$canAdmin ) {
  //       throw new Exception( 'You are not allowed to access files from another user.' );
  //     }
  //   }
  //   if ( $userId ) {
  //     $sql .= $this->wpdb->prepare( " AND userId = %d", $userId );
  //   }
  //   if ( $purpose ) {
  //     if ( is_array( $purpose ) ) {
  //       $sql .= " AND (";
  //       foreach ( $purpose as $p ) {
  //         $sql .= $this->wpdb->prepare( " purpose = %s OR", $p );
  //       }
  //       $sql = rtrim( $sql, 'OR' );
  //       $sql .= ")";
  //     }
  //     else {
  //       $sql .= $this->wpdb->prepare( " AND purpose = %s", $purpose );
  //     }
  //   }
  //   if ( $metadata ) {
  //     foreach ( $metadata as $metaKey => $metaValue ) {
  //       $sql .= $this->wpdb->prepare( " AND EXISTS ( SELECT * FROM $this->table_filemeta
  //         WHERE file_id = $this->table_files.id AND meta_key = %s AND meta_value = %s )",
  //         $metaKey, $metaValue
  //       );
  //     }
  //   }
  //   $sql .= " ORDER BY updated DESC";
  //   if ( $limit ) {
  //     $sql .= $this->wpdb->prepare( " LIMIT %d", $limit );
  //   }
  //   if ( $offset ) {
  //     $sql .= $this->wpdb->prepare( " OFFSET %d", $offset );
  //   }
  //   $files = $this->wpdb->get_results( $sql, ARRAY_A );

  //   // Add metadata
  //   foreach ( $files as &$file ) {
  //     $file['metadata'] = $this->get_metadata( $file['refId'] );
  //   }

  //   return $files;
  // }

  public function get_id_from_refId( $refId ) {
    $file = null;
    if ( $this->check_db() ) {
      $file = $this->wpdb->get_row( $this->wpdb->prepare( "SELECT *
        FROM $this->table_files
        WHERE refId = %s", $refId
      ) );
    }
    if ( $file ) {
      return $file->id;
    }
    return null;
  }

  public function add_metadata_from_refId( $refId, $metaKey, $metaValue ) {
    $fileId = $this->get_id_from_refId( $refId );
    if ( $fileId ) {
      return $this->add_metadata( $fileId, $metaKey, $metaValue );
    }
    return false;
  }

  public function rest_list( $request ) {
    $params = $request->get_json_params();
    $userId = empty( $params['userId'] ) ? null : $params['userId'];
    $envId = empty( $params['envId'] ) ? null : $params['envId'];
    $purpose = empty( $params['purpose'] ) ? null : $params['purpose'];
    $metadata = empty( $params['metadata'] ) ? null : json_decode( $params['metadata'], true );
    $limit = empty( $params['limit'] ) ? 10 : intval( $params['limit'] );
    $offset = empty( $params['page'] ) ? 0 : ( intval( $params['page'] ) - 1) * $limit;
    $files = $this->list( $userId, $purpose, $metadata, $envId, $limit, $offset );
    return new WP_REST_Response( [ 'success' => true, 'data' => $files ], 200 );
  }

  public function rest_delete( $request ) {
    $params = $request->get_json_params();
    $fileIds = empty( $params['files'] ) ? [] : $params['files'];
    $this->delete_files( $fileIds );
    return new WP_REST_Response( [ 'success' => true ], 200 );
  }

  public function delete_files( $fileIds ) {
    $query = "SELECT refId, path FROM $this->table_files WHERE id IN (";
    $params = [];
    foreach ( $fileIds as $fileId ) {
      $query .= "%s,";
      $params[] = $fileId;
    }
    $query = rtrim( $query, ',' );
    $query .= ")";
    $files = $this->wpdb->get_results( $this->wpdb->prepare( $query, $params ), ARRAY_A );
    $refIds = apply_filters( 'mwai_files_delete', array_column( $files, 'refId' ) );
    foreach ( $files as $file ) {
      if ( in_array( $file['refId'], $refIds ) ) {
        $this->wpdb->delete( $this->table_files, [ 'refId' => $file['refId'] ] );
        if ( file_exists( $file['path'] ) ) {
          unlink( $file['path'] );
        }
      }
    }
  }

  public function rest_upload() {
    if ( empty( $_FILES['file'] ) ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'No file provided.' ], 400 );
    }
    $file = $_FILES['file'];
    $purpose = empty( $_POST['purpose'] ) ? null : $_POST['purpose'];
    $metadata = empty( $_POST['metadata'] ) ? null : json_decode( $_POST['metadata'], true );
    $envId = empty( $_POST['envId'] ) ? null : $_POST['envId'];
    if ( !$purpose ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'Purpose is required.' ], 400 );
    }
    $fileTypeCheck = wp_check_filetype_and_ext( $file['tmp_name'], $file['name'] );
    if ( !$fileTypeCheck['type'] ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'Invalid file type.' ], 400 );
    }

    try {
      $refId = $this->upload_file( $file['tmp_name'], $file['name'], $purpose, $metadata, $envId );
      $url = $this->get_url( $refId );
      return new WP_REST_Response( [
        'success' => true,
        'data' => [ 'id' => $refId, 'url' => $url ]
      ], 200 );
    }
    catch ( Exception $e ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  #endregion

  #region Database functions

  function create_db() {
    $charset_collate = $this->wpdb->get_charset_collate();
    $sql = "CREATE TABLE $this->table_files (
      id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
      refId VARCHAR(64) NOT NULL,
      envId VARCHAR(128) NULL,
      userId BIGINT(20) UNSIGNED NULL,
      type VARCHAR(32) NULL,
      status VARCHAR(32) NULL,
      purpose VARCHAR(32) NULL,
      created DATETIME NOT NULL,
      updated DATETIME NOT NULL,
      expires DATETIME NULL,
      path TEXT NULL,
      url TEXT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY unique_file_id (refId)
    ) $charset_collate;";

    $sqlFileMeta = "CREATE TABLE $this->table_filemeta (
      meta_id BIGINT(20) NOT NULL AUTO_INCREMENT,
      file_id BIGINT(20) NOT NULL,
      meta_key varchar(255) NULL,
      meta_value longtext NULL,
      PRIMARY KEY  (meta_id)
    ) $charset_collate;";

    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta( $sql );
    dbDelta( $sqlFileMeta );
  }
  
  function check_db() {
    if ( $this->db_check ) {
      return true;
    }

    // Check if table_files exists
    $sql = $this->wpdb->prepare( "SHOW TABLES LIKE %s", $this->table_files );
    $table_files_exists = strtolower( $this->wpdb->get_var( $sql )) === strtolower( $this->table_files );

    // Check if table_filemeta exists
    $sqlMeta = $this->wpdb->prepare( "SHOW TABLES LIKE %s", $this->table_filemeta );
    $table_filemeta_exists = strtolower( $this->wpdb->get_var( $sqlMeta )) === strtolower( $this->table_filemeta );

    // If either table does not exist, create them
    if ( !$table_files_exists || !$table_filemeta_exists ) {
        $this->create_db();
    }

    // Update db_check for both tables
    $this->db_check = $table_files_exists && $table_filemeta_exists;

    // LATER: REMOVE THIS AFTER MARCH 2024
    // $this->db_check = $this->db_check && $this->wpdb->get_var( "SHOW COLUMNS FROM $this->table_files LIKE 'userId'" );
    // if ( !$this->db_check ) {
    //   $this->wpdb->query( "ALTER TABLE $this->table_files ADD COLUMN userId BIGINT(20) UNSIGNED NULL" );
    //   $this->wpdb->query( "ALTER TABLE $this->table_files ADD COLUMN purpose VARCHAR(32) NULL" );
    //   $this->wpdb->query( "ALTER TABLE $this->table_files MODIFY COLUMN path TEXT NULL" );
    //   $this->wpdb->query( "ALTER TABLE $this->table_files DROP COLUMN metadata" );
    //   $this->db_check = true;
    // }
    // // LATER: REMOVE THIS AFTER MARCH 2024
    // $this->db_check = $this->db_check && !$this->wpdb->get_var( "SHOW COLUMNS FROM $this->table_files LIKE 'fileId'" );
    // if ( !$this->db_check ) {
    //   $this->wpdb->query( "ALTER TABLE $this->table_files ADD COLUMN refId VARCHAR(64) NOT NULL" );
    //   $this->wpdb->query( "ALTER TABLE $this->table_files DROP COLUMN fileId" );
    //   $this->db_check = true;
    // }
    // // LATER: REMOVE THIS AFTER MARCH 2024
    // $this->db_check = $this->db_check && $this->wpdb->get_var( "SHOW COLUMNS FROM $this->table_files LIKE 'envId'" );
    // if ( !$this->db_check ) {
    //   $this->wpdb->query( "ALTER TABLE $this->table_files ADD COLUMN envId VARCHAR(128) NULL" );
    //   $this->db_check = true;
    // }

    return $this->db_check;
  }

  #endregion
}