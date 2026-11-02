<?php

// Smaller everyday tools for MCP: moderate comments in bulk, share a draft with a preview link that
// works without logging in, manage redirects (Redirection plugin) and read form entries (Contact
// Form 7 through Flamingo, Fluent Forms, Ninja Forms). Part of the core set; the plugin tools are
// listed only when their plugin is active.
class Meow_MWAI_Labs_MCP_Extras {
  public const PREVIEW_META = '_mwai_preview';
  private const MODERATION = [ 'approve', 'hold', 'spam', 'trash' ];

  public function __construct() {
    add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
    // A shared preview is opened by anyone: these hooks run on the front end, for that link only.
    if ( !empty( $_GET['mwai_preview'] ) && !is_admin() ) {
      add_filter( 'posts_results', [ $this, 'open_shared_preview' ], 10, 2 );
    }
  }

  public function rest_api_init() {
    add_filter( 'mwai_mcp_tools', [ $this, 'register_tools' ] );
    add_filter( 'mwai_mcp_callback', [ $this, 'handle_call' ], 10, 4 );
    add_filter( 'mwai_mcp_undo_targets', [ $this, 'undo_targets' ], 10, 3 );
    add_filter( 'mwai_mcp_undo_kinds', [ $this, 'undo_kinds' ] );
  }

  // Redirection creates its tables in its setup wizard, not on activation.
  private static function has_redirection(): bool {
    static $ready = null;
    if ( $ready === null ) {
      global $wpdb;
      $table = $wpdb->prefix . 'redirection_items';
      $ready = class_exists( 'Red_Item' ) && class_exists( 'Red_Group' )
        && $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $wpdb->esc_like( $table ) ) ) === $table;
    }
    return $ready;
  }

  private static function form_plugins(): array {
    $plugins = [];
    if ( class_exists( 'Flamingo_Inbound_Message' ) ) {
      $plugins['flamingo'] = 'Contact Form 7 (Flamingo)';
    }
    if ( defined( 'FLUENTFORM' ) || function_exists( 'wpFluentForm' ) ) {
      $plugins['fluentform'] = 'Fluent Forms';
    }
    if ( function_exists( 'Ninja_Forms' ) ) {
      $plugins['ninja_forms'] = 'Ninja Forms';
    }
    return $plugins;
  }

  #region Tools
  private function tools(): array {
    $tools = [
      'wp_moderate_comments' => [
        'name' => 'wp_moderate_comments',
        'description' => 'Moderate comments in bulk: set "status" to approve, hold (back to pending), spam or trash for every comment in "ids". Find pending ones with wp_get_comments status "hold". Can be undone with mcp_undo_change.',
        'inputSchema' => [ 'type' => 'object', 'properties' => [
          'ids' => [ 'type' => 'array', 'items' => [ 'type' => 'integer' ], 'description' => 'Comment IDs (max 100).' ],
          'status' => [ 'type' => 'string', 'enum' => self::MODERATION ],
        ], 'required' => [ 'ids', 'status' ] ],
        'accessLevel' => 'write',
      ],
      'wp_preview_link' => [
        'name' => 'wp_preview_link',
        'description' => 'Get a link to preview a draft. By default the WordPress preview, which needs the person to be logged in. With share: true, a link anyone can open without an account (for a client or a colleague), valid "days" days (default 3, max 30), never indexed by search engines. revoke: true turns a shared link off.',
        'inputSchema' => [ 'type' => 'object', 'properties' => [
          'ID' => [ 'type' => 'integer', 'description' => 'The draft\'s ID.' ],
          'share' => [ 'type' => 'boolean' ],
          'days' => [ 'type' => 'integer' ],
          'revoke' => [ 'type' => 'boolean' ],
        ], 'required' => [ 'ID' ] ],
        'accessLevel' => 'write',
      ],
    ];
    if ( self::has_redirection() ) {
      $tools['wp_get_redirects'] = [
        'name' => 'wp_get_redirects',
        'description' => 'List the redirects of the Redirection plugin: source path, target, HTTP code (301, 302, 307, 410...), hits and whether each is enabled. Pass search to filter by source or target.',
        'inputSchema' => [ 'type' => 'object', 'properties' => [
          'search' => [ 'type' => 'string' ],
          'limit' => [ 'type' => 'integer', 'description' => 'Default 50, max 200.' ],
        ] ],
        'accessLevel' => 'read',
      ];
      $tools['wp_save_redirect'] = [
        'name' => 'wp_save_redirect',
        'description' => 'Create a redirect in the Redirection plugin ("source" path like /old-page, "target" URL or path, "code" 301 by default, or 410 for gone without target), or change one by id (any of source, target, code, enabled). Can be undone with mcp_undo_change.',
        'inputSchema' => [ 'type' => 'object', 'properties' => [
          'id' => [ 'type' => 'integer', 'description' => 'The redirect to change; omit to create one.' ],
          'source' => [ 'type' => 'string' ],
          'target' => [ 'type' => 'string' ],
          'code' => [ 'type' => 'integer', 'enum' => [ 301, 302, 307, 308, 410 ] ],
          'enabled' => [ 'type' => 'boolean' ],
        ] ],
        'accessLevel' => 'write',
      ];
    }
    if ( self::form_plugins() ) {
      $tools['wp_get_form_entries'] = [
        'name' => 'wp_get_form_entries',
        'description' => 'Read what visitors sent through the site\'s forms (' . implode( ', ', self::form_plugins() ) . '). Without "form", lists the forms and how many entries each has. With "form" (its ID or name), the latest entries, newest first, with every field. Entries hold personal data: summarize them for the owner, never publish them.',
        'inputSchema' => [ 'type' => 'object', 'properties' => [
          'form' => [ 'type' => 'string', 'description' => 'A form ID or name from the list.' ],
          'plugin' => [ 'type' => 'string', 'enum' => array_keys( self::form_plugins() ) ],
          'limit' => [ 'type' => 'integer', 'description' => 'Default 20, max 100.' ],
        ] ],
        'accessLevel' => 'admin',
      ];
    }
    return $tools;
  }

  public function register_tools( array $prev ): array {
    foreach ( $this->tools() as $name => $tool ) {
      $tool['annotations'] = [ 'readOnlyHint' => strpos( $name, '_get_' ) !== false, 'destructiveHint' => false, 'openWorldHint' => false ];
      $prev[] = $tool;
    }
    return $prev;
  }

  public function handle_call( $prev, string $tool, array $args, $id ) {
    if ( !empty( $prev ) || !isset( $this->tools()[ $tool ] ) ) {
      return $prev;
    }
    switch ( $tool ) {
      case 'wp_moderate_comments':
        return $this->moderate( $args );
      case 'wp_preview_link':
        return $this->preview_link( $args );
      case 'wp_get_redirects':
      case 'wp_save_redirect':
        if ( !current_user_can( 'manage_options' ) ) {
          throw new Exception( 'Redirects need an administrator.', Meow_MWAI_Labs_MCP::DENIED_CODE );
        }
        return $tool === 'wp_get_redirects' ? $this->redirects( $args ) : $this->save_redirect( $args );
      case 'wp_get_form_entries':
        if ( !current_user_can( 'manage_options' ) ) {
          throw new Exception( 'Form entries need an administrator.', Meow_MWAI_Labs_MCP::DENIED_CODE );
        }
        return $this->form_entries( $args );
    }
    return $prev;
  }
  #endregion

  #region Comments
  private static function ids( $value ): array {
    $ids = is_string( $value ) ? json_decode( $value, true ) : $value;
    return array_slice( array_values( array_unique( array_filter( array_map( 'intval', (array) $ids ) ) ) ), 0, 100 );
  }

  private function moderate( array $a ): array {
    $status = (string) ( $a['status'] ?? '' );
    if ( !in_array( $status, self::MODERATION, true ) ) {
      throw new Exception( '"status" must be approve, hold, spam or trash.' );
    }
    $done = [];
    $skipped = [];
    foreach ( self::ids( $a['ids'] ?? [] ) as $comment_id ) {
      $comment = get_comment( $comment_id );
      if ( !$comment || $comment->comment_type === 'note' || !current_user_can( 'edit_comment', $comment_id ) ) {
        $skipped[] = $comment_id;
        continue;
      }
      // Out of the trash or spam first, so WordPress clears its own markers.
      if ( $comment->comment_approved === 'trash' && $status !== 'trash' ) {
        wp_untrash_comment( $comment_id );
      }
      elseif ( $comment->comment_approved === 'spam' && $status !== 'spam' ) {
        wp_unspam_comment( $comment_id );
      }
      if ( wp_set_comment_status( $comment_id, $status ) ) {
        $done[] = $comment_id;
      }
      else {
        $skipped[] = $comment_id;
      }
    }
    return [ 'status' => $status, 'done' => $done, 'skipped' => $skipped ];
  }
  #endregion

  #region Preview links
  private function preview_link( array $a ): array {
    $post = get_post( (int) ( $a['ID'] ?? $a['post_id'] ?? 0 ) );
    if ( !$post ) {
      throw new Exception( 'Post not found.' );
    }
    if ( !current_user_can( 'edit_post', $post->ID ) ) {
      throw new Exception( "You are not allowed to edit post #{$post->ID}.", Meow_MWAI_Labs_MCP::DENIED_CODE );
    }
    if ( !empty( $a['revoke'] ) ) {
      delete_post_meta( $post->ID, self::PREVIEW_META );
      return [ 'ID' => $post->ID, 'revoked' => true ];
    }
    if ( $post->post_status === 'publish' ) {
      return [ 'ID' => $post->ID, 'url' => get_permalink( $post ), 'note' => 'This is already published: anyone can see it at its address.' ];
    }
    if ( empty( $a['share'] ) ) {
      return [ 'ID' => $post->ID, 'url' => get_preview_post_link( $post ), 'note' => 'Opens for people logged in who can edit it. Pass share: true for a link anyone can open.' ];
    }
    $days = max( 1, min( 30, (int) ( $a['days'] ?? 3 ) ) );
    $token = wp_generate_password( 24, false );
    update_post_meta( $post->ID, self::PREVIEW_META, [ 'token' => wp_hash( $token ), 'expires' => time() + $days * DAY_IN_SECONDS ] );
    return [ 'ID' => $post->ID, 'url' => add_query_arg( 'mwai_preview', $token, get_preview_post_link( $post ) ),
      'expires' => gmdate( 'Y-m-d H:i', time() + $days * DAY_IN_SECONDS ) . ' UTC',
      'note' => 'Anyone with this link can see the draft until then, without logging in. revoke: true turns it off.' ];
  }

  // The shared link: the draft is shown to a visitor who is not logged in, as the Public Post
  // Preview plugin does, only for the post the token was made for, and never indexed.
  public function open_shared_preview( $posts, $query ) {
    if ( !$query->is_main_query() || count( $posts ) !== 1 || is_user_logged_in() ) {
      return $posts;
    }
    $data = get_post_meta( $posts[0]->ID, self::PREVIEW_META, true );
    $token = sanitize_text_field( wp_unslash( $_GET['mwai_preview'] ) );
    if ( !is_array( $data ) || ( $data['expires'] ?? 0 ) < time() || !hash_equals( (string) ( $data['token'] ?? '' ), wp_hash( $token ) ) ) {
      return $posts;
    }
    if ( in_array( $posts[0]->post_status, [ 'draft', 'pending', 'future', 'auto-draft' ], true ) ) {
      $posts[0]->post_status = 'publish';
      add_filter( 'wp_robots', 'wp_robots_no_robots' );
      nocache_headers();
    }
    return $posts;
  }
  #endregion

  #region Redirects
  private static function redirect_row( $item ): array {
    $data = $item->get_action_data();
    return [ 'id' => (int) $item->get_id(), 'source' => $item->get_url(), 'target' => is_string( $data ) ? $data : '',
      'code' => (int) $item->get_action_code(), 'enabled' => $item->is_enabled(), 'hits' => (int) $item->get_hits(), 'regex' => $item->is_regex() ];
  }

  private function redirects( array $a ): array {
    global $wpdb;
    $limit = max( 1, min( 200, (int) ( $a['limit'] ?? 50 ) ) );
    $search = trim( (string) ( $a['search'] ?? '' ) );
    $table = $wpdb->prefix . 'redirection_items';
    $ids = $search === ''
      ? $wpdb->get_col( $wpdb->prepare( "SELECT id FROM $table ORDER BY id DESC LIMIT %d", $limit ) )
      : $wpdb->get_col( $wpdb->prepare(
        "SELECT id FROM $table WHERE url LIKE %s OR action_data LIKE %s ORDER BY id DESC LIMIT %d",
        '%' . $wpdb->esc_like( $search ) . '%',
        '%' . $wpdb->esc_like( $search ) . '%',
        $limit
      ) );
    return [ 'redirects' => array_values( array_filter( array_map( function ( $id ) {
      $item = Red_Item::get_by_id( (int) $id );
      return $item ? self::redirect_row( $item ) : null;
    }, $ids ) ) ) ];
  }

  // What Red_Item::create() and update() take, from our simpler fields.
  private static function redirect_details( array $a, $item = null ): array {
    $code = (int) ( $a['code'] ?? ( $item ? $item->get_action_code() : 301 ) );
    $source = isset( $a['source'] ) ? (string) $a['source'] : ( $item ? $item->get_url() : '' );
    $target = isset( $a['target'] ) ? (string) $a['target'] : ( $item && is_string( $item->get_action_data() ) ? $item->get_action_data() : '' );
    if ( $source === '' ) {
      throw new Exception( 'A redirect needs a "source" path, like /old-page.' );
    }
    if ( $code !== 410 && $target === '' ) {
      throw new Exception( 'A redirect needs a "target" (or code 410 for a page that is gone).' );
    }
    $groups = Red_Group::get_for_select();
    $group_id = $item ? $item->get_group_id() : (int) ( array_key_first( (array) reset( $groups ) ) ?? 1 );
    return [ 'url' => $source, 'match_type' => 'url', 'group_id' => $group_id, 'regex' => $item ? $item->is_regex() : false,
      'action_type' => $code === 410 ? 'error' : 'url', 'action_code' => $code, 'action_data' => [ 'url' => $code === 410 ? '' : $target ] ];
  }

  private function save_redirect( array $a ): array {
    if ( !empty( $a['id'] ) ) {
      $item = Red_Item::get_by_id( (int) $a['id'] );
      if ( !$item ) {
        throw new Exception( 'Redirect not found.' );
      }
      if ( array_intersect( array_keys( $a ), [ 'source', 'target', 'code' ] ) ) {
        $done = $item->update( self::redirect_details( $a, $item ) );
        if ( is_wp_error( $done ) ) {
          throw new Exception( $done->get_error_message() );
        }
      }
      if ( isset( $a['enabled'] ) ) {
        $a['enabled'] ? $item->enable() : $item->disable();
      }
      return self::redirect_row( Red_Item::get_by_id( (int) $a['id'] ) );
    }
    $item = Red_Item::create( self::redirect_details( $a ) );
    if ( is_wp_error( $item ) ) {
      throw new Exception( $item->get_error_message() );
    }
    return self::redirect_row( $item );
  }

  // The redirect with this id, or the newest one for this source (what a creation made).
  private static function find_redirect( array $t ) {
    global $wpdb;
    if ( !empty( $t['id'] ) ) {
      return Red_Item::get_by_id( (int) $t['id'] ) ?: null;
    }
    $id = $wpdb->get_var( $wpdb->prepare( "SELECT id FROM {$wpdb->prefix}redirection_items WHERE url = %s ORDER BY id DESC LIMIT 1", $t['source'] ) );
    return $id ? ( Red_Item::get_by_id( (int) $id ) ?: null ) : null;
  }
  #endregion

  #region Form entries
  private function form_entries( array $a ): array {
    $plugins = self::form_plugins();
    $only = (string) ( $a['plugin'] ?? '' );
    $form = trim( (string) ( $a['form'] ?? '' ) );
    $limit = max( 1, min( 100, (int) ( $a['limit'] ?? 20 ) ) );
    if ( $form === '' ) {
      $out = [];
      foreach ( $plugins as $key => $name ) {
        if ( !$only || $only === $key ) {
          $out[ $name ] = $this->{ 'forms_' . $key }();
        }
      }
      return [ 'forms' => $out, 'note' => 'Pass "form" (an ID or name) to read its entries.' ];
    }
    foreach ( $plugins as $key => $name ) {
      if ( $only && $only !== $key ) {
        continue;
      }
      foreach ( $this->{ 'forms_' . $key }() as $row ) {
        if ( (string) $row['id'] === $form || strcasecmp( $row['name'], $form ) === 0 ) {
          return [ 'plugin' => $name, 'form' => $row['name'], 'entries' => $this->{ 'entries_' . $key }( $row['id'], $limit ) ];
        }
      }
    }
    throw new Exception( "No form \"$form\". Call wp_get_form_entries without \"form\" to list them." );
  }

  // Contact Form 7 keeps nothing; Flamingo stores each message, filed under the form's channel.
  private function forms_flamingo(): array {
    $out = [];
    foreach ( get_terms( [ 'taxonomy' => Flamingo_Inbound_Message::channel_taxonomy, 'hide_empty' => false ] ) as $term ) {
      $out[] = [ 'id' => $term->slug, 'name' => $term->name, 'entries' => (int) $term->count ];
    }
    return $out;
  }

  private function entries_flamingo( $channel, int $limit ): array {
    return array_map( function ( $message ) {
      return [ 'date' => get_post_field( 'post_date', $message->id() ), 'from' => $message->from, 'subject' => $message->subject, 'fields' => $message->fields ];
    }, Flamingo_Inbound_Message::find( [ 'channel' => $channel, 'posts_per_page' => $limit, 'post_status' => 'publish' ] ) );
  }

  private function forms_fluentform(): array {
    global $wpdb;
    return array_map( function ( $row ) {
      return [ 'id' => (int) $row['id'], 'name' => $row['title'], 'entries' => (int) $row['entries'] ];
    }, $wpdb->get_results( "SELECT f.id, f.title, COUNT(s.id) AS entries FROM {$wpdb->prefix}fluentform_forms f
      LEFT JOIN {$wpdb->prefix}fluentform_submissions s ON s.form_id = f.id AND s.status != 'trashed' GROUP BY f.id ORDER BY f.id DESC", ARRAY_A ) ?: [] );
  }

  private function entries_fluentform( $form_id, int $limit ): array {
    global $wpdb;
    return array_map( function ( $row ) {
      $fields = json_decode( (string) $row['response'], true ) ?: [];
      unset( $fields['_wp_http_referer'], $fields['__fluent_form_embded_post_id'] );
      foreach ( array_keys( $fields ) as $key ) {
        if ( strpos( $key, '_fluentform_' ) === 0 ) {
          unset( $fields[ $key ] );
        }
      }
      return [ 'date' => $row['created_at'], 'status' => $row['status'], 'fields' => $fields ];
    }, $wpdb->get_results( $wpdb->prepare( "SELECT response, status, created_at FROM {$wpdb->prefix}fluentform_submissions
      WHERE form_id = %d AND status != 'trashed' ORDER BY id DESC LIMIT %d", (int) $form_id, $limit ), ARRAY_A ) ?: [] );
  }

  private function forms_ninja_forms(): array {
    $out = [];
    foreach ( Ninja_Forms()->form()->get_forms() as $form ) {
      $out[] = [ 'id' => (int) $form->get_id(), 'name' => $form->get_setting( 'title' ),
        'entries' => count( get_posts( [ 'post_type' => 'nf_sub', 'numberposts' => -1, 'fields' => 'ids', 'meta_key' => '_form_id', 'meta_value' => $form->get_id() ] ) ) ];
    }
    return $out;
  }

  private function entries_ninja_forms( $form_id, int $limit ): array {
    $labels = [];
    foreach ( Ninja_Forms()->form( (int) $form_id )->get_fields() as $field ) {
      $labels[ $field->get_id() ] = $field->get_setting( 'label' ) ?: $field->get_setting( 'key' );
    }
    $out = [];
    foreach ( array_slice( Ninja_Forms()->form( (int) $form_id )->get_subs(), 0, $limit ) as $sub ) {
      $fields = [];
      foreach ( $sub->get_field_values() as $key => $value ) {
        if ( preg_match( '/^_field_(\d+)$/', $key, $m ) && isset( $labels[ (int) $m[1] ] ) && $value !== '' ) {
          $fields[ $labels[ (int) $m[1] ] ] = $value;
        }
      }
      $out[] = [ 'date' => $sub->get_sub_date( 'Y-m-d H:i:s' ), 'fields' => $fields ];
    }
    return $out;
  }
  #endregion

  #region Undo (labs/mcp-undo.php)
  public function undo_targets( $targets, string $tool, array $a ) {
    switch ( $tool ) {
      case 'wp_moderate_comments':
        return array_map( function ( $id ) { return [ 'kind' => 'comment', 'id' => $id ]; }, self::ids( $a['ids'] ?? [] ) ) ?: null;
      case 'wp_preview_link':
        $id = (int) ( $a['ID'] ?? $a['post_id'] ?? 0 );
        return $id ? [ [ 'kind' => 'meta', 'id' => $id, 'key' => self::PREVIEW_META ] ] : null;
      case 'wp_save_redirect':
        if ( !self::has_redirection() ) {
          return null;
        }
        return [ !empty( $a['id'] ) ? [ 'kind' => 'redirect', 'id' => (int) $a['id'] ] : [ 'kind' => 'redirect', 'source' => (string) ( $a['source'] ?? '' ) ] ];
    }
    return $targets;
  }

  public function undo_kinds( array $kinds ): array {
    if ( !self::has_redirection() ) {
      return $kinds;
    }
    $kinds['redirect'] = [
      'recreates' => true,
      'read' => function ( $t ) {
        $item = self::find_redirect( $t );
        // Without the ID and hits: a redirect recreated by an undo gets a new ID.
        return $item ? array_diff_key( self::redirect_row( $item ), [ 'hits' => 1, 'id' => 1 ] ) : null;
      },
      'write' => function ( $t, $state ) {
        $item = self::find_redirect( $t );
        if ( $state === null ) {
          if ( $item ) {
            $item->delete();
          }
          return;
        }
        if ( !$item ) {
          $item = Red_Item::create( self::redirect_details( $state ) );
          if ( is_wp_error( $item ) ) {
            throw new Exception( $item->get_error_message() );
          }
        }
        else {
          $item->update( self::redirect_details( $state, $item ) );
        }
        $state['enabled'] ? $item->enable() : $item->disable();
      },
      'can' => function () { return current_user_can( 'manage_options' ); },
      'title' => function ( $t ) {
        $item = self::find_redirect( $t );
        return 'Redirect ' . ( $item ? $item->get_url() : ( $t['source'] ?? '' ) );
      },
    ];
    return $kinds;
  }
  #endregion
}
