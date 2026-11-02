<?php

// Tools to finish and verify work: see what a page really shows (wp_get_rendered), check the
// site's health (wp_get_diagnostics, wp_site_maintenance), and go back to an earlier version of a
// post, whoever made the change (wp_get_revisions, wp_restore_revision). Part of the core set.
class Meow_MWAI_Labs_MCP_Ops {
  private const LOG_LINES = 40;

  public function __construct() {
    add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
  }

  public function rest_api_init() {
    add_filter( 'mwai_mcp_tools', [ $this, 'register_tools' ] );
    add_filter( 'mwai_mcp_callback', [ $this, 'handle_call' ], 10, 4 );
    add_filter( 'mwai_mcp_undo_targets', [ $this, 'undo_targets' ], 10, 3 );
  }

  private function tools(): array {
    return [
      'wp_get_rendered' => [
        'name' => 'wp_get_rendered',
        'description' => 'See what a page really shows, to check your work: for a published post or any URL of this site, the HTTP status, <title>, meta description, robots, canonical, social tags, headings, links, images missing alt text, and the start of the visible text, as the theme and plugins render them. A draft is rendered without the theme (its content only).',
        'inputSchema' => [ 'type' => 'object', 'properties' => [
          'ID' => [ 'type' => 'integer', 'description' => 'A post or page ID.' ],
          'url' => [ 'type' => 'string', 'description' => 'Or a URL on this site (the home page, an archive...).' ],
        ] ],
        'accessLevel' => 'read',
      ],
      'wp_get_diagnostics' => [
        'name' => 'wp_get_diagnostics',
        'description' => 'Check the site\'s health when something looks broken or slow: versions and limits (PHP, WordPress, memory, debug settings), the latest PHP errors from the debug log, scheduled tasks (cron) and the overdue ones, and the Site Health issues WordPress found. Pass only to get one section: environment, errors, cron or health.',
        'inputSchema' => [ 'type' => 'object', 'properties' => [
          'only' => [ 'type' => 'string', 'enum' => [ 'environment', 'errors', 'cron', 'health' ] ],
        ] ],
        'accessLevel' => 'admin',
      ],
      'wp_site_maintenance' => [
        'name' => 'wp_site_maintenance',
        'description' => 'Common fixes, one "task" at a time: "flush_cache" (the object cache, and the page cache of LiteSpeed, WP Rocket, W3 Total Cache, WP Super Cache, WP Fastest Cache or SiteGround when present), "flush_permalinks" (fixes 404s after a slug or structure change), "run_cron" (runs the scheduled tasks that are due), "delete_expired_transients".',
        'inputSchema' => [ 'type' => 'object', 'properties' => [
          'task' => [ 'type' => 'string', 'enum' => [ 'flush_cache', 'flush_permalinks', 'run_cron', 'delete_expired_transients' ] ],
        ], 'required' => [ 'task' ] ],
        // 'write', not 'admin': a change has a write level or a write verb in its name (labs/mcp.php
        // is_write_call()), and "maintenance" has none, so Drafts Only and History would miss it.
        // The handler still requires manage_options. Its argument is "task", not "action": an
        // "action" argument makes is_write_call() look for a verb in its value instead.
        'accessLevel' => 'write',
      ],
      'wp_get_revisions' => [
        'name' => 'wp_get_revisions',
        'description' => 'List the saved versions (revisions) of a post or page: who, when, and how big the change was. Pass revision_id to see exactly what changed in that version (a line diff of title, content and excerpt against the one before it, or against the current post with compare_to_current). Covers every edit, made by a person or an assistant.',
        'inputSchema' => [ 'type' => 'object', 'properties' => [
          'ID' => [ 'type' => 'integer', 'description' => 'The post or page ID.' ],
          'revision_id' => [ 'type' => 'integer', 'description' => 'Optional: one revision, to see its changes.' ],
          'compare_to_current' => [ 'type' => 'boolean', 'description' => 'With revision_id: compare it to the current post instead.' ],
        ], 'required' => [ 'ID' ] ],
        'accessLevel' => 'read',
      ],
      'wp_restore_revision' => [
        'name' => 'wp_restore_revision',
        'description' => 'Bring a post back to an earlier revision (title, content and excerpt), as the Restore button of WordPress does. The current version stays in the revisions, and this can be undone with mcp_undo_change.',
        'inputSchema' => [ 'type' => 'object', 'properties' => [
          'ID' => [ 'type' => 'integer', 'description' => 'The post or page ID.' ],
          'revision_id' => [ 'type' => 'integer', 'description' => 'The revision to restore, from wp_get_revisions.' ],
        ], 'required' => [ 'ID', 'revision_id' ] ],
        'accessLevel' => 'write',
      ],
    ];
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
      case 'wp_get_rendered':
        return $this->rendered( $args );
      case 'wp_get_diagnostics':
        self::require_cap( 'manage_options' );
        return $this->diagnostics( (string) ( $args['only'] ?? '' ) );
      case 'wp_site_maintenance':
        self::require_cap( 'manage_options' );
        return $this->maintenance( (string) ( $args['task'] ?? '' ) );
      case 'wp_get_revisions':
        return $this->revisions( $args );
      case 'wp_restore_revision':
        return $this->restore( $args );
    }
    return $prev;
  }

  private static function require_cap( string $cap, $object_id = null ) {
    if ( $object_id ? !current_user_can( $cap, $object_id ) : !current_user_can( $cap ) ) {
      throw new Exception( 'You are not allowed to do this.', Meow_MWAI_Labs_MCP::DENIED_CODE );
    }
  }

  private static function post( array $a ): WP_Post {
    $post = get_post( (int) ( $a['ID'] ?? $a['post_id'] ?? $a['id'] ?? 0 ) );
    if ( !$post || $post->post_type === 'revision' ) {
      throw new Exception( 'Pass the ID of a post or page.' );
    }
    return $post;
  }

  #region Rendered
  private function rendered( array $a ): array {
    $url = trim( (string) ( $a['url'] ?? '' ) );
    $post = null;
    if ( $url === '' ) {
      $post = self::post( $a );
      self::require_cap( 'edit_post', $post->ID );
      // Not public yet: no theme to fetch, so the content alone, rendered as WordPress would.
      if ( !in_array( $post->post_status, [ 'publish' ], true ) || post_password_required( $post ) ) {
        setup_postdata( $post );
        $html = apply_filters( 'the_content', $post->post_content );
        wp_reset_postdata();
        return [ 'ID' => $post->ID, 'status' => $post->post_status, 'note' => 'Not public, so this is the content only, without the theme.' ] + self::summarize( $html, false );
      }
      $url = get_permalink( $post );
    }
    // Only this site: an assistant must not make the server fetch other hosts.
    if ( wp_parse_url( $url, PHP_URL_HOST ) !== wp_parse_url( home_url(), PHP_URL_HOST ) ) {
      throw new Exception( 'Only URLs of this site can be checked.' );
    }
    $response = wp_remote_get( add_query_arg( 'mwai_nocache', wp_rand(), $url ), [
      'timeout' => 20, 'redirection' => 3,
      'sslverify' => apply_filters( 'https_local_ssl_verify', false ),
      'headers' => [ 'Cache-Control' => 'no-cache' ],
    ] );
    if ( is_wp_error( $response ) ) {
      throw new Exception( 'The page could not be loaded: ' . $response->get_error_message() );
    }
    $out = [ 'url' => $url, 'http_status' => wp_remote_retrieve_response_code( $response ) ];
    if ( $post ) {
      $out = [ 'ID' => $post->ID ] + $out;
    }
    return $out + self::summarize( wp_remote_retrieve_body( $response ), true );
  }

  private static function summarize( string $html, bool $page ): array {
    $out = [];
    $text = function ( $s ) { return trim( html_entity_decode( wp_strip_all_tags( (string) $s ), ENT_QUOTES, 'UTF-8' ) ); };
    if ( $page ) {
      if ( preg_match( '/<title[^>]*>(.*?)<\/title>/is', $html, $m ) ) {
        $out['title'] = $text( $m[1] );
      }
      $metas = [];
      if ( preg_match_all( '/<meta\s[^>]*>/i', $html, $tags ) ) {
        foreach ( $tags[0] as $tag ) {
          if ( preg_match( '/(?:name|property)=["\']([^"\']+)["\']/i', $tag, $n ) && preg_match( '/content=["\']([^"\']*)["\']/i', $tag, $c ) ) {
            $key = strtolower( $n[1] );
            if ( in_array( $key, [ 'description', 'robots', 'og:title', 'og:description', 'og:image', 'twitter:card' ], true ) ) {
              $metas[ $key ] = $text( $c[1] );
            }
          }
        }
      }
      $out['meta'] = (object) $metas;
      if ( preg_match( '/<link[^>]+rel=["\']canonical["\'][^>]*href=["\']([^"\']+)["\']/i', $html, $m ) ) {
        $out['canonical'] = $m[1];
      }
      // Header and footer apart, so a change there can be checked too.
      $strip = function ( $part ) use ( $text ) {
        $part = preg_replace( '/\s+/u', ' ', $text( preg_replace( '/<(script|style)\b.*?<\/\1>/is', '', $part ) ) );
        return mb_strlen( $part ) > 300 ? mb_substr( $part, 0, 300 ) . '...' : $part;
      };
      if ( preg_match( '/<header\b.*?<\/header>/is', $html, $m ) ) {
        $out['header_text'] = $strip( $m[0] );
      }
      if ( preg_match_all( '/<footer\b.*?<\/footer>/is', $html, $m ) ) {
        $out['footer_text'] = $strip( end( $m[0] ) );
      }
      // The visible part: the main content when the theme marks it, else the body.
      if ( preg_match( '/<main\b.*?<\/main>/is', $html, $m ) || preg_match( '/<body\b.*?<\/body>/is', $html, $m ) ) {
        $html = $m[0];
      }
    }
    $html = preg_replace( '/<(script|style|noscript)\b.*?<\/\1>/is', '', $html );
    $headings = [];
    if ( preg_match_all( '/<h([1-3])\b[^>]*>(.*?)<\/h\1>/is', $html, $hs, PREG_SET_ORDER ) ) {
      foreach ( array_slice( $hs, 0, 30 ) as $h ) {
        $headings[] = 'h' . $h[1] . ': ' . $text( $h[2] );
      }
    }
    $out['headings'] = $headings;
    preg_match_all( '/<img\b[^>]*>/i', $html, $imgs );
    $out['images'] = count( $imgs[0] );
    $out['images_without_alt'] = count( array_filter( $imgs[0], function ( $img ) {
      return !preg_match( '/\salt=["\'][^"\']+["\']/i', $img );
    } ) );
    $out['links'] = preg_match_all( '/<a\s[^>]*href=/i', $html );
    $visible = preg_replace( '/\s+/u', ' ', $text( $html ) );
    $out['words'] = str_word_count( $visible );
    $out['text_start'] = mb_strlen( $visible ) > 600 ? mb_substr( $visible, 0, 600 ) . '...' : $visible;
    return $out;
  }
  #endregion

  #region Diagnostics
  private function diagnostics( string $only ): array {
    $out = [];
    if ( !$only || $only === 'environment' ) {
      global $wp_version, $wpdb;
      $out['environment'] = [
        'wordpress' => $wp_version, 'php' => PHP_VERSION, 'database' => $wpdb->db_server_info(),
        'memory_limit' => WP_MEMORY_LIMIT, 'php_memory_limit' => ini_get( 'memory_limit' ), 'max_execution_time' => (int) ini_get( 'max_execution_time' ),
        'debug' => WP_DEBUG, 'debug_log' => (bool) WP_DEBUG_LOG, 'cron_disabled' => defined( 'DISABLE_WP_CRON' ) && DISABLE_WP_CRON,
        'object_cache' => wp_using_ext_object_cache(), 'theme' => get_stylesheet(), 'active_plugins' => count( (array) get_option( 'active_plugins', [] ) ),
        'https' => wp_is_using_https(), 'search_engines' => (bool) get_option( 'blog_public' ) ? 'allowed' : 'discouraged',
      ];
    }
    if ( !$only || $only === 'errors' ) {
      $out['errors'] = self::log_tail();
    }
    if ( !$only || $only === 'cron' ) {
      $events = [];
      $overdue = 0;
      foreach ( (array) _get_cron_array() as $time => $hooks ) {
        foreach ( (array) $hooks as $hook => $runs ) {
          foreach ( (array) $runs as $run ) {
            if ( $time < time() - 10 * MINUTE_IN_SECONDS ) {
              $overdue++;
            }
            if ( count( $events ) < 25 ) {
              $events[] = [ 'hook' => $hook, 'next' => gmdate( 'Y-m-d H:i', $time ) . ' UTC', 'every' => $run['schedule'] ?: 'once' ];
            }
          }
        }
      }
      $out['cron'] = [ 'overdue' => $overdue, 'next_events' => $events ];
      if ( $overdue ) {
        $out['cron']['note'] = 'Overdue tasks usually mean the site gets few visits or WP-Cron is blocked; wp_site_maintenance run_cron runs them now.';
      }
    }
    if ( !$only || $only === 'health' ) {
      $health = get_transient( 'health-check-site-status-result' );
      $out['health'] = [ 'summary' => $health ? json_decode( $health, true ) : null, 'issues' => self::health_issues() ];
    }
    return $out;
  }

  // The last lines of the PHP error log, when WordPress writes one and it can be read.
  private static function log_tail(): array {
    $file = is_string( WP_DEBUG_LOG ) ? WP_DEBUG_LOG : ( WP_DEBUG_LOG ? WP_CONTENT_DIR . '/debug.log' : (string) ini_get( 'error_log' ) );
    if ( !$file || !@is_readable( $file ) ) {
      return [ 'note' => 'No readable PHP error log. Turn on WP_DEBUG_LOG in wp-config.php to collect errors.' ];
    }
    $size = filesize( $file );
    $handle = fopen( $file, 'r' );
    fseek( $handle, max( 0, $size - 64 * KB_IN_BYTES ) );
    $chunk = (string) fread( $handle, 64 * KB_IN_BYTES );
    fclose( $handle );
    $lines = array_values( array_filter( explode( "\n", $chunk ), 'strlen' ) );
    $lines = array_slice( $lines, -self::LOG_LINES );
    // Paths say which plugin fails; the server's own path before wp-content says nothing.
    $lines = array_map( function ( $line ) {
      return str_replace( untrailingslashit( ABSPATH ), '', mb_substr( $line, 0, 400 ) );
    }, $lines );
    return [ 'file_size_kb' => (int) round( $size / KB_IN_BYTES ), 'last_lines' => $lines ];
  }

  // Site Health's quick (direct) tests: the ones it shows as critical or recommended.
  private static function health_issues(): array {
    // Some direct tests call admin functions (updates, plugins, files) that the REST API never loads.
    foreach ( [ 'class-wp-site-health.php', 'update.php', 'plugin.php', 'misc.php', 'file.php', 'theme.php' ] as $file ) {
      require_once ABSPATH . 'wp-admin/includes/' . $file;
    }
    $health = WP_Site_Health::get_instance();
    $issues = [];
    foreach ( WP_Site_Health::get_tests()['direct'] as $test ) {
      $callback = is_string( $test['test'] ) ? [ $health, 'get_test_' . $test['test'] ] : $test['test'];
      if ( !is_callable( $callback ) ) {
        continue;
      }
      try {
        $result = call_user_func( $callback );
      }
      catch ( Throwable $e ) {
        continue;
      }
      if ( is_array( $result ) && in_array( $result['status'] ?? '', [ 'critical', 'recommended' ], true ) ) {
        $issues[] = [ 'status' => $result['status'], 'label' => wp_strip_all_tags( $result['label'] ?? '' ) ];
      }
    }
    return $issues;
  }

  private function maintenance( string $action ): string {
    switch ( $action ) {
      case 'flush_cache':
        wp_cache_flush();
        $done = [ 'object cache' ];
        $purges = [
          'LiteSpeed' => function () {
            do_action( 'litespeed_purge_all' );
            return defined( 'LSCWP_V' );
          },
          'WP Rocket' => function () { return function_exists( 'rocket_clean_domain' ) && ( rocket_clean_domain() || true ); },
          'W3 Total Cache' => function () { return function_exists( 'w3tc_flush_all' ) && ( w3tc_flush_all() || true ); },
          'WP Super Cache' => function () { return function_exists( 'wp_cache_clear_cache' ) && ( wp_cache_clear_cache() || true ); },
          'WP Fastest Cache' => function () {
            do_action( 'wpfc_clear_all_cache' );
            return class_exists( 'WpFastestCache' );
          },
          'SiteGround' => function () { return function_exists( 'sg_cachepress_purge_cache' ) && ( sg_cachepress_purge_cache() || true ); },
        ];
        foreach ( $purges as $name => $purge ) {
          if ( $purge() ) {
            $done[] = $name;
          }
        }
        return 'Flushed: ' . implode( ', ', $done ) . '.';
      case 'flush_permalinks':
        flush_rewrite_rules( false );
        return 'Permalinks flushed.';
      case 'run_cron':
        $ran = [];
        foreach ( (array) _get_cron_array() as $time => $hooks ) {
          if ( $time > time() ) {
            break;
          }
          foreach ( (array) $hooks as $hook => $runs ) {
            foreach ( (array) $runs as $run ) {
              // As wp-cron.php does: reschedule a recurring task, unschedule, then run it.
              if ( $run['schedule'] ) {
                wp_reschedule_event( $time, $run['schedule'], $hook, $run['args'] );
              }
              wp_unschedule_event( $time, $hook, $run['args'] );
              do_action_ref_array( $hook, $run['args'] );
              $ran[] = $hook;
              if ( count( $ran ) >= 20 ) {
                break 3;
              }
            }
          }
        }
        return $ran ? 'Ran ' . count( $ran ) . ' due task(s): ' . implode( ', ', array_unique( $ran ) ) . '.' : 'No scheduled task was due.';
      case 'delete_expired_transients':
        delete_expired_transients( true );
        return 'Expired transients deleted.';
    }
    throw new Exception( 'Unknown task. Use flush_cache, flush_permalinks, run_cron or delete_expired_transients.' );
  }
  #endregion

  #region Revisions
  private function revisions( array $a ): array {
    $post = self::post( $a );
    self::require_cap( 'edit_post', $post->ID );
    $revisions = array_values( wp_get_post_revisions( $post->ID, [ 'order' => 'DESC' ] ) );
    if ( empty( $a['revision_id'] ) ) {
      $list = [];
      foreach ( array_slice( $revisions, 0, 30 ) as $i => $revision ) {
        $author = get_userdata( (int) $revision->post_author );
        $older = $revisions[ $i + 1 ] ?? null;
        $list[] = [ 'revision_id' => $revision->ID, 'date' => $revision->post_date, 'author' => $author ? $author->display_name : '',
          'autosave' => wp_is_post_autosave( $revision ) !== false, 'title' => $revision->post_title,
          'size_change' => strlen( $revision->post_content ) - ( $older ? strlen( $older->post_content ) : 0 ) ];
      }
      return [ 'ID' => $post->ID, 'count' => count( $revisions ), 'revisions' => $list,
        'note' => $list ? 'The newest revision matches the current post. Pass revision_id to see a change.' : 'No revisions: this post type does not keep them, or it was never edited.' ];
    }
    // wp_get_post_revision() takes its argument by reference: it must be a variable.
    $revision_id = (int) $a['revision_id'];
    $revision = wp_get_post_revision( $revision_id );
    if ( !$revision || (int) $revision->post_parent !== $post->ID ) {
      throw new Exception( 'This revision does not belong to this post.' );
    }
    if ( !empty( $a['compare_to_current'] ) ) {
      $from = $revision;
      $to = $post;
    }
    else {
      $index = array_search( $revision->ID, wp_list_pluck( $revisions, 'ID' ), true );
      $from = $revisions[ $index + 1 ] ?? null;
      $to = $revision;
    }
    $changes = [];
    foreach ( [ 'post_title', 'post_content', 'post_excerpt' ] as $field ) {
      $diff = self::diff( $from ? (string) $from->$field : '', (string) $to->$field );
      if ( $diff !== '' ) {
        $changes[ $field ] = $diff;
      }
    }
    return [ 'ID' => $post->ID, 'revision_id' => $revision->ID, 'compared' => !empty( $a['compare_to_current'] ) ? 'this revision → the current post' : 'the previous revision → this one',
      'changes' => $changes ?: 'No difference in title, content or excerpt.' ];
  }

  // A compact line diff: "-" removed, "+" added, unchanged lines skipped.
  private static function diff( string $from, string $to ): string {
    if ( $from === $to ) {
      return '';
    }
    if ( !class_exists( 'Text_Diff', false ) ) {
      require_once ABSPATH . WPINC . '/Text/Diff.php';
    }
    $split = function ( $s ) { return explode( "\n", str_replace( "\r\n", "\n", $s ) ); };
    $diff = new Text_Diff( 'auto', [ $split( $from ), $split( $to ) ] );
    $out = [];
    foreach ( $diff->getDiff() as $op ) {
      if ( $op instanceof Text_Diff_Op_copy ) {
        continue;
      }
      foreach ( (array) $op->orig as $line ) {
        $out[] = '- ' . $line;
      }
      foreach ( (array) $op->final as $line ) {
        $out[] = '+ ' . $line;
      }
    }
    $text = implode( "\n", $out );
    return mb_strlen( $text ) > 6000 ? mb_substr( $text, 0, 6000 ) . "\n[...]" : $text;
  }

  private function restore( array $a ): array {
    $post = self::post( $a );
    self::require_cap( 'edit_post', $post->ID );
    $revision_id = (int) ( $a['revision_id'] ?? 0 );
    $revision = wp_get_post_revision( $revision_id );
    if ( !$revision || (int) $revision->post_parent !== $post->ID ) {
      throw new Exception( 'This revision does not belong to this post. See wp_get_revisions.' );
    }
    if ( !wp_restore_post_revision( $revision->ID ) ) {
      throw new Exception( 'WordPress could not restore this revision.' );
    }
    return [ 'ID' => $post->ID, 'restored' => $revision->ID, 'title' => get_post( $post->ID )->post_title,
      'note' => 'Restored. The version you replaced stays in the revisions.' ];
  }

  public function undo_targets( $targets, string $tool, array $a ) {
    if ( $tool !== 'wp_restore_revision' ) {
      return $targets;
    }
    $id = (int) ( $a['ID'] ?? $a['post_id'] ?? 0 );
    return $id ? [ [ 'kind' => 'post', 'id' => $id, 'fields' => [ 'post_title', 'post_content', 'post_excerpt' ] ] ] : null;
  }
  #endregion
}
