<?php

// Undo for MCP: every change an assistant makes is journaled with what it replaced, so the owner
// (MCP tab) or the assistant itself (mcp_undo_change) can put it back.
//
// Capture happens at the tool layer, not on WordPress hooks: a tool names its targets (a post's
// fields, a meta key, an option...), their state is read before and after the call, and only
// that is journaled. Hooks would also catch what other plugins write on save (cron, transients,
// caches), and restoring those would do harm. The one exception is creation: objects created
// during a call are discovered through insert hooks, since their ID is unknown beforehand.
//
// A target is [ 'kind' => ..., ...keys ]. Each kind knows how to read its state, write a state
// back, and who may do so (see kinds()). A null state means "absent": undoing a creation trashes
// the item, and a state that became null (deleted for good) cannot be undone, unless the kind
// 'recreates' (a meta key or an option is simply written again).
//
// An undo is refused when the current state no longer matches the one left by the assistant
// (someone edited it since), unless forced. The undo is journaled too, so it can be undone.
class Meow_MWAI_Labs_MCP_Undo {
  public const KEEP_DAYS = 30;
  public const MAX_BYTES = 1048576;
  public const DB_VERSION = 1;
  public const DB_OPTION = 'mwai_mcp_changes_db';
  public const UNDO_TOOL = 'mcp_undo_change';
  // The post fields a tool may touch, and what a created post is compared on.
  public const POST_FIELDS = [ 'post_title', 'post_content', 'post_excerpt', 'post_status', 'post_name',
    'post_author', 'post_parent', 'menu_order', 'comment_status', 'ping_status', 'post_password',
    'post_date', 'post_date_gmt' ];
  private const CREATED_FIELDS = [ 'post_title', 'post_content', 'post_excerpt', 'post_status', 'post_name' ];
  // Revisions and caches, plus what a kind restores as a whole (menus, CSS, global styles).
  private const SKIPPED_POST_TYPES = [ 'revision', 'oembed_cache', 'customize_changeset', 'user_request', 'wp_navigation_link',
    'nav_menu_item', 'custom_css', 'wp_global_styles' ];

  // The call in progress: its targets with their states before the call, and what it created.
  private static $pending = null;
  private static $kinds = null;

  public static function table(): string {
    global $wpdb;
    return $wpdb->prefix . 'mwai_mcp_changes';
  }

  // Created on the first change, so sites that never write through MCP never get the table.
  private static function ensure_table(): bool {
    if ( (int) get_option( self::DB_OPTION ) === self::DB_VERSION ) {
      return true;
    }
    global $wpdb;
    $table = self::table();
    $charset = $wpdb->get_charset_collate();
    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta( "CREATE TABLE $table (
      id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
      time DATETIME NOT NULL,
      user_id BIGINT(20) UNSIGNED NOT NULL DEFAULT 0,
      client VARCHAR(100) NOT NULL DEFAULT '',
      tool VARCHAR(100) NOT NULL DEFAULT '',
      object_type VARCHAR(32) NOT NULL DEFAULT '',
      object_id VARCHAR(191) NOT NULL DEFAULT '',
      title VARCHAR(191) NOT NULL DEFAULT '',
      undoable TINYINT(1) NOT NULL DEFAULT 0,
      note VARCHAR(191) NOT NULL DEFAULT '',
      before_state LONGTEXT NULL,
      after_hash VARCHAR(32) NOT NULL DEFAULT '',
      undo_of BIGINT(20) UNSIGNED NULL,
      undone_at DATETIME NULL,
      undone_by BIGINT(20) UNSIGNED NULL,
      PRIMARY KEY  (id),
      KEY time (time)
    ) $charset;" );
    if ( !self::table_exists() ) {
      return false;
    }
    update_option( self::DB_OPTION, self::DB_VERSION, false );
    return true;
  }

  private static function table_exists(): bool {
    global $wpdb;
    $table = self::table();
    return $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $wpdb->esc_like( $table ) ) ) === $table;
  }

  #region Capture
  // Called before a write tool runs.
  public static function begin( string $tool, array $args ) {
    self::$pending = null;
    try {
      $targets = self::targets_for( $tool, $args );
      $captured = [];
      foreach ( (array) $targets as $target ) {
        $captured[] = [ 'target' => $target, 'state' => self::read( $target ) ];
      }
      self::$pending = [ 'tool' => $tool, 'known' => $targets !== null, 'targets' => $captured, 'created' => [] ];
      add_action( 'wp_insert_post', [ __CLASS__, 'on_insert_post' ], 10, 3 );
      add_action( 'created_term', [ __CLASS__, 'on_created_term' ], 10, 3 );
      add_action( 'wp_insert_comment', [ __CLASS__, 'on_insert_comment' ], 10, 1 );
    }
    catch ( Throwable $e ) {
      // Never let the journal stop a tool from running.
      self::$pending = [ 'tool' => $tool, 'known' => false, 'targets' => [], 'created' => [], 'error' => $e->getMessage() ];
    }
  }

  public static function on_insert_post( $post_id, $post, $update ) {
    if ( $update || !$post || in_array( $post->post_type, self::SKIPPED_POST_TYPES, true ) || $post->post_status === 'auto-draft' ) {
      return;
    }
    self::$pending['created'][] = [ 'kind' => 'post', 'id' => (int) $post_id, 'fields' => self::CREATED_FIELDS ];
  }

  public static function on_created_term( $term_id, $tt_id, $taxonomy ) {
    if ( $taxonomy === 'nav_menu' ) {
      return;
    }
    self::$pending['created'][] = [ 'kind' => 'term', 'id' => (int) $term_id, 'taxonomy' => (string) $taxonomy ];
  }

  public static function on_insert_comment( $comment_id ) {
    self::$pending['created'][] = [ 'kind' => 'comment', 'id' => (int) $comment_id ];
  }

  // Called after the tool ran. Returns the journal row's ID, or null when nothing was recorded.
  public static function finish( bool $success, array $context = [] ): ?int {
    $pending = self::$pending;
    self::$pending = null;
    remove_action( 'wp_insert_post', [ __CLASS__, 'on_insert_post' ], 10 );
    remove_action( 'created_term', [ __CLASS__, 'on_created_term' ], 10 );
    remove_action( 'wp_insert_comment', [ __CLASS__, 'on_insert_comment' ], 10 );
    if ( !$pending || !$success ) {
      return null;
    }
    try {
      $entries = [];
      $after = [];
      foreach ( $pending['targets'] as $entry ) {
        $now = self::read( $entry['target'] );
        if ( self::fingerprint( $now ) === self::fingerprint( $entry['state'] ) ) {
          continue;
        }
        $entries[] = $entry;
        $after[] = $now;
      }
      foreach ( $pending['created'] as $target ) {
        $now = self::read( $target );
        if ( $now === null ) {
          continue;
        }
        $entries[] = [ 'target' => $target, 'state' => null ];
        $after[] = $now;
      }
      // A known tool that changed nothing (no occurrences found, the same value again).
      if ( !$entries && $pending['known'] ) {
        return null;
      }
      return self::insert( [
        'tool' => $pending['tool'],
        'entries' => $entries,
        'after' => $after,
        'note' => $entries ? '' : 'This kind of change cannot be undone.',
      ] + $context );
    }
    catch ( Throwable $e ) {
      error_log( '[AI Engine MCP] Undo journal: ' . $e->getMessage() );
      return null;
    }
  }

  private static function insert( array $row ): ?int {
    if ( !self::ensure_table() ) {
      return null;
    }
    global $wpdb;
    self::purge();
    $entries = $row['entries'];
    $before = $entries ? wp_json_encode( $entries ) : null;
    $undoable = (bool) $entries;
    $note = (string) ( $row['note'] ?? '' );
    foreach ( $entries as $i => $entry ) {
      $recreates = !empty( self::kinds()[ $entry['target']['kind'] ]['recreates'] );
      if ( $entry['state'] !== null && $row['after'][ $i ] === null && !$recreates ) {
        $undoable = false;
        $note = 'Deleted for good, so it cannot be undone.';
      }
    }
    if ( $entries && $before === false ) {
      $before = null;
      $undoable = false;
      $note = 'This content could not be saved for undo.';
    }
    elseif ( $before !== null && strlen( $before ) > self::MAX_BYTES ) {
      $before = null;
      $undoable = false;
      $note = 'Too large to undo.';
    }
    $first = $entries[0]['target'] ?? null;
    $ok = $wpdb->insert( self::table(), [
      'time' => gmdate( 'Y-m-d H:i:s' ),
      'user_id' => (int) ( $row['user_id'] ?? get_current_user_id() ),
      'client' => mb_substr( (string) ( $row['client'] ?? '' ), 0, 100 ),
      'tool' => mb_substr( (string) $row['tool'], 0, 100 ),
      'object_type' => $first ? (string) $first['kind'] : '',
      'object_id' => $first ? mb_substr( (string) self::target_ref( $first ), 0, 191 ) : '',
      // An undo keeps the name of what it undid: a menu it deleted has no name to read anymore.
      'title' => mb_substr( $row['title'] ?? ( $first ? self::title_of( $first ) : '' ), 0, 191 ),
      'undoable' => $undoable ? 1 : 0,
      'note' => mb_substr( $note, 0, 191 ),
      'before_state' => $before,
      'after_hash' => self::fingerprint( $row['after'] ),
      'undo_of' => $row['undo_of'] ?? null,
    ] );
    return $ok ? (int) $wpdb->insert_id : null;
  }

  // Once a day at most, on a write: no cron to keep alive.
  private static function purge() {
    if ( get_transient( 'mwai_mcp_changes_purged' ) ) {
      return;
    }
    set_transient( 'mwai_mcp_changes_purged', 1, DAY_IN_SECONDS );
    global $wpdb;
    $cutoff = gmdate( 'Y-m-d H:i:s', time() - self::KEEP_DAYS * DAY_IN_SECONDS );
    $wpdb->query( $wpdb->prepare( 'DELETE FROM ' . self::table() . ' WHERE time < %s', $cutoff ) );
  }

  // Scalars compared as strings: the same value reads back as an int from the cache and as a
  // string from the database.
  private static function fingerprint( $state ): string {
    $normalize = function ( $value ) use ( &$normalize ) {
      if ( is_array( $value ) ) {
        return array_map( $normalize, $value );
      }
      if ( is_bool( $value ) ) {
        return $value ? '1' : '';
      }
      return is_scalar( $value ) ? (string) $value : $value;
    };
    return md5( (string) wp_json_encode( $normalize( $state ) ) );
  }
  #endregion

  #region Targets
  // The targets of a call, or null when this tool has no capturer (journaled as not undoable).
  private static function targets_for( string $tool, array $a ) {
    $targets = self::core_targets( $tool, $a );
    return apply_filters( 'mwai_mcp_undo_targets', $targets, $tool, $a );
  }

  private static function json_arg( $value ) {
    if ( is_string( $value ) ) {
      $decoded = json_decode( $value, true );
      return is_array( $decoded ) ? $decoded : [];
    }
    return is_array( $value ) ? $value : [];
  }

  private static function core_targets( string $tool, array $a ) {
    $id = 0;
    foreach ( [ 'ID', 'post_id', 'id' ] as $key ) {
      if ( isset( $a[ $key ] ) && $a[ $key ] !== '' ) {
        $id = (int) $a[ $key ];
        break;
      }
    }
    $post = function ( array $fields ) use ( $id ) {
      return [ 'kind' => 'post', 'id' => $id, 'fields' => array_values( array_unique( $fields ) ) ];
    };
    $meta = function ( $key ) use ( $id ) {
      return [ 'kind' => 'meta', 'id' => $id, 'key' => trim( (string) $key ) ];
    };
    switch ( $tool ) {
      case 'wp_create_post':
      case 'wp_create_term':
      case 'wp_create_comment':
      case 'wp_create_note':
      case 'wp_upload_media':
        // What they create is found by the insert hooks.
        return [];

      case 'wp_update_post':
        $fields = self::json_arg( $a['fields'] ?? null );
        foreach ( self::POST_FIELDS as $key ) {
          if ( array_key_exists( $key, $a ) ) {
            $fields[ $key ] = $a[ $key ];
          }
        }
        $keys = array_intersect( array_keys( $fields ), self::POST_FIELDS );
        if ( !empty( $a['schedule_for'] ) ) {
          $keys = array_merge( $keys, [ 'post_status', 'post_date', 'post_date_gmt' ] );
        }
        $targets = $keys ? [ $post( $keys ) ] : [];
        foreach ( array_keys( self::json_arg( $a['meta_input'] ?? null ) ) as $key ) {
          $targets[] = $meta( $key );
        }
        return $id ? $targets : null;

      case 'wp_alter_post':
        $field = sanitize_key( (string) ( $a['field'] ?? '' ) );
        return $id && in_array( $field, [ 'post_content', 'post_excerpt', 'post_title' ], true ) ? [ $post( [ $field ] ) ] : null;

      case 'wp_write_blocks':
      case 'wp_edit_blocks':
      case 'wp_edit_shortcodes':
      case 'wp_insert_block_pattern':
        return $id ? [ $post( [ 'post_content' ] ) ] : null;

      case 'wp_delete_post':
      case 'wp_delete_media':
        return $id ? [ $post( [ 'post_status' ] ) ] : null;

      case 'wp_update_media':
        return $id ? [ $post( [ 'post_title', 'post_excerpt', 'post_content' ] ), $meta( '_wp_attachment_image_alt' ) ] : null;

      case 'wp_set_featured_image':
        return $id ? [ $meta( '_thumbnail_id' ) ] : null;

      case 'wp_update_post_meta':
        $keys = array_keys( self::json_arg( $a['meta'] ?? null ) );
        if ( !$keys && isset( $a['key'] ) ) {
          $keys = [ $a['key'] ];
        }
        return $id && $keys ? array_map( $meta, $keys ) : null;

      case 'wp_delete_post_meta':
        return $id && !empty( $a['key'] ) ? [ $meta( $a['key'] ) ] : null;

      case 'wp_add_post_terms':
        return $id ? [ [ 'kind' => 'post_terms', 'id' => $id, 'taxonomy' => sanitize_key( $a['taxonomy'] ?? 'category' ) ] ] : null;

      case 'wp_update_term':
      case 'wp_delete_term':
        $term_id = (int) ( $a['term_id'] ?? 0 );
        return $term_id ? [ [ 'kind' => 'term', 'id' => $term_id, 'taxonomy' => sanitize_key( $a['taxonomy'] ?? '' ) ] ] : null;

      case 'wp_update_comment':
      case 'wp_delete_comment':
        $comment_id = (int) ( $a['comment_ID'] ?? 0 );
        return $comment_id ? [ [ 'kind' => 'comment', 'id' => $comment_id ] ] : null;

      case 'wp_update_note':
      case 'wp_delete_note':
        $note_id = (int) ( $a['note_id'] ?? 0 );
        return $note_id ? [ [ 'kind' => 'comment', 'id' => $note_id ] ] : null;

      case 'wp_update_option':
        $name = is_scalar( $a['key'] ?? null ) ? trim( (string) $a['key'] ) : '';
        return $name !== '' ? [ [ 'kind' => 'option', 'name' => self::stored_option_name( $name ) ?? $name ] ] : null;

        // Page Builder by SiteOrigin's own ability (exposed by labs/mcp-abilities.php): the layout lives
        // in panels_data for classic pages, in post_content for Layout Blocks.
      case 'siteorigin-panels_layout-update':
        $so_id = (int) ( $a['post_id'] ?? 0 );
        return $so_id ? [ [ 'kind' => 'post', 'id' => $so_id, 'fields' => [ 'post_content' ] ], [ 'kind' => 'meta', 'id' => $so_id, 'key' => 'panels_data' ] ] : null;

      case 'wp_update_user':
        // Never passwords: they are not stored, so a password change stays.
        $fields = array_diff( array_keys( self::json_arg( $a['fields'] ?? null ) ), [ 'user_pass', 'ID' ] );
        return $id && $fields ? [ [ 'kind' => 'user', 'id' => $id, 'fields' => array_values( $fields ) ] ] : null;
    }
    return null;
  }

  // Same lookup as wp_update_option: the row as stored, whatever case the agent used.
  private static function stored_option_name( string $name ): ?string {
    global $wpdb;
    $stored = $wpdb->get_var( $wpdb->prepare( "SELECT option_name FROM {$wpdb->options} WHERE option_name = %s LIMIT 1", $name ) );
    return is_string( $stored ) ? $stored : null;
  }
  #endregion

  #region Kinds
  private static function kinds(): array {
    if ( self::$kinds === null ) {
      self::$kinds = apply_filters( 'mwai_mcp_undo_kinds', self::core_kinds() );
    }
    return self::$kinds;
  }

  private static function kind( array $target ): array {
    $kind = self::kinds()[ $target['kind'] ?? '' ] ?? null;
    if ( !$kind ) {
      throw new Exception( 'This kind of change cannot be undone here.' );
    }
    return $kind;
  }

  private static function read( array $target ) {
    return call_user_func( self::kind( $target )['read'], $target );
  }

  private static function target_ref( array $target ): string {
    return (string) ( $target['id'] ?? $target['name'] ?? $target['file'] ?? '' );
  }

  private static function title_of( array $target ): string {
    $kind = self::kinds()[ $target['kind'] ] ?? null;
    $title = $kind && isset( $kind['title'] ) ? (string) call_user_func( $kind['title'], $target ) : '';
    return html_entity_decode( wp_strip_all_tags( $title ), ENT_QUOTES, 'UTF-8' );
  }

  // Raw rows, never get_post_meta(): JSON can't hold objects, and a serialized string survives as is.
  public static function raw_meta( int $id, string $key ): ?array {
    global $wpdb;
    $rows = $wpdb->get_col( $wpdb->prepare(
      "SELECT meta_value FROM {$wpdb->postmeta} WHERE post_id = %d AND meta_key = %s ORDER BY meta_id",
      $id,
      $key
    ) );
    return $rows ? array_map( 'strval', $rows ) : null;
  }

  public static function post_title( int $id ): string {
    $post = get_post( $id );
    return $post ? ( get_the_title( $post ) ?: '#' . $id ) : '#' . $id;
  }

  public static function core_kinds(): array {
    return [
      'post' => [
        'read' => function ( $t ) {
          $post = get_post( (int) $t['id'], ARRAY_A );
          return $post ? array_intersect_key( $post, array_flip( $t['fields'] ) ) : null;
        },
        'write' => [ __CLASS__, 'write_post' ],
        'can' => function ( $t, $state ) {
          return current_user_can( $state === null ? 'delete_post' : 'edit_post', (int) $t['id'] );
        },
        'title' => function ( $t ) { return self::post_title( (int) $t['id'] ); },
      ],
      'meta' => [
        'recreates' => true,
        'read' => function ( $t ) { return self::raw_meta( (int) $t['id'], $t['key'] ); },
        'write' => function ( $t, $state ) {
          delete_post_meta( (int) $t['id'], $t['key'] );
          foreach ( (array) $state as $raw ) {
            add_post_meta( (int) $t['id'], $t['key'], wp_slash( maybe_unserialize( $raw ) ) );
          }
        },
        'can' => function ( $t ) { return current_user_can( 'edit_post', (int) $t['id'] ); },
        'title' => function ( $t ) { return self::post_title( (int) $t['id'] ); },
      ],
      'post_terms' => [
        'read' => function ( $t ) {
          $ids = wp_get_object_terms( (int) $t['id'], $t['taxonomy'], [ 'fields' => 'ids' ] );
          if ( is_wp_error( $ids ) ) {
            return null;
          }
          $ids = array_map( 'intval', $ids );
          sort( $ids );
          return $ids;
        },
        'write' => function ( $t, $state ) {
          $set = wp_set_object_terms( (int) $t['id'], array_map( 'intval', (array) $state ), $t['taxonomy'], false );
          if ( is_wp_error( $set ) ) {
            throw new Exception( $set->get_error_message() );
          }
        },
        'can' => function ( $t ) { return current_user_can( 'edit_post', (int) $t['id'] ); },
        'title' => function ( $t ) { return self::post_title( (int) $t['id'] ); },
      ],
      'term' => [
        'read' => function ( $t ) {
          $term = get_term( (int) $t['id'], $t['taxonomy'] ?: '' );
          if ( !$term || is_wp_error( $term ) ) {
            return null;
          }
          return [ 'name' => $term->name, 'slug' => $term->slug, 'description' => $term->description, 'parent' => (int) $term->parent ];
        },
        'write' => function ( $t, $state ) {
          $term = get_term( (int) $t['id'], $t['taxonomy'] );
          if ( !$term || is_wp_error( $term ) ) {
            throw new Exception( 'This term no longer exists.' );
          }
          if ( $state === null ) {
            // A created term is only removed while nothing uses it.
            if ( (int) $term->count > 0 ) {
              throw new Exception( sprintf( 'The term "%s" is now used by %d item(s), so it was kept.', $term->name, $term->count ) );
            }
            wp_delete_term( (int) $t['id'], $t['taxonomy'] );
            return;
          }
          $done = wp_update_term( (int) $t['id'], $t['taxonomy'], wp_slash( $state ) );
          if ( is_wp_error( $done ) ) {
            throw new Exception( $done->get_error_message() );
          }
        },
        'can' => function ( $t, $state ) {
          return current_user_can( $state === null ? 'delete_term' : 'edit_term', (int) $t['id'] );
        },
        'title' => function ( $t ) {
          $term = get_term( (int) $t['id'] );
          return $term && !is_wp_error( $term ) ? $term->name : '#' . $t['id'];
        },
      ],
      'comment' => [
        'read' => function ( $t ) {
          $comment = get_comment( (int) $t['id'], ARRAY_A );
          return $comment ? array_intersect_key( $comment, array_flip( [ 'comment_content', 'comment_approved',
            'comment_author', 'comment_author_email', 'comment_author_url' ] ) ) : null;
        },
        'write' => [ __CLASS__, 'write_comment' ],
        'can' => function ( $t ) { return current_user_can( 'edit_comment', (int) $t['id'] ); },
        'title' => function ( $t ) {
          $comment = get_comment( (int) $t['id'] );
          return $comment ? self::post_title( (int) $comment->comment_post_ID ) : '#' . $t['id'];
        },
      ],
      // The raw stored value: get_option() runs filters (translations, defaults) we must not save back.
      // It may hold secrets, so it is stored and never shown.
      'option' => [
        'recreates' => true,
        'read' => function ( $t ) {
          global $wpdb;
          $raw = $wpdb->get_var( $wpdb->prepare( "SELECT option_value FROM {$wpdb->options} WHERE option_name = %s LIMIT 1", $t['name'] ) );
          return $raw === null ? null : (string) $raw;
        },
        'write' => function ( $t, $state ) {
          if ( $state === null ) {
            delete_option( $t['name'] );
            return;
          }
          update_option( $t['name'], maybe_unserialize( $state ) );
        },
        'can' => function () { return current_user_can( 'manage_options' ); },
        'title' => function ( $t ) { return $t['name']; },
      ],
      'user' => [
        'read' => function ( $t ) {
          $user = get_userdata( (int) $t['id'] );
          if ( !$user ) {
            return null;
          }
          $state = [];
          foreach ( $t['fields'] as $field ) {
            $state[ $field ] = $field === 'role' ? implode( ',', $user->roles ) : (string) $user->get( $field );
          }
          return $state;
        },
        'write' => function ( $t, $state ) {
          if ( $state === null ) {
            throw new Exception( 'Users are never deleted by an undo.' );
          }
          $update = [ 'ID' => (int) $t['id'] ];
          foreach ( $state as $field => $value ) {
            if ( $field !== 'role' ) {
              $update[ $field ] = $value;
            }
          }
          if ( count( $update ) > 1 ) {
            $done = wp_update_user( $update );
            if ( is_wp_error( $done ) ) {
              throw new Exception( $done->get_error_message() );
            }
          }
          if ( isset( $state['role'] ) ) {
            $user = new WP_User( (int) $t['id'] );
            $roles = array_filter( explode( ',', $state['role'] ) );
            $user->set_role( (string) array_shift( $roles ) );
            foreach ( $roles as $role ) {
              $user->add_role( $role );
            }
          }
        },
        'can' => function ( $t, $state ) {
          return current_user_can( 'edit_user', (int) $t['id'] ) && ( !isset( $state['role'] ) || current_user_can( 'promote_user', (int) $t['id'] ) );
        },
        'title' => function ( $t ) {
          $user = get_userdata( (int) $t['id'] );
          return $user ? $user->display_name : '#' . $t['id'];
        },
      ],
    ];
  }

  public static function write_post( array $t, $state ) {
    $id = (int) $t['id'];
    $post = get_post( $id );
    if ( !$post ) {
      throw new Exception( "Post #{$id} no longer exists." );
    }
    // A created post goes to the trash, never deleted for good.
    if ( $state === null ) {
      if ( $post->post_status !== 'trash' && !wp_trash_post( $id ) ) {
        throw new Exception( "Post #{$id} could not be moved to the trash." );
      }
      return;
    }
    // Through the trash functions, so their hooks run, like wp_update_post the tool does.
    $status = $state['post_status'] ?? null;
    if ( $status !== null && $status !== 'trash' && $post->post_status === 'trash' ) {
      wp_untrash_post( $id );
    }
    elseif ( $status === 'trash' && $post->post_status !== 'trash' ) {
      wp_trash_post( $id );
      unset( $state['post_status'] );
    }
    $update = array_diff_key( $state, [ 'post_status' => 1 ] );
    if ( $status !== null && $status !== 'trash' ) {
      $update['post_status'] = $status;
    }
    if ( !$update ) {
      return;
    }
    $update['ID'] = $id;
    $post = get_post( $id );
    $floating = [ 'draft', 'pending', 'auto-draft' ];
    if ( isset( $update['post_date'] ) ) {
      $update['edit_date'] = true;
    }
    elseif ( $post->post_date_gmt === '0000-00-00 00:00:00' && in_array( $post->post_status, $floating, true )
      && in_array( $update['post_status'] ?? $post->post_status, $floating, true ) ) {
      // Same as keep_draft_date() in the tools: without it, wp_update_post() dates a draft to now.
      $update['post_date'] = $post->post_date;
      $update['edit_date'] = true;
    }
    $done = wp_update_post( wp_slash( $update ), true );
    if ( is_wp_error( $done ) ) {
      throw new Exception( $done->get_error_message() );
    }
  }

  public static function write_comment( array $t, $state ) {
    $id = (int) $t['id'];
    $comment = get_comment( $id );
    if ( !$comment ) {
      throw new Exception( "Comment #{$id} no longer exists." );
    }
    if ( $state === null ) {
      // Notes have no trash: core deletes them, as wp_delete_note does.
      wp_trash_comment( $id );
      return;
    }
    $status = (string) ( $state['comment_approved'] ?? '' );
    if ( $comment->comment_approved === 'trash' && $status !== 'trash' ) {
      wp_untrash_comment( $id );
    }
    elseif ( $status === 'trash' && $comment->comment_approved !== 'trash' ) {
      wp_trash_comment( $id );
      return;
    }
    $done = wp_update_comment( wp_slash( array_merge( $state, [ 'comment_ID' => $id ] ) ), true );
    if ( is_wp_error( $done ) ) {
      throw new Exception( $done->get_error_message() );
    }
  }
  #endregion

  #region Undo
  // $ids: one change, or a group the MCP tab shows as one row. Undone newest first: each one
  // brings the item back to the state the previous one left, so the drift checks still hold.
  public static function undo( array $ids, bool $force = false, array $context = [] ): array {
    $ids = array_values( array_unique( array_map( 'intval', $ids ) ) );
    rsort( $ids );
    $done = [];
    $changeIds = [];
    foreach ( $ids as $id ) {
      $result = self::undo_one( $id, $force, $context );
      if ( empty( $result['success'] ) ) {
        return array_merge( $result, [ 'undone' => $done, 'changeIds' => $changeIds ] );
      }
      $done[] = $id;
      if ( !empty( $result['changeId'] ) ) {
        $changeIds[] = $result['changeId'];
      }
    }
    return [ 'success' => true, 'undone' => $done, 'changeIds' => $changeIds, 'message' => self::undone_message( $ids ) ];
  }

  private static function undone_message( array $ids ): string {
    $row = $ids ? self::get( $ids[0] ) : null;
    $what = $row && $row['title'] !== '' ? '"' . $row['title'] . '"' : 'the item';
    return count( $ids ) > 1
      ? sprintf( 'Undid %d changes to %s.', count( $ids ), $what )
      : sprintf( 'Undid the change to %s.', $what );
  }

  public static function get( int $id ): ?array {
    if ( !self::table_exists() ) {
      return null;
    }
    global $wpdb;
    $row = $wpdb->get_row( $wpdb->prepare( 'SELECT * FROM ' . self::table() . ' WHERE id = %d', $id ), ARRAY_A );
    return $row ?: null;
  }

  // Whether this change can be undone right now: 'undoable', 'changed' (edited since),
  // 'undone', or 'none' (not undoable, see the note).
  public static function status( array $row ): string {
    if ( !empty( $row['undone_at'] ) ) {
      return 'undone';
    }
    if ( empty( $row['undoable'] ) || $row['before_state'] === null ) {
      return 'none';
    }
    try {
      return self::current_hash( $row ) === $row['after_hash'] ? 'undoable' : 'changed';
    }
    catch ( Throwable $e ) {
      return 'none';
    }
  }

  private static function entries( array $row ): array {
    $entries = json_decode( (string) $row['before_state'], true );
    return is_array( $entries ) ? $entries : [];
  }

  private static function current_hash( array $row ): string {
    $now = [];
    foreach ( self::entries( $row ) as $entry ) {
      $now[] = self::read( $entry['target'] );
    }
    return self::fingerprint( $now );
  }

  private static function undo_one( int $id, bool $force, array $context ): array {
    $row = self::get( $id );
    if ( !$row ) {
      return [ 'success' => false, 'code' => 'not_found', 'message' => "Change #{$id} was not found (changes are kept " . self::KEEP_DAYS . ' days).' ];
    }
    if ( !empty( $row['undone_at'] ) ) {
      return [ 'success' => false, 'code' => 'undone', 'message' => "Change #{$id} was already undone." ];
    }
    if ( empty( $row['undoable'] ) || $row['before_state'] === null ) {
      return [ 'success' => false, 'code' => 'not_undoable', 'message' => $row['note'] ?: "Change #{$id} cannot be undone." ];
    }
    $entries = self::entries( $row );
    try {
      foreach ( $entries as $entry ) {
        $kind = self::kind( $entry['target'] );
        if ( !call_user_func( $kind['can'], $entry['target'], $entry['state'] ) ) {
          return [ 'success' => false, 'code' => 'denied', 'message' => "You are not allowed to undo change #{$id}." ];
        }
      }
      $current = [];
      foreach ( $entries as $entry ) {
        $current[] = self::read( $entry['target'] );
      }
      if ( !$force && self::fingerprint( $current ) !== $row['after_hash'] ) {
        return [ 'success' => false, 'code' => 'changed',
          'message' => 'It was changed again since, so undoing would erase newer work. Open it to check.' ];
      }
      foreach ( array_reverse( $entries ) as $entry ) {
        call_user_func( self::kind( $entry['target'] )['write'], $entry['target'], $entry['state'] );
      }
      $after = [];
      $redo = [];
      foreach ( $entries as $i => $entry ) {
        $after[] = self::read( $entry['target'] );
        $redo[] = [ 'target' => $entry['target'], 'state' => $current[ $i ] ];
      }
    }
    catch ( Throwable $e ) {
      return [ 'success' => false, 'code' => 'failed', 'message' => $e->getMessage() ];
    }
    global $wpdb;
    $wpdb->update( self::table(), [ 'undone_at' => gmdate( 'Y-m-d H:i:s' ), 'undone_by' => get_current_user_id() ], [ 'id' => $id ] );
    // Journaled like any change, so the undo itself can be undone (a created post the undo
    // trashed comes back through its status).
    $changeId = self::insert( [ 'tool' => self::UNDO_TOOL, 'entries' => $redo, 'after' => $after, 'undo_of' => $id, 'title' => $row['title'] ] + $context );
    return [ 'success' => true, 'changeId' => $changeId ];
  }
  #endregion

  #region Listing
  // Newest first. $args: limit, days, user_id (only this user's changes), client, tool.
  public static function changes( array $args = [] ): array {
    if ( !self::table_exists() ) {
      return [];
    }
    global $wpdb;
    $where = [ 'time >= %s' ];
    $params = [ gmdate( 'Y-m-d H:i:s', time() - (int) ( $args['days'] ?? self::KEEP_DAYS ) * DAY_IN_SECONDS ) ];
    if ( !empty( $args['user_id'] ) ) {
      $where[] = 'user_id = %d';
      $params[] = (int) $args['user_id'];
    }
    foreach ( [ 'client', 'tool' ] as $field ) {
      if ( !empty( $args[ $field ] ) ) {
        $where[] = "$field = %s";
        $params[] = (string) $args[ $field ];
      }
    }
    $params[] = max( 1, min( 200, (int) ( $args['limit'] ?? 50 ) ) );
    $rows = $wpdb->get_results( $wpdb->prepare(
      'SELECT * FROM ' . self::table() . ' WHERE ' . implode( ' AND ', $where ) . ' ORDER BY id DESC LIMIT %d',
      $params
    ), ARRAY_A );
    return array_map( [ __CLASS__, 'present' ], $rows ?: [] );
  }

  // What may leave the site: never the stored states (options can hold secrets).
  public static function present( array $row ): array {
    $user = (int) $row['user_id'] ? get_userdata( (int) $row['user_id'] ) : null;
    $editUrl = null;
    if ( in_array( $row['object_type'], [ 'post', 'meta', 'post_terms', 'elementor', 'wc_product' ], true ) && (int) $row['object_id'] ) {
      $editUrl = get_edit_post_link( (int) $row['object_id'], 'raw' ) ?: null;
    }
    return [
      'id' => (int) $row['id'],
      'time' => strtotime( $row['time'] . ' UTC' ),
      'user' => $user ? $user->display_name : '',
      'client' => $row['client'],
      'tool' => $row['tool'],
      'objectType' => $row['object_type'],
      'objectId' => $row['object_id'],
      'title' => $row['title'],
      'note' => $row['note'],
      'undoOf' => $row['undo_of'] ? (int) $row['undo_of'] : null,
      'undoneAt' => $row['undone_at'] ? strtotime( $row['undone_at'] . ' UTC' ) : null,
      'status' => self::status( $row ),
      'editUrl' => $editUrl,
    ];
  }

  // For a group of changes shown as one row: the newest decides (undoing it comes first).
  public static function group_status( array $ids ): ?array {
    $ids = array_filter( array_map( 'intval', $ids ) );
    if ( !$ids ) {
      return null;
    }
    $row = self::get( max( $ids ) );
    return $row ? [ 'status' => self::status( $row ), 'note' => $row['note'] ] : null;
  }
  #endregion
}
