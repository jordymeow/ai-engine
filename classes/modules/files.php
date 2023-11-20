<?php

class Meow_MWAI_Modules_Files {
	private $core = null;
  private $wpdb = null;
	private $namespace = 'mwai-ui/v1';
  private $db_check = false;
  private $table_files = null;

  public function __construct( $core ) {
		global $wpdb;
		$this->core = $core;
    $this->wpdb = $wpdb;
    $this->table_files = $this->wpdb->prefix . 'mwai_files';
		add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
    if ( !wp_next_scheduled( 'mwai_files_cleanup' ) ) {
      wp_schedule_event( time(), 'hourly', 'mwai_files_cleanup' );
    }
    add_action( 'mwai_files_cleanup', [ $this, 'cleanup_expired_files' ] );
	}

  public function cleanup_expired_files() {
    if ( $this->check_db() ) {
      $current_time = current_time( 'mysql' );
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
    $fileIds = [];
    foreach ( $expired_files as $file ) {
      $fileIds[] = $file->fileId;
    }
    foreach ( $expired_posts as $post ) {
      $fileIds[] = get_post_meta( $post->ID, '_mwai_file_id', true );
    }
    $this->files_processed( $fileIds );
  }

  public function files_processed( $fileIds ) {
    if ( !is_array( $fileIds ) ) {
      $fileIds = [ $fileIds ];
    }
    foreach ( $fileIds as $fileId ) {
      $file = null;
      if ( $this->check_db() ) {
        $file = $this->wpdb->get_row( $this->wpdb->prepare( "SELECT *
          FROM $this->table_files
          WHERE fileId = %s", $fileId
        ) );
      }
      if ( $file ) {
        $this->wpdb->delete( $this->table_files, [ 'fileId' => $fileId ] );
        if ( file_exists( $file->path ) ) {
          unlink( $file->path );
        }
      }
      else {
        $posts = get_posts( [ 'post_type' => 'attachment', 'meta_key' => '_mwai_file_id', 'meta_value' => $fileId ] );
        if ( $posts ) {
          foreach ( $posts as $post ) {
            wp_delete_attachment( $post->ID, true );
          }
        }
      }
    }
  }

  public function get_path( $fileId ) {
    $file = null;
    if ( $this->check_db() ) {
      $file = $this->wpdb->get_row( $this->wpdb->prepare( "SELECT *
        FROM $this->table_files
        WHERE fileId = %s", $fileId
      ) );
    }
    if ( $file ) {
      return $file->path;
    }
    else {
      $posts = get_posts( [ 'post_type' => 'attachment', 'meta_key' => '_mwai_file_id', 'meta_value' => $fileId ] );
      if ( $posts ) {
        foreach ( $posts as $post ) {
          return get_attached_file( $post->ID );
        }
      }
    }
    return null;
  }

  public function get_base64_data( $fileId ) {
    $path = $this->get_path( $fileId );
    if ( $path ) {
      $content = file_get_contents( $path );
      $data = base64_encode( $content );
      return $data;
    }
    return null;
  }

  public function get_url( $fileId ) {
    $file = null;
    if ( $this->check_db() ) {
      $file = $this->wpdb->get_row( $this->wpdb->prepare( "SELECT *
        FROM $this->table_files
        WHERE fileId = %s", $fileId
      ) );
    }
    if ( $file ) {
      return $file->url;
    }
    else {
      $posts = get_posts( [ 'post_type' => 'attachment', 'meta_key' => '_mwai_file_id', 'meta_value' => $fileId ] );
      if ( $posts ) {
        foreach ( $posts as $post ) {
          return wp_get_attachment_url( $post->ID );
        }
      }
    }
    return null;
  }

  #region REST endpoints

  public function rest_api_init() {
		register_rest_route( $this->namespace, '/files/upload', array(
			'methods' => 'POST',
			'callback' => array( $this, 'rest_upload' ),
			'permission_callback' => array( $this->core, 'check_rest_nonce' )
		) );
    register_rest_route( $this->namespace, '/files/delete', array(
			'methods' => 'POST',
			'callback' => array( $this, 'rest_delete' ),
			'permission_callback' => array( $this->core, 'check_rest_nonce' )
		) );
	}

  public function rest_upload() {
    require_once( ABSPATH . 'wp-admin/includes/image.php' );
    require_once( ABSPATH . 'wp-admin/includes/file.php' );
    require_once( ABSPATH . 'wp-admin/includes/media.php' );
    $file = $_FILES['file'];
    $error = null;
    if ( empty( $file ) ) {
			return new WP_REST_Response( [ 'success' => false, 'message' => 'No file provided.' ], 400 );
    }

    // File validation by WordPress Media Library
    $fileTypeCheck = wp_check_filetype_and_ext( $file['tmp_name'], $file['name'] );
    if ( !$fileTypeCheck['type'] ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'Invalid file type.' ], 400 );
    }

    $local_upload = $this->core->get_option( 'image_local_upload' );
    $image_expires_seconds = $this->core->get_option( 'image_expires' );
    $expires = ( empty( $image_expires_seconds ) || $image_expires_seconds === 'never' ) ? null : 
      date( 'Y-m-d H:i:s', time() + $image_expires_seconds );
    $fileId = null;
    $url = null;
    if ( $local_upload === 'uploads' ) {
      if ( !$this->check_db() ) {
        return new WP_REST_Response( [ 'success' => false, 'message' => 'Could not create database table.' ], 500 );
      }
      $extension = pathinfo( $file['name'], PATHINFO_EXTENSION );
      $randomFileName = wp_generate_password( 20, false ) . '.' . $extension;
      $upload_dir = wp_upload_dir();
      $path = $upload_dir['path'] . '/' . $randomFileName;
      $filename = wp_unique_filename( $upload_dir['path'], $randomFileName );
      $path = $upload_dir['path'] . '/' . $filename;
      if ( !move_uploaded_file( $file['tmp_name'], $path ) ) {
        return new WP_REST_Response( [ 'success' => false, 'message' => 'Could not move the file.' ], 500 );
      }
      $url = $upload_dir['url'] . '/' . $filename;
      $fileId = md5( $url );
      $this->wpdb->insert( $this->table_files, [
        'fileId' => $fileId,
        'type' => 'image',
        'status' => 'uploaded',
        'created' => date( 'Y-m-d H:i:s' ),
        'updated' => date( 'Y-m-d H:i:s' ),
        'expires' => $expires,
        'path' => $path,
        'url' => $url
      ]);
    }
    else if ( $local_upload === 'library' ) {
      $id = media_handle_upload( 'file', 0 );
      if ( is_wp_error( $id ) ) {
        $error = $id->get_error_message();
        return new WP_REST_Response([ 'success' => false, 'message' => $error ], 500);
      }
      $url = wp_get_attachment_url( $id );
      $fileId = md5( $url );
      update_post_meta( $id, '_mwai_file_id', $fileId );
      update_post_meta( $id, '_mwai_file_expires', $expires );
    }
    return new WP_REST_Response( [
			'success' => true,
			'data' => [ 'id' => $fileId, 'url' => $url ]
    ], 200 );
	}

  #endregion

  #region Database functions

  function create_db() {
    $charset_collate = $this->wpdb->get_charset_collate();
    $sql = "CREATE TABLE $this->table_files (
      id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
      fileId VARCHAR(64) NOT NULL,
      type VARCHAR(32) NULL,
      status VARCHAR(32) NULL,
      created DATETIME NOT NULL,
      updated DATETIME NOT NULL,
      expires DATETIME NULL,
      path TEXT NOT NULL,
      url TEXT NULL,
      metadata TEXT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY unique_file_id (fileId)
    ) $charset_collate;";
    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta( $sql );
  }
  
  function check_db() {
    if ( $this->db_check ) {
      return true;
    }
    $sql = $this->wpdb->prepare( "SHOW TABLES LIKE %s", $this->table_files );
    $table_exists = strtolower( $this->wpdb->get_var( $sql )) === strtolower( $this->table_files );
    if ( !$table_exists ) {
      $this->create_db();
      $table_exists = strtolower( $this->wpdb->get_var( $sql ) ) === strtolower( $this->table_files );
    }
    $this->db_check = $table_exists;
    return $this->db_check;
  }

  #endregion
  
}