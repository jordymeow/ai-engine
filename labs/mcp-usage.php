<?php

// A light usage counter for the MCP tab, free for everyone: calls, errors and changes per day,
// per tool and per assistant, kept 35 days in one option. Pro keeps the full per-call log in
// Insights (premium/statistics.php); this only adds counts, never arguments or content.
class Meow_MWAI_Labs_MCP_Usage {
  public const OPTION = 'mwai_mcp_usage';
  public const RECENT_OPTION = 'mwai_mcp_recent';
  public const RECENT_MAX = 20;
  public const KEEP_DAYS = 35;
  public const BACKFILL_OPTION = 'mwai_mcp_usage_backfilled';

  private static $mcp = null;

  public function __construct( $mcp = null ) {
    self::$mcp = $mcp;
    add_action( 'mwai_mcp_tool_called', [ $this, 'record' ] );
  }

  // This counter is new in 3.8.8, but sites that log every call in Insights already have the
  // history. Rebuild the counts from it once, so the tab opens on real weeks, not on samples.
  // The logs keep no arguments unless payload logging is on, so an "action" style tool is never
  // counted as a change here.
  private static function maybe_backfill() {
    if ( get_option( self::BACKFILL_OPTION ) ) {
      return;
    }
    // Flagged first: a failure here must never retry on every load.
    update_option( self::BACKFILL_OPTION, 1, false );
    global $wpdb;
    $table = $wpdb->prefix . 'mwai_logs';
    if ( $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $wpdb->esc_like( $table ) ) ) !== $table ) {
      return;
    }
    $from = gmdate( 'Y-m-d 00:00:00', time() - self::KEEP_DAYS * DAY_IN_SECONDS );
    $rows = $wpdb->get_results( $wpdb->prepare(
      "SELECT DATE(time) AS day, scope, stats FROM $table WHERE feature = 'mcp_tool' AND time >= %s", $from
    ), ARRAY_A );
    if ( empty( $rows ) ) {
      return;
    }
    $writes = [];
    $built = [];
    foreach ( $rows as $row ) {
      $tool = (string) $row['scope'];
      if ( $tool === '' || $tool === 'mcp_ping' ) {
        continue;
      }
      $stats = json_decode( (string) $row['stats'], true );
      $stats = is_array( $stats ) ? $stats : [];
      if ( !isset( $writes[ $tool ] ) ) {
        $writes[ $tool ] = self::$mcp && method_exists( self::$mcp, 'is_write_call' ) && self::$mcp->is_write_call( $tool );
      }
      $day = $row['day'];
      $entry = $built[ $day ] ?? [ 'c' => 0, 'e' => 0, 'w' => 0, 't' => [], 'a' => [] ];
      // A call that changed nothing (the same featured image set again) is not a change.
    if ( $writes && stripos( (string) wp_json_encode( $event['result'] ?? '' ), 'already set' ) !== false ) {
      $writes = false;
    }
    $entry['c']++;
      if ( ( $stats['status'] ?? 'success' ) !== 'success' ) {
        $entry['e']++;
      }
      elseif ( $writes[ $tool ] ) {
        $entry['w']++;
      }
      $entry['t'][ $tool ] = ( $entry['t'][ $tool ] ?? 0 ) + 1;
      $client = !empty( $stats['client_name'] ) ? (string) $stats['client_name']
        : ( ( $stats['auth_method'] ?? '' ) === 'oauth' ? 'OAuth app' : 'Bearer token' );
      $entry['a'][ $client ] = ( $entry['a'][ $client ] ?? 0 ) + 1;
      $built[ $day ] = $entry;
    }
    // A day the live counter already saw keeps its own changes, which also know the arguments.
    $usage = get_option( self::OPTION, [] );
    $usage = is_array( $usage ) ? $usage : [];
    foreach ( $built as $day => $entry ) {
      if ( isset( $usage[ $day ] ) ) {
        if ( $entry['c'] <= $usage[ $day ]['c'] ) {
          continue;
        }
        $entry['w'] = max( $entry['w'], (int) $usage[ $day ]['w'] );
      }
      $usage[ $day ] = $entry;
    }
    ksort( $usage );
    update_option( self::OPTION, $usage, false );
  }

  public function record( $event ) {
    $tool = is_array( $event ) ? (string) ( $event['tool'] ?? '' ) : '';
    if ( $tool === '' || $tool === 'mcp_ping' ) {
      return;
    }
    $usage = get_option( self::OPTION, [] );
    if ( !is_array( $usage ) ) {
      $usage = [];
    }
    $day = gmdate( 'Y-m-d' );
    $entry = $usage[ $day ] ?? [ 'c' => 0, 'e' => 0, 'w' => 0, 't' => [], 'a' => [] ];
    $status = $event['status'] ?? '';
    // 'writes' comes from labs/mcp.php; events from older code only carry the access level.
    $writes = isset( $event['writes'] ) ? (bool) $event['writes']
      : ( !empty( $event['access_level'] ) && $event['access_level'] !== 'read' );
    $entry['c']++;
    if ( $status !== 'success' ) {
      $entry['e']++;
    }
    elseif ( $writes ) {
      $entry['w']++;
    }
    $entry['t'][ $tool ] = ( $entry['t'][ $tool ] ?? 0 ) + 1;
    $client = self::client_of( $event );
    $entry['a'][ $client ] = ( $entry['a'][ $client ] ?? 0 ) + 1;
    $usage[ $day ] = $entry;

    $cutoff = gmdate( 'Y-m-d', time() - self::KEEP_DAYS * DAY_IN_SECONDS );
    foreach ( array_keys( $usage ) as $key ) {
      if ( $key < $cutoff ) {
        unset( $usage[ $key ] );
      }
    }
    update_option( self::OPTION, $usage, false );

    if ( $status === 'success' && $writes ) {
      $this->remember_change( $tool, $client, is_array( $event['args'] ?? null ) ? $event['args'] : [] );
    }
  }

  // OAuth apps name themselves. A token call has no name, but developer tools say who they are
  // in their user agent: "Claude Code (token)" tells more than a key. The tab reads the suffix.
  private static function client_of( array $event ): string {
    if ( !empty( $event['client_name'] ) ) {
      return (string) $event['client_name'];
    }
    if ( ( $event['auth_method'] ?? '' ) === 'oauth' ) {
      return 'OAuth app';
    }
    $agent = (string) ( $_SERVER['HTTP_USER_AGENT'] ?? '' );
    $known = [ '/^claude-code/i' => 'Claude Code', '/codex/i' => 'Codex', '/cursor/i' => 'Cursor', '/gemini/i' => 'Gemini CLI' ];
    foreach ( $known as $pattern => $name ) {
      if ( preg_match( $pattern, $agent ) ) {
        return $name . ' (token)';
      }
    }
    return 'Bearer token';
  }

  // The last changes an assistant made, so the MCP tab can say what happened and link to it.
  // Only the tool, who, when and which post: never the content or the arguments.
  private function remember_change( string $tool, string $client, array $args ) {
    $id = 0;
    foreach ( [ 'ID', 'id', 'post_id', 'postId', 'attachment_id', 'comment_id' ] as $key ) {
      if ( !empty( $args[ $key ] ) && is_numeric( $args[ $key ] ) ) {
        $id = (int) $args[ $key ];
        break;
      }
    }
    $isComment = isset( $args['comment_id'] ) || strpos( $tool, 'comment' ) !== false;
    // A comment points to the post it belongs to, so the tab can say "Commented on <post>".
    if ( $isComment ) {
      $id = !empty( $args['post_id'] ) && is_numeric( $args['post_id'] ) ? (int) $args['post_id'] : 0;
      if ( !$id && !empty( $args['comment_id'] ) && ( $comment = get_comment( (int) $args['comment_id'] ) ) ) {
        $id = (int) $comment->comment_post_ID;
      }
    }
    $title = '';
    if ( $id && get_post( $id ) ) {
      $title = wp_strip_all_tags( get_the_title( $id ) );
    }
    // A new post, term or file has no ID in its arguments yet: its name tells which one it was.
    if ( !$title && !$isComment ) {
      $title = (string) ( $args['post_title'] ?? $args['title'] ?? $args['name'] ?? '' );
      if ( $title === '' && !empty( $args['url'] ) && is_string( $args['url'] ) ) {
        $title = rawurldecode( wp_basename( (string) wp_parse_url( $args['url'], PHP_URL_PATH ) ) );
      }
      $title = wp_strip_all_tags( $title );
    }
    $title = html_entity_decode( $title, ENT_QUOTES, 'UTF-8' );
    $removed = !empty( $args['remove'] ) || ( isset( $args['terms'] ) && $args['terms'] === [] && isset( $args['append'] ) && !$args['append'] );
    $recent = get_option( self::RECENT_OPTION, [] );
    $recent = is_array( $recent ) ? $recent : [];
    // An assistant often edits the same post several times in a row: one row, with a count.
    $last = $recent[0] ?? null;
    if ( $last && self::same_change( $last, $tool, $client, $id, $title ) && !empty( $last['removed'] ) === $removed && time() - (int) $last['time'] < 15 * MINUTE_IN_SECONDS ) {
      $recent[0]['time'] = time();
      $recent[0]['count'] = (int) ( $last['count'] ?? 1 ) + 1;
      update_option( self::RECENT_OPTION, $recent, false );
      return;
    }
    array_unshift( $recent, [
      'time' => time(),
      'tool' => $tool,
      'client' => $client,
      'id' => $id,
      'title' => mb_substr( $title, 0, 120 ),
      'taxonomy' => isset( $args['taxonomy'] ) ? sanitize_key( (string) $args['taxonomy'] ) : '',
      // Taking terms off (or clearing them) must not read as "Tagged".
      'removed' => $removed,
    ] );
    update_option( self::RECENT_OPTION, array_slice( $recent, 0, self::RECENT_MAX ), false );
  }

  // WordPress's own before/after view, for edits that touch the content. Only when a revision
  // was saved at that moment: a fields-only change makes none, and an older one would mislead.
  // 'restore' opens the revision from BEFORE the change, where WordPress offers "Restore This
  // Revision" (restoring the newest one would change nothing: it is the AI's edit itself).
  // Nothing is offered once the post was edited again afterwards.
  private static function revision_links( WP_Post $post, string $tool, int $time ): array {
    $none = [ 'diff' => null, 'restore' => null ];
    if ( !preg_match( '/^(wp_update_post|wp_alter_post|wp_write_blocks|wc_update_product|wc_alter_product)$/', $tool ) ) {
      return $none;
    }
    if ( !post_type_supports( $post->post_type, 'revisions' ) ) {
      return $none;
    }
    $revisions = array_values( array_filter( wp_get_post_revisions( $post->ID, [ 'numberposts' => 5 ] ),
      function ( $revision ) { return !wp_is_post_autosave( $revision ); } ) );
    $latest = $revisions[0] ?? null;
    if ( !$latest || abs( strtotime( $latest->post_date_gmt . ' UTC' ) - $time ) > 5 * MINUTE_IN_SECONDS ) {
      return $none;
    }
    $before = $revisions[1] ?? null;
    return [
      'diff' => admin_url( 'revision.php?revision=' . $latest->ID ),
      'restore' => $before && current_user_can( 'edit_post', $post->ID ) ? admin_url( 'revision.php?revision=' . $before->ID ) : null,
    ];
  }

  private static function same_change( array $row, string $tool, string $client, int $id, string $title ): bool {
    return ( $row['tool'] ?? '' ) === $tool && ( $row['client'] ?? '' ) === $client
      && (int) ( $row['id'] ?? 0 ) === $id && ( $row['title'] ?? '' ) === $title;
  }

  public static function recent(): array {
    $recent = get_option( self::RECENT_OPTION, [] );
    $out = [];
    foreach ( is_array( $recent ) ? $recent : [] as $item ) {
      $id = (int) ( $item['id'] ?? 0 );
      $post = $id ? get_post( $id ) : null;
      $links = $post ? self::revision_links( $post, (string) ( $item['tool'] ?? '' ), (int) ( $item['time'] ?? 0 ) ) : [ 'diff' => null, 'restore' => null ];
      $row = [
        'time' => (int) ( $item['time'] ?? 0 ),
        'tool' => (string) ( $item['tool'] ?? '' ),
        'client' => (string) ( $item['client'] ?? '' ),
        // Older rows were stored texturized ("l&#8217;envers").
        'title' => html_entity_decode( (string) ( $item['title'] ?? '' ), ENT_QUOTES, 'UTF-8' ),
        'count' => max( 1, (int) ( $item['count'] ?? 1 ) ),
        'taxonomy' => (string) ( $item['taxonomy'] ?? '' ),
        'removed' => !empty( $item['removed'] ),
        'editUrl' => $post ? get_edit_post_link( $id, 'raw' ) : null,
        'diffUrl' => $links['diff'],
        'restoreUrl' => $links['restore'],
        'thumb' => $post ? ( get_the_post_thumbnail_url( $id, 'thumbnail' ) ?: ( $post->post_type === 'attachment' && wp_attachment_is_image( $id ) ? wp_get_attachment_image_url( $id, 'thumbnail' ) : null ) ) : null,
      ];
      // Rows from before the merge above: fold consecutive repeats here too.
      $prev = count( $out ) - 1;
      if ( $prev >= 0 && $out[ $prev ]['tool'] === $row['tool'] && $out[ $prev ]['client'] === $row['client']
        && $out[ $prev ]['title'] === $row['title'] && $out[ $prev ]['editUrl'] === $row['editUrl'] && $out[ $prev ]['removed'] === $row['removed']
        && $out[ $prev ]['time'] - $row['time'] < 15 * MINUTE_IN_SECONDS ) {
        $out[ $prev ]['count'] += $row['count'];
        continue;
      }
      $out[] = $row;
    }
    return $out;
  }

  public static function summary( int $days = 7 ): array {
    $days = max( 1, min( 30, $days ) );
    self::maybe_backfill();
    $usage = get_option( self::OPTION, [] );
    $usage = is_array( $usage ) ? $usage : [];
    $perDay = [];
    $totals = [ 'calls' => 0, 'errors' => 0, 'changes' => 0 ];
    $tools = [];
    $assistants = [];
    for ( $i = $days - 1; $i >= 0; $i-- ) {
      $date = gmdate( 'Y-m-d', time() - $i * DAY_IN_SECONDS );
      $entry = $usage[ $date ] ?? null;
      $perDay[] = [ 'date' => $date, 'calls' => (int) ( $entry['c'] ?? 0 ) ];
      if ( !$entry ) {
        continue;
      }
      $totals['calls'] += (int) $entry['c'];
      $totals['errors'] += (int) $entry['e'];
      $totals['changes'] += (int) $entry['w'];
      foreach ( (array) ( $entry['t'] ?? [] ) as $name => $count ) {
        $tools[ $name ] = ( $tools[ $name ] ?? 0 ) + (int) $count;
      }
      foreach ( (array) ( $entry['a'] ?? [] ) as $name => $count ) {
        $assistants[ $name ] = ( $assistants[ $name ] ?? 0 ) + (int) $count;
      }
    }
    arsort( $tools );
    arsort( $assistants );
    $top = [];
    foreach ( array_slice( $tools, 0, 5, true ) as $name => $count ) {
      $top[] = [ 'tool' => $name, 'calls' => $count ];
    }
    $byAssistant = [];
    foreach ( $assistants as $name => $count ) {
      $byAssistant[] = [ 'name' => $name, 'calls' => $count ];
    }
    // The first day ever counted, so the tab can say a quiet chart is new, not empty.
    $since = $usage ? min( array_keys( $usage ) ) : null;
    return array_merge( $totals, [
      'days' => $days,
      'since' => $since,
      'assistants' => $byAssistant,
      'perDay' => $perDay,
      'topTools' => $top,
    ] );
  }
}
