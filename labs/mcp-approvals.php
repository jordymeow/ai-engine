<?php

// Two guards an owner can put between an assistant and the live site, checked in execute_tool()
// before a tool runs (labs/mcp.php):
//
// - Approvals ("mcp_approvals": off, deletes, site): a gated call does not run. It is kept as a
//   request, the assistant gets a link to the MCP tab, and once the owner approves, the same
//   call (same user, tool and arguments) runs once, within 15 minutes. New installs ask before
//   deletes; updated sites stay off (classes/core.php), so scripts on the token keep working.
// - Drafts only ("mcp_drafts_only"): assistants create and edit drafts, never what is live.
//
// What can be undone (labs/mcp-undo.php) is not gated: approvals are for what can't be.
class Meow_MWAI_Labs_MCP_Approvals {
  public const OPTION = 'mwai_mcp_approvals';
  public const TTL = 15 * MINUTE_IN_SECONDS;
  // A request waits longer for a decision: the owner is not always watching the tab.
  public const PENDING_TTL = HOUR_IN_SECONDS;
  public const STATUS = 'pending_approval';

  private const DELETES = [ 'wp_delete_post', 'wp_delete_media', 'wp_delete_term', 'wp_delete_comment',
    'wp_delete_post_meta', 'wp_delete_plugin', 'wp_delete_theme', 'wp_plugin_delete_path', 'wp_theme_delete_path',
    'wc_delete_product', 'wc_delete_review' ];
  private const SITE_CHANGES = [ 'wp_update_option', 'wp_activate_plugin', 'wp_deactivate_plugin', 'wp_install_plugin',
    'wp_update_plugin', 'wp_install_theme', 'wp_update_theme', 'wp_switch_theme', 'wp_create_user', 'wp_update_user',
    'wp_plugin_put_file', 'wp_plugin_alter_file', 'wp_theme_put_file', 'wp_theme_alter_file', 'wp_db_query',
    'wc_bulk_update_stock', 'wc_update_order_status', 'wc_create_refund' ];

  // Drafts only: tools that work on one post, and the argument naming it.
  private const POST_TOOLS = [ 'wp_update_post' => 'ID', 'wp_alter_post' => 'ID', 'wp_write_blocks' => 'ID',
    'wp_edit_blocks' => 'ID', 'wp_insert_block_pattern' => 'ID', 'wp_update_post_meta' => 'ID', 'wp_delete_post_meta' => 'ID',
    'wp_set_featured_image' => 'post_id', 'wp_add_post_terms' => 'ID', 'wp_delete_post' => 'ID',
    'elementor_update_element' => 'post_id', 'elementor_replace_text' => 'post_id', 'elementor_insert_element' => 'post_id',
    'elementor_delete_element' => 'post_id', 'wc_update_product' => 'id', 'wc_alter_product' => 'id', 'wc_delete_product' => 'id', 'wp_update_seo' => 'ID', 'acf_update_fields' => 'ID', 'wp_restore_revision' => 'ID', 'wp_edit_shortcodes' => 'ID' ];
  // Always fine: a draft is not public, and neither are uploads, terms or editor notes until used.
  private const DRAFT_SAFE = [ 'wp_create_post', 'wc_create_product', 'wp_upload_media', 'wp_upload_request', 'wp_create_term',
    'wp_create_note', 'wp_update_note', 'wp_delete_note', 'mwai_image', 'wp_preview_link' ];
  private const DRAFT_STATUSES = [ 'draft', 'pending', 'auto-draft' ];

  #region Settings
  public static function level(): string {
    global $mwai_core;
    $level = (string) $mwai_core->get_option( 'mcp_approvals', 'off' );
    return in_array( $level, [ 'deletes', 'site' ], true ) ? $level : 'off';
  }

  public static function drafts_only(): bool {
    global $mwai_core;
    return (bool) $mwai_core->get_option( 'mcp_drafts_only', false );
  }

  public static function instructions(): array {
    $out = [];
    if ( self::drafts_only() ) {
      $out[] = 'This site lets assistants work on drafts only: create drafts and edit unpublished posts, never publish or change live content; the owner publishes.';
    }
    if ( self::level() !== 'off' ) {
      $out[] = 'Some actions need the site owner\'s approval. When a tool answers that it is waiting for approval, give the user the link, wait for them to approve, then call the same tool again with the same arguments.';
    }
    return $out;
  }
  #endregion

  #region Drafts only
  // Why a call is refused in drafts-only mode, or null. $args may be adjusted (a new post
  // without a status becomes a draft).
  public static function drafts_refusal( string $tool, array &$args ): ?string {
    $live = 'This site lets assistants work on drafts only, so this was not done. ';
    if ( in_array( $tool, self::DRAFT_SAFE, true ) ) {
      foreach ( [ 'post_status', 'status' ] as $key ) {
        if ( isset( $args[ $key ] ) && !in_array( $args[ $key ], self::DRAFT_STATUSES, true ) ) {
          return $live . 'Create it as a draft; the owner publishes it.';
        }
      }
      if ( $tool === 'wc_create_product' && !isset( $args['status'] ) ) {
        $args['status'] = 'draft';
      }
      return null;
    }
    if ( $tool === Meow_MWAI_Labs_MCP_Undo::UNDO_TOOL ) {
      $row = is_numeric( $args['id'] ?? null ) ? Meow_MWAI_Labs_MCP_Undo::get( (int) $args['id'] ) : null;
      if ( $row && in_array( $row['object_type'], [ 'post', 'meta', 'post_terms', 'elementor', 'wc_product' ], true )
        && !self::is_live( (int) $row['object_id'] ) ) {
        return null;
      }
      return $live . 'Only changes to drafts can be undone by an assistant here (pass the change ID, not "last"); the owner can undo the rest in the MCP tab.';
    }
    if ( !isset( self::POST_TOOLS[ $tool ] ) ) {
      return $live . 'It would change the live site; ask the owner to do it.';
    }
    $id = 0;
    foreach ( [ self::POST_TOOLS[ $tool ], 'ID', 'post_id', 'id' ] as $key ) {
      if ( !empty( $args[ $key ] ) && is_numeric( $args[ $key ] ) ) {
        $id = (int) $args[ $key ];
        break;
      }
    }
    if ( !$id || self::is_live( $id ) ) {
      return $live . "Post #{$id} is " . ( $id && get_post( $id ) ? 'live' : 'not a draft' ) . '. Make a draft copy to work on, and let the owner publish it.';
    }
    $fields = $args['fields'] ?? [];
    $fields = is_string( $fields ) ? ( json_decode( $fields, true ) ?: [] ) : (array) $fields;
    $status = $fields['post_status'] ?? $args['post_status'] ?? $args['status'] ?? null;
    if ( !empty( $args['schedule_for'] ) || ( $status !== null && !in_array( $status, array_merge( self::DRAFT_STATUSES, [ 'trash' ] ), true ) ) ) {
      return $live . 'Publishing and scheduling are left to the owner.';
    }
    return null;
  }

  private static function is_live( int $id ): bool {
    $post = get_post( $id );
    return !$post || !in_array( $post->post_status, self::DRAFT_STATUSES, true );
  }
  #endregion

  #region Approvals
  public static function needs_approval( string $tool, array $args ): bool {
    $level = self::level();
    if ( $level === 'off' ) {
      return false;
    }
    $gated = in_array( $tool, self::DELETES, true ) || (bool) preg_match( '/(^|_)delete(_|$)/', $tool );
    if ( !$gated && $level === 'site' ) {
      $gated = in_array( $tool, self::SITE_CHANGES, true );
      // Reading the database needs no approval.
      if ( $tool === 'wp_db_query' && preg_match( '/^\s*(select|show|describe|desc|explain)\b/i', (string) ( $args['query'] ?? $args['sql'] ?? '' ) ) ) {
        $gated = false;
      }
    }
    // Editor notes are not content: deleting one is like deleting a sticky note.
    if ( $tool === 'wp_delete_note' ) {
      $gated = false;
    }
    return (bool) apply_filters( 'mwai_mcp_needs_approval', $gated, $tool, $args );
  }

  private static function key( string $tool, array $args ): string {
    $sort = function ( $value ) use ( &$sort ) {
      if ( !is_array( $value ) ) {
        return $value;
      }
      ksort( $value );
      return array_map( $sort, $value );
    };
    return substr( md5( get_current_user_id() . '|' . $tool . '|' . wp_json_encode( $sort( $args ) ) ), 0, 16 );
  }

  private static function all(): array {
    $items = get_option( self::OPTION, [] );
    $items = is_array( $items ) ? $items : [];
    // A request waits an hour for a decision; an approval then waits 15 minutes for its call.
    return array_filter( $items, function ( $item ) {
      $ttl = ( $item['status'] ?? '' ) === 'pending' ? self::PENDING_TTL : self::TTL;
      return time() - (int) ( $item['updated'] ?? 0 ) < $ttl;
    } );
  }

  private static function save( array $items ) {
    update_option( self::OPTION, $items, false );
  }

  // Called before a gated tool runs. Returns null when the call may run (it was approved:
  // the approval is used up), or the message for the assistant.
  public static function gate( string $tool, array $args, string $client ): ?string {
    $key = self::key( $tool, $args );
    $items = self::all();
    $item = $items[ $key ] ?? null;
    if ( $item && $item['status'] === 'approved' ) {
      unset( $items[ $key ] );
      self::save( $items );
      return null;
    }
    $link = admin_url( 'admin.php?page=mwai_settings&nekoTab=mcp' );
    if ( $item && $item['status'] === 'declined' ) {
      unset( $items[ $key ] );
      self::save( $items );
      return 'The site owner declined this: ' . $item['summary'] . '. Do not try it again unless they ask.';
    }
    if ( !$item ) {
      $items[ $key ] = [
        'key' => $key,
        'tool' => $tool,
        'args' => $args,
        'summary' => self::describe( $tool, $args ),
        'user_id' => get_current_user_id(),
        'client' => $client,
        'status' => 'pending',
        'created' => time(),
        'updated' => time(),
      ];
      self::save( $items );
    }
    $summary = $items[ $key ]['summary'];
    return "Waiting for the site owner's approval, so nothing was done yet: {$summary}. Ask the user to approve it in AI Engine → MCP: {$link} . Once they have, call this tool again with exactly the same arguments (within 15 minutes).";
  }

  public static function decide( string $key, bool $approve ): bool {
    $items = self::all();
    if ( !isset( $items[ $key ] ) || $items[ $key ]['status'] !== 'pending' ) {
      return false;
    }
    $items[ $key ]['status'] = $approve ? 'approved' : 'declined';
    $items[ $key ]['updated'] = time();
    $items[ $key ]['decided_by'] = get_current_user_id();
    self::save( $items );
    return true;
  }

  // For the MCP tab.
  public static function pending(): array {
    $out = [];
    foreach ( self::all() as $item ) {
      if ( $item['status'] !== 'pending' ) {
        continue;
      }
      $user = get_userdata( (int) $item['user_id'] );
      $args = wp_json_encode( $item['args'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );
      $out[] = [
        'key' => $item['key'],
        'tool' => $item['tool'],
        'summary' => $item['summary'],
        'args' => mb_strlen( $args ) > 600 ? mb_substr( $args, 0, 597 ) . '...' : $args,
        'client' => $item['client'],
        'user' => $user ? $user->display_name : '',
        'time' => (int) $item['created'],
        'expires' => (int) $item['updated'] + self::PENDING_TTL,
      ];
    }
    return array_values( $out );
  }

  // What the call would do, in plain words, for the owner and in the reply to the assistant.
  public static function describe( string $tool, array $a ): string {
    $post = function ( $id ) {
      $p = get_post( (int) $id );
      return $p ? '"' . html_entity_decode( get_the_title( $p ), ENT_QUOTES, 'UTF-8' ) . '" (#' . $p->ID . ')' : '#' . (int) $id;
    };
    $force = !empty( $a['force'] );
    switch ( $tool ) {
      case 'wp_delete_post':
        return ( $force ? 'Delete for good ' : 'Move to the trash ' ) . $post( $a['ID'] ?? $a['post_id'] ?? $a['id'] ?? 0 );
      case 'wp_delete_media':
        return ( $force ? 'Delete for good the media ' : 'Move to the trash the media ' ) . $post( $a['ID'] ?? 0 );
      case 'wc_delete_product':
        return ( $force ? 'Delete for good the product ' : 'Move to the trash the product ' ) . $post( $a['id'] ?? 0 );
      case 'wp_delete_term':
        $term = get_term( (int) ( $a['term_id'] ?? 0 ) );
        return 'Delete the term ' . ( $term && !is_wp_error( $term ) ? '"' . $term->name . '"' : '#' . (int) ( $a['term_id'] ?? 0 ) );
      case 'wp_delete_comment':
        $comment = get_comment( (int) ( $a['comment_ID'] ?? 0 ) );
        return ( $force ? 'Delete for good a comment' : 'Move to the trash a comment' ) . ( $comment ? ' by ' . $comment->comment_author . ' on ' . $post( $comment->comment_post_ID ) : '' );
      case 'wp_delete_post_meta':
        return 'Delete the field "' . ( $a['key'] ?? '' ) . '" of ' . $post( $a['ID'] ?? 0 );
      case 'wp_update_option':
        return 'Change the setting "' . ( $a['key'] ?? '' ) . '"';
      case 'wp_activate_plugin':
      case 'wp_deactivate_plugin':
      case 'wp_install_plugin':
      case 'wp_update_plugin':
      case 'wp_delete_plugin':
        $verb = [ 'wp_activate_plugin' => 'Activate', 'wp_deactivate_plugin' => 'Deactivate', 'wp_install_plugin' => 'Install',
          'wp_update_plugin' => 'Update', 'wp_delete_plugin' => 'Delete' ][ $tool ];
        return "$verb the plugin \"" . ( $a['slug'] ?? '' ) . '"';
      case 'wp_switch_theme':
        return 'Switch the theme to "' . ( $a['slug'] ?? '' ) . '"';
      case 'wp_create_user':
        return 'Create the user "' . ( $a['user_login'] ?? '' ) . '"' . ( !empty( $a['role'] ) ? ' as ' . $a['role'] : '' );
      case 'wp_update_user':
        $user = get_userdata( (int) ( $a['ID'] ?? 0 ) );
        $fields = array_keys( is_array( $a['fields'] ?? null ) ? $a['fields'] : [] );
        return 'Change ' . ( $fields ? implode( ', ', $fields ) : 'the account' ) . ' of the user ' . ( $user ? '"' . $user->display_name . '"' : '#' . (int) ( $a['ID'] ?? 0 ) );
      case 'wp_db_query':
        $sql = trim( (string) ( $a['query'] ?? $a['sql'] ?? '' ) );
        return 'Run this SQL query: ' . ( mb_strlen( $sql ) > 160 ? mb_substr( $sql, 0, 157 ) . '...' : $sql );
    }
    if ( preg_match( '/_(put|alter)_file$|_delete_path$/', $tool ) ) {
      return ( strpos( $tool, 'delete' ) !== false ? 'Delete ' : 'Write the file ' ) . '"' . ( $a['path'] ?? '' ) . '" in "' . ( $a['slug'] ?? '' ) . '"';
    }
    return 'Run ' . $tool;
  }
  #endregion
}
