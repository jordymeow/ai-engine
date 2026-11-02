<?php

// SEO fields for MCP, through whichever SEO plugin the site runs: Yoast SEO, Rank Math, All in
// One SEO, SEOPress, The SEO Framework, Slim SEO or SEO Engine. Two tools with the same fields
// everywhere (title, description, focus keyword, canonical, noindex, nofollow, social title,
// description and image), instead of a set of tools per plugin.
//
// Each plugin is an adapter: get( object, id, taxonomy ) returns the fields it supports, set()
// writes changes (null clears a field). Undo uses them too (the "seo" kind), so every plugin can
// be undone the same way.
class Meow_MWAI_Labs_MCP_Seo {
  public const FIELDS = [ 'title', 'description', 'focus_keyword', 'canonical', 'noindex', 'nofollow', 'og_title', 'og_description', 'og_image' ];
  private const URL_FIELDS = [ 'canonical', 'og_image' ];
  private const FLAG_FIELDS = [ 'noindex', 'nofollow' ];

  public function __construct() {
    add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
  }

  public function rest_api_init() {
    add_filter( 'mwai_mcp_tools', [ $this, 'register_tools' ] );
    add_filter( 'mwai_mcp_callback', [ $this, 'handle_call' ], 10, 4 );
    add_filter( 'mwai_mcp_undo_targets', [ $this, 'undo_targets' ], 10, 3 );
    add_filter( 'mwai_mcp_undo_kinds', [ $this, 'undo_kinds' ] );
  }

  #region Adapters
  // Flat meta: field => [ meta key, how it is stored ]. "text", "flag:<stored value>" (present
  // means on), "token:<word>" (a word in an array) or "csv:<word>" (a word in a comma string).
  private static function flat( array $map ): array {
    return [
      'get' => function ( string $type, int $id ) use ( $map ) {
        $out = [];
        foreach ( $map as $field => [ $key, $kind ] ) {
          $value = get_metadata( $type, $id, $key, true );
          $out[ $field ] = self::decode( $kind, $value );
        }
        return $out;
      },
      'set' => function ( string $type, int $id, array $changes ) use ( $map ) {
        foreach ( $changes as $field => $value ) {
          [ $key, $kind ] = $map[ $field ];
          $stored = self::encode( $kind, $value, get_metadata( $type, $id, $key, true ) );
          if ( $stored === null ) {
            delete_metadata( $type, $id, $key );
          }
          else {
            update_metadata( $type, $id, $key, wp_slash( $stored ) );
          }
        }
      },
      'fields' => array_keys( $map ),
    ];
  }

  // One meta holding an array: field => [ array key, how it is stored ].
  private static function packed( string $meta_key, array $map ): array {
    return [
      'get' => function ( string $type, int $id ) use ( $meta_key, $map ) {
        $data = (array) get_metadata( $type, $id, $meta_key, true );
        $out = [];
        foreach ( $map as $field => [ $key, $kind ] ) {
          $out[ $field ] = self::decode( $kind, $data[ $key ] ?? null );
        }
        return $out;
      },
      'set' => function ( string $type, int $id, array $changes ) use ( $meta_key, $map ) {
        $data = (array) get_metadata( $type, $id, $meta_key, true );
        foreach ( $changes as $field => $value ) {
          [ $key, $kind ] = $map[ $field ];
          $stored = self::encode( $kind, $value, $data[ $key ] ?? null );
          if ( $stored === null ) {
            unset( $data[ $key ] );
          }
          else {
            $data[ $key ] = $stored;
          }
        }
        $data = array_filter( $data, function ( $v ) { return $v !== '' && $v !== null; } );
        $data ? update_metadata( $type, $id, $meta_key, wp_slash( $data ) ) : delete_metadata( $type, $id, $meta_key );
      },
      'fields' => array_keys( $map ),
    ];
  }

  private static function decode( string $kind, $value ) {
    if ( strpos( $kind, 'flag:' ) === 0 ) {
      return $value !== null && $value !== '' && (string) $value === substr( $kind, 5 );
    }
    if ( strpos( $kind, 'token:' ) === 0 || strpos( $kind, 'csv:' ) === 0 ) {
      $list = is_array( $value ) ? $value : array_map( 'trim', explode( ',', (string) $value ) );
      return in_array( substr( $kind, strpos( $kind, ':' ) + 1 ), $list, true );
    }
    return is_scalar( $value ) && (string) $value !== '' ? (string) $value : null;
  }

  // The value to store, or null to remove it. $current is what is stored now (for token lists).
  private static function encode( string $kind, $value, $current ) {
    if ( strpos( $kind, 'flag:' ) === 0 ) {
      return $value ? substr( $kind, 5 ) : null;
    }
    if ( strpos( $kind, 'token:' ) === 0 || strpos( $kind, 'csv:' ) === 0 ) {
      $token = substr( $kind, strpos( $kind, ':' ) + 1 );
      $opposite = [ 'noindex' => 'index', 'nofollow' => 'follow' ][ $token ] ?? '';
      // The format is the plugin's, never guessed from what is stored: SEO Engine reads a comma
      // string, and an array saved there read as "Array", so noindex was silently lost.
      $is_array = strpos( $kind, 'token:' ) === 0;
      $list = is_array( $current ) ? $current : array_filter( array_map( 'trim', explode( ',', (string) $current ) ) );
      $list = array_values( array_diff( $list, [ $token, $opposite ] ) );
      if ( $value ) {
        $list[] = $token;
      }
      if ( !$list ) {
        return null;
      }
      return $is_array ? $list : implode( ',', $list );
    }
    return $value === null || $value === '' ? null : (string) $value;
  }

  private static function adapters(): array {
    $adapters = [];
    if ( defined( 'WPSEO_VERSION' ) ) {
      $adapters['yoast'] = [ 'name' => 'Yoast SEO',
        'post' => self::flat( [
          'title' => [ '_yoast_wpseo_title', 'text' ], 'description' => [ '_yoast_wpseo_metadesc', 'text' ],
          'focus_keyword' => [ '_yoast_wpseo_focuskw', 'text' ], 'canonical' => [ '_yoast_wpseo_canonical', 'text' ],
          'noindex' => [ '_yoast_wpseo_meta-robots-noindex', 'flag:1' ], 'nofollow' => [ '_yoast_wpseo_meta-robots-nofollow', 'flag:1' ],
          'og_title' => [ '_yoast_wpseo_opengraph-title', 'text' ], 'og_description' => [ '_yoast_wpseo_opengraph-description', 'text' ],
          'og_image' => [ '_yoast_wpseo_opengraph-image', 'text' ] ] ),
        'term' => self::yoast_terms(),
        'after' => [ __CLASS__, 'yoast_refresh' ] ];
    }
    if ( class_exists( 'RankMath' ) ) {
      $rank_math = self::flat( [
        'title' => [ 'rank_math_title', 'text' ], 'description' => [ 'rank_math_description', 'text' ],
        'focus_keyword' => [ 'rank_math_focus_keyword', 'text' ], 'canonical' => [ 'rank_math_canonical_url', 'text' ],
        'noindex' => [ 'rank_math_robots', 'token:noindex' ], 'nofollow' => [ 'rank_math_robots', 'token:nofollow' ],
        'og_title' => [ 'rank_math_facebook_title', 'text' ], 'og_description' => [ 'rank_math_facebook_description', 'text' ],
        'og_image' => [ 'rank_math_facebook_image', 'text' ] ] );
      $adapters['rank_math'] = [ 'name' => 'Rank Math', 'post' => $rank_math, 'term' => $rank_math ];
    }
    if ( function_exists( 'aioseo' ) && class_exists( '\AIOSEO\Plugin\Common\Models\Post' ) ) {
      $adapters['aioseo'] = [ 'name' => 'All in One SEO', 'post' => self::aioseo_posts() ];
    }
    if ( defined( 'SEOPRESS_VERSION' ) ) {
      $seopress = self::flat( [
        'title' => [ '_seopress_titles_title', 'text' ], 'description' => [ '_seopress_titles_desc', 'text' ],
        'focus_keyword' => [ '_seopress_analysis_target_kw', 'text' ], 'canonical' => [ '_seopress_robots_canonical', 'text' ],
        'noindex' => [ '_seopress_robots_index', 'flag:yes' ], 'nofollow' => [ '_seopress_robots_follow', 'flag:yes' ],
        'og_title' => [ '_seopress_social_fb_title', 'text' ], 'og_description' => [ '_seopress_social_fb_desc', 'text' ],
        'og_image' => [ '_seopress_social_fb_img', 'text' ] ] );
      $adapters['seopress'] = [ 'name' => 'SEOPress', 'post' => $seopress, 'term' => $seopress ];
    }
    if ( defined( 'THE_SEO_FRAMEWORK_VERSION' ) ) {
      $adapters['tsf'] = [ 'name' => 'The SEO Framework',
        'post' => self::flat( [
          'title' => [ '_genesis_title', 'text' ], 'description' => [ '_genesis_description', 'text' ],
          'canonical' => [ '_genesis_canonical_uri', 'text' ], 'noindex' => [ '_genesis_noindex', 'flag:1' ],
          'nofollow' => [ '_genesis_nofollow', 'flag:1' ], 'og_title' => [ '_open_graph_title', 'text' ],
          'og_description' => [ '_open_graph_description', 'text' ], 'og_image' => [ '_social_image_url', 'text' ] ] ),
        'term' => self::packed( 'autodescription-term-settings', [
          'title' => [ 'doctitle', 'text' ], 'description' => [ 'description', 'text' ], 'canonical' => [ 'canonical', 'text' ],
          'noindex' => [ 'noindex', 'flag:1' ], 'nofollow' => [ 'nofollow', 'flag:1' ], 'og_title' => [ 'og_title', 'text' ],
          'og_description' => [ 'og_description', 'text' ], 'og_image' => [ 'social_image_url', 'text' ] ] ) ];
    }
    if ( defined( 'SLIM_SEO_VER' ) || class_exists( '\SlimSEO\Plugin' ) ) {
      $slim = self::packed( 'slim_seo', [
        'title' => [ 'title', 'text' ], 'description' => [ 'description', 'text' ], 'canonical' => [ 'canonical', 'text' ],
        'noindex' => [ 'noindex', 'flag:1' ], 'og_image' => [ 'facebook_image', 'text' ] ] );
      $adapters['slim_seo'] = [ 'name' => 'Slim SEO', 'post' => $slim, 'term' => $slim ];
    }
    if ( defined( 'MWSEO_VERSION' ) ) {
      $adapters['seo_engine'] = [ 'name' => 'SEO Engine',
        'post' => self::flat( [
          'title' => [ '_kiss_seo_title', 'text' ], 'description' => [ '_kiss_seo_excerpt', 'text' ],
          'canonical' => [ '_mwseo_canonical', 'text' ], 'noindex' => [ '_mwseo_robots', 'csv:noindex' ],
          'nofollow' => [ '_mwseo_robots', 'csv:nofollow' ] ] ),
        'term' => self::flat( [ 'title' => [ '_mwseo_title', 'text' ], 'description' => [ '_mwseo_description', 'text' ] ] ) ];
    }
    return apply_filters( 'mwai_mcp_seo_adapters', $adapters );
  }

  // Yoast keeps every term's SEO in one option, keyed by taxonomy and term.
  private static function yoast_terms(): array {
    $map = [ 'title' => 'wpseo_title', 'description' => 'wpseo_desc', 'focus_keyword' => 'wpseo_focuskw',
      'canonical' => 'wpseo_canonical', 'noindex' => 'wpseo_noindex', 'og_title' => 'wpseo_opengraph-title',
      'og_description' => 'wpseo_opengraph-description', 'og_image' => 'wpseo_opengraph-image' ];
    return [
      'get' => function ( string $type, int $id, string $taxonomy ) use ( $map ) {
        $data = (array) ( get_option( 'wpseo_taxonomy_meta', [] )[ $taxonomy ][ $id ] ?? [] );
        $out = [];
        foreach ( $map as $field => $key ) {
          $value = $data[ $key ] ?? null;
          $out[ $field ] = $field === 'noindex' ? $value === 'noindex' : ( is_scalar( $value ) && $value !== '' ? (string) $value : null );
        }
        return $out;
      },
      'set' => function ( string $type, int $id, array $changes, string $taxonomy ) use ( $map ) {
        $all = get_option( 'wpseo_taxonomy_meta', [] );
        $all = is_array( $all ) ? $all : [];
        $data = (array) ( $all[ $taxonomy ][ $id ] ?? [] );
        foreach ( $changes as $field => $value ) {
          $value = $field === 'noindex' ? ( $value ? 'noindex' : null ) : $value;
          if ( $value === null || $value === '' ) {
            unset( $data[ $map[ $field ] ] );
          }
          else {
            $data[ $map[ $field ] ] = (string) $value;
          }
        }
        $all[ $taxonomy ][ $id ] = $data;
        update_option( 'wpseo_taxonomy_meta', $all );
      },
      'fields' => array_keys( $map ),
    ];
  }

  // Yoast serves titles from its indexables table, rebuilt on save: without this, the page kept
  // the old title until the post was saved in the editor.
  public static function yoast_refresh( string $type, int $id ) {
    try {
      if ( !function_exists( 'YoastSEO' ) || !class_exists( '\Yoast\WP\SEO\Repositories\Indexable_Repository' ) ) {
        return;
      }
      $repository = YoastSEO()->classes->get( \Yoast\WP\SEO\Repositories\Indexable_Repository::class );
      $builder = YoastSEO()->classes->get( \Yoast\WP\SEO\Builders\Indexable_Builder::class );
      $object = $type === 'post' ? 'post' : 'term';
      $indexable = $repository->find_by_id_and_type( $id, $object, false );
      $builder->build_for_id_and_type( $id, $object, $indexable );
    }
    catch ( Throwable $e ) {
      error_log( '[AI Engine MCP] Yoast indexable refresh failed: ' . $e->getMessage() );
    }
  }

  // AIOSEO keeps its own table; writes go through its model, which also clears its cache.
  private static function aioseo_posts(): array {
    return [
      'get' => function ( string $type, int $id ) {
        $p = \AIOSEO\Plugin\Common\Models\Post::getPost( $id );
        $keyphrases = is_string( $p->keyphrases ) ? json_decode( $p->keyphrases ) : $p->keyphrases;
        $text = function ( $v ) { return is_scalar( $v ) && (string) $v !== '' ? (string) $v : null; };
        return [
          'title' => $text( $p->title ), 'description' => $text( $p->description ),
          'focus_keyword' => $text( $keyphrases->focus->keyphrase ?? null ), 'canonical' => $text( $p->canonical_url ),
          'noindex' => !$p->robots_default && (bool) $p->robots_noindex, 'nofollow' => !$p->robots_default && (bool) $p->robots_nofollow,
          'og_title' => $text( $p->og_title ), 'og_description' => $text( $p->og_description ),
          'og_image' => $p->og_image_type === 'custom_image' ? $text( $p->og_image_custom_url ) : null,
        ];
      },
      'set' => function ( string $type, int $id, array $changes ) {
        $p = \AIOSEO\Plugin\Common\Models\Post::getPost( $id );
        $data = [];
        foreach ( [ 'title' => 'title', 'description' => 'description', 'canonical' => 'canonical_url', 'og_title' => 'og_title', 'og_description' => 'og_description' ] as $field => $key ) {
          if ( array_key_exists( $field, $changes ) ) {
            $data[ $key ] = $changes[ $field ];
          }
        }
        if ( array_key_exists( 'focus_keyword', $changes ) ) {
          $keyphrases = json_decode( wp_json_encode( is_string( $p->keyphrases ) ? json_decode( $p->keyphrases ) : $p->keyphrases ), true ) ?: [ 'focus' => [], 'additional' => [] ];
          $keyphrases['focus'] = [ 'keyphrase' => (string) $changes['focus_keyword'] ];
          $data['keyphrases'] = $keyphrases;
        }
        if ( array_key_exists( 'noindex', $changes ) || array_key_exists( 'nofollow', $changes ) ) {
          // AIOSEO ignores per-post robots while "use the defaults" is on.
          $noindex = array_key_exists( 'noindex', $changes ) ? (bool) $changes['noindex'] : ( !$p->robots_default && $p->robots_noindex );
          $nofollow = array_key_exists( 'nofollow', $changes ) ? (bool) $changes['nofollow'] : ( !$p->robots_default && $p->robots_nofollow );
          $data += [ 'default' => !$noindex && !$nofollow, 'noindex' => $noindex, 'nofollow' => $nofollow ];
        }
        if ( array_key_exists( 'og_image', $changes ) ) {
          $data['og_image_type'] = $changes['og_image'] ? 'custom_image' : 'default';
          $data['og_image_custom_url'] = $changes['og_image'];
        }
        $error = \AIOSEO\Plugin\Common\Models\Post::savePost( $id, $data );
        if ( is_string( $error ) && $error !== '' ) {
          throw new Exception( 'All in One SEO could not save: ' . $error );
        }
      },
      'fields' => self::FIELDS,
    ];
  }

  // The adapter to use: the one asked for, or the first active one.
  private static function adapter( string $wanted = '' ): array {
    $adapters = self::adapters();
    if ( !$adapters ) {
      throw new Exception( 'No SEO plugin is active on this site, so there is nowhere to store SEO titles and descriptions. Supported: Yoast SEO, Rank Math, All in One SEO, SEOPress, The SEO Framework, Slim SEO and SEO Engine.' );
    }
    if ( $wanted !== '' ) {
      if ( !isset( $adapters[ $wanted ] ) ) {
        throw new Exception( "\"$wanted\" is not active. Active: " . implode( ', ', array_keys( $adapters ) ) . '.' );
      }
      return [ $wanted, $adapters[ $wanted ] ];
    }
    $key = array_key_first( $adapters );
    return [ $key, $adapters[ $key ] ];
  }
  #endregion

  #region Tools
  private function tools(): array {
    $target = [
      'ID' => [ 'type' => 'integer', 'description' => 'A post, page or product ID.' ],
      'term_id' => [ 'type' => 'integer', 'description' => 'Or a category, tag or other term ID (with taxonomy).' ],
      'taxonomy' => [ 'type' => 'string', 'description' => 'The term\'s taxonomy, e.g. category or post_tag.' ],
      'plugin' => [ 'type' => 'string', 'description' => 'Optional, when several SEO plugins are active: yoast, rank_math, aioseo, seopress, tsf, slim_seo or seo_engine.' ],
    ];
    return [
      'wp_get_seo' => [
        'name' => 'wp_get_seo',
        'description' => 'Read the SEO fields of posts or terms from the SEO plugin the site uses (Yoast SEO, Rank Math, All in One SEO, SEOPress, The SEO Framework, Slim SEO or SEO Engine, detected): title, description, focus_keyword, canonical, noindex, nofollow, og_title, og_description, og_image. null means the plugin default applies (usually the post title and excerpt). "ids" (up to 50) audits many posts at once.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => $target + [ 'ids' => [ 'type' => 'array', 'items' => [ 'type' => 'integer' ], 'description' => 'Several post IDs at once (max 50).' ] ],
        ],
        'accessLevel' => 'read',
      ],
      'wp_update_seo' => [
        'name' => 'wp_update_seo',
        'description' => 'Set SEO fields of a post or term in the site SEO plugin (see wp_get_seo). "fields": title, description, focus_keyword, canonical, og_title, og_description, og_image (null clears one so the plugin default applies), noindex, nofollow (true or false). Fields the plugin lacks are listed as skipped. Keep titles under about 60 characters and descriptions around 150. Can be undone with mcp_undo_change.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => $target + [ 'fields' => [ 'type' => 'object', 'description' => 'The fields to set.', 'additionalProperties' => true ] ],
          'required' => [ 'fields' ],
        ],
        'accessLevel' => 'write',
      ],
    ];
  }

  // Listed only when an SEO plugin is active: a tool that can only fail is noise for the assistant.
  public function register_tools( array $prev ): array {
    if ( !self::adapters() ) {
      return $prev;
    }
    foreach ( $this->tools() as $tool ) {
      $tool['annotations'] = [ 'readOnlyHint' => $tool['accessLevel'] === 'read', 'destructiveHint' => false, 'openWorldHint' => false ];
      $prev[] = $tool;
    }
    return $prev;
  }

  // [ type, id, taxonomy ] from the arguments, with the capability checked.
  private static function object( array $a, bool $write ): array {
    if ( !empty( $a['term_id'] ) ) {
      $taxonomy = sanitize_key( (string) ( $a['taxonomy'] ?? '' ) );
      $term = get_term( (int) $a['term_id'], $taxonomy );
      if ( !$term || is_wp_error( $term ) ) {
        throw new Exception( 'Term #' . (int) $a['term_id'] . ' was not found' . ( $taxonomy ? " in $taxonomy" : ' (pass its taxonomy)' ) . '.' );
      }
      if ( !current_user_can( 'edit_term', $term->term_id ) ) {
        throw new Exception( 'You are not allowed to edit this term.', Meow_MWAI_Labs_MCP::DENIED_CODE );
      }
      return [ 'term', (int) $term->term_id, $term->taxonomy ];
    }
    $id = (int) ( $a['ID'] ?? $a['post_id'] ?? $a['id'] ?? 0 );
    if ( !$id || !get_post( $id ) ) {
      throw new Exception( 'Pass the ID of a post, page or product (or term_id and taxonomy).' );
    }
    if ( !current_user_can( 'edit_post', $id ) ) {
      throw new Exception( "You are not allowed to edit post #{$id}.", Meow_MWAI_Labs_MCP::DENIED_CODE );
    }
    return [ 'post', $id, '' ];
  }

  private static function read( array $adapter, string $type, int $id, string $taxonomy ): array {
    if ( empty( $adapter[ $type ] ) ) {
      throw new Exception( $adapter['name'] . ' has no SEO fields for ' . ( $type === 'term' ? 'categories and tags' : 'posts' ) . ' here.' );
    }
    return call_user_func( $adapter[ $type ]['get'], $type, $id, $taxonomy );
  }

  public function handle_call( $prev, string $tool, array $args, $id ) {
    if ( !empty( $prev ) || !isset( $this->tools()[ $tool ] ) ) {
      return $prev;
    }
    [ $key, $adapter ] = self::adapter( sanitize_key( (string) ( $args['plugin'] ?? '' ) ) );
    $others = array_diff( array_keys( self::adapters() ), [ $key ] );
    $base = [ 'plugin' => $adapter['name'] ];
    if ( $others ) {
      $base['note'] = 'Other active SEO plugins: ' . implode( ', ', $others ) . '. Pass "plugin" to use one of them.';
    }
    if ( $tool === 'wp_get_seo' ) {
      if ( !empty( $args['ids'] ) ) {
        $ids = is_string( $args['ids'] ) ? json_decode( $args['ids'], true ) : $args['ids'];
        $out = [];
        foreach ( array_slice( array_map( 'intval', (array) $ids ), 0, 50 ) as $post_id ) {
          if ( !get_post( $post_id ) || !current_user_can( 'edit_post', $post_id ) ) {
            continue;
          }
          $out[] = [ 'ID' => $post_id, 'post_title' => get_the_title( $post_id ) ] + self::read( $adapter, 'post', $post_id, '' );
        }
        return $base + [ 'posts' => $out ];
      }
      [ $type, $object_id, $taxonomy ] = self::object( $args, false );
      return $base + [ $type === 'term' ? 'term_id' : 'ID' => $object_id, 'fields' => self::read( $adapter, $type, $object_id, $taxonomy ) ];
    }
    [ $type, $object_id, $taxonomy ] = self::object( $args, true );
    $fields = is_string( $args['fields'] ?? null ) ? json_decode( $args['fields'], true ) : ( $args['fields'] ?? [] );
    $fields = is_array( $fields ) ? $fields : [];
    if ( empty( $adapter[ $type ] ) ) {
      self::read( $adapter, $type, $object_id, $taxonomy );
    }
    $supported = $adapter[ $type ]['fields'];
    $changes = [];
    $skipped = [];
    foreach ( $fields as $field => $value ) {
      if ( !in_array( $field, $supported, true ) ) {
        $skipped[] = $field;
        continue;
      }
      if ( in_array( $field, self::FLAG_FIELDS, true ) ) {
        $changes[ $field ] = rest_sanitize_boolean( $value );
      }
      elseif ( $value === null || $value === '' ) {
        $changes[ $field ] = null;
      }
      else {
        $changes[ $field ] = in_array( $field, self::URL_FIELDS, true ) ? esc_url_raw( (string) $value ) : sanitize_text_field( (string) $value );
      }
    }
    if ( !$changes ) {
      throw new Exception( 'Nothing to set. ' . $adapter['name'] . ' supports: ' . implode( ', ', $supported ) . '.' );
    }
    self::write( $adapter, $type, $object_id, $taxonomy, $changes );
    $result = $base + [ $type === 'term' ? 'term_id' : 'ID' => $object_id, 'fields' => self::read( $adapter, $type, $object_id, $taxonomy ) ];
    if ( $skipped ) {
      $result['skipped'] = $skipped;
      $result['note'] = trim( ( $result['note'] ?? '' ) . ' ' . $adapter['name'] . ' has no ' . implode( ', ', $skipped ) . ' field.' );
    }
    return $result;
  }

  private static function write( array $adapter, string $type, int $id, string $taxonomy, array $changes ) {
    call_user_func( $adapter[ $type ]['set'], $type, $id, $changes, $taxonomy );
    if ( isset( $adapter['after'] ) ) {
      call_user_func( $adapter['after'], $type, $id );
    }
    if ( $type === 'post' ) {
      clean_post_cache( $id );
    }
    else {
      clean_term_cache( $id, $taxonomy );
    }
  }
  #endregion

  #region Undo (labs/mcp-undo.php)
  public function undo_targets( $targets, string $tool, array $a ) {
    if ( $tool !== 'wp_update_seo' ) {
      return $targets;
    }
    try {
      [ $key ] = self::adapter( sanitize_key( (string) ( $a['plugin'] ?? '' ) ) );
      $term = !empty( $a['term_id'] );
      $id = $term ? (int) $a['term_id'] : (int) ( $a['ID'] ?? $a['post_id'] ?? $a['id'] ?? 0 );
      $taxonomy = $term ? sanitize_key( (string) ( $a['taxonomy'] ?? '' ) ) : '';
      if ( $term && $taxonomy === '' && ( $t = get_term( $id ) ) && !is_wp_error( $t ) ) {
        $taxonomy = $t->taxonomy;
      }
      return $id ? [ [ 'kind' => 'seo', 'plugin' => $key, 'type' => $term ? 'term' : 'post', 'id' => $id, 'taxonomy' => $taxonomy ] ] : null;
    }
    catch ( Throwable $e ) {
      return null;
    }
  }

  public function undo_kinds( array $kinds ): array {
    $adapter_of = function ( $t ) {
      $adapters = self::adapters();
      if ( !isset( $adapters[ $t['plugin'] ] ) ) {
        throw new Exception( 'The SEO plugin this change was made with is no longer active.' );
      }
      return $adapters[ $t['plugin'] ];
    };
    $kinds['seo'] = [
      'read' => function ( $t ) use ( $adapter_of ) {
        return self::read( $adapter_of( $t ), $t['type'], (int) $t['id'], (string) $t['taxonomy'] );
      },
      'write' => function ( $t, $state ) use ( $adapter_of ) {
        self::write( $adapter_of( $t ), $t['type'], (int) $t['id'], (string) $t['taxonomy'], (array) $state );
      },
      'can' => function ( $t ) {
        return current_user_can( $t['type'] === 'term' ? 'edit_term' : 'edit_post', (int) $t['id'] );
      },
      'title' => function ( $t ) {
        if ( $t['type'] === 'term' ) {
          $term = get_term( (int) $t['id'] );
          return $term && !is_wp_error( $term ) ? $term->name : '#' . $t['id'];
        }
        return Meow_MWAI_Labs_MCP_Undo::post_title( (int) $t['id'] );
      },
    ];
    return $kinds;
  }
  #endregion
}
