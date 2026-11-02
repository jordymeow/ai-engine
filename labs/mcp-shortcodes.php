<?php

// Shortcode page builders for MCP (WPBakery, Divi 4 pages, Avada, Flatsome): the page is a tree of
// shortcodes in post_content, read as an outline with paths and edited like blocks
// (labs/mcp-blocks.php): update, insert, move, delete in one atomic batch, with dry run and a hash.
// Paths are the ones from the outline the agent read, whatever earlier operations moved.
// Only registered shortcodes and builder prefixes are tags, so "[1]" or "[sic]" stays text, and a shortcode
// nobody edits is written back exactly as it was. Undo is the post's content (labs/mcp-undo.php).
class Meow_MWAI_Labs_MCP_Shortcodes {
  public function __construct() {
    add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
  }

  public function rest_api_init() {
    add_filter( 'mwai_mcp_tools', [ $this, 'register_tools' ] );
    add_filter( 'mwai_mcp_callback', [ $this, 'handle_call' ], 10, 4 );
  }

  // Builders register their shortcodes late (for page rendering), so REST requests have none yet.
  private static function load_shortcodes() {
    static $done = false;
    if ( $done ) {
      return;
    }
    $done = true;
    if ( class_exists( 'WPBMap' ) && method_exists( 'WPBMap', 'addAllMappedShortcodes' ) ) {
      WPBMap::addAllMappedShortcodes();
    }
  }

  // Divi registers its shortcodes only to render a page, never in a REST request: the builders'
  // own prefixes count as shortcodes even before they are registered.
  private const BUILDER_PREFIXES = '/^(et_pb_|vc_|ux_|fusion_)/';

  private static function is_tag( string $tag ): bool {
    return shortcode_exists( $tag ) || (bool) preg_match( self::BUILDER_PREFIXES, $tag );
  }

  // The shortcode builders this site runs.
  public static function builders(): array {
    self::load_shortcodes();
    $out = [];
    if ( defined( 'WPB_VC_VERSION' ) || shortcode_exists( 'vc_row' ) ) {
      $out[] = 'WPBakery';
    }
    if ( defined( 'ET_BUILDER_VERSION' ) || defined( 'ET_BUILDER_PLUGIN_VERSION' ) ) {
      $out[] = 'Divi';
    }
    if ( defined( 'UX_BUILDER_VERSION' ) || shortcode_exists( 'ux_banner' ) ) {
      $out[] = 'Flatsome';
    }
    if ( defined( 'FUSION_BUILDER_VERSION' ) ) {
      $out[] = 'Avada';
    }
    return $out;
  }

  #region Parse and serialize
  // A node: [ 'tag', 'raw' (opening tag as written), 'atts', 'parts' (strings and nodes), 'closed' ].
  public static function parse( string $content ): array {
    self::load_shortcodes();
    $root = [ 'tag' => null, 'parts' => [] ];
    $stack = [ &$root ];
    $offset = 0;
    preg_match_all( '/\[(\[?)(\/?)([a-zA-Z_][\w-]*)((?:[^\[\]"\']|"[^"]*"|\'[^\']*\')*?)(\/?)\](\]?)/', $content, $matches, PREG_SET_ORDER | PREG_OFFSET_CAPTURE );
    foreach ( $matches as $m ) {
      [ $raw, $at ] = $m[0];
      $tag = $m[3][0];
      // [[tag]] is an escaped shortcode, and unknown tags are text.
      if ( $m[1][0] === '[' || !self::is_tag( $tag ) ) {
        continue;
      }
      $top = &$stack[ count( $stack ) - 1 ];
      if ( $at > $offset ) {
        $top['parts'][] = substr( $content, $offset, $at - $offset );
      }
      $offset = $at + strlen( $raw );
      if ( $m[2][0] === '/' ) {
        // A closer: close the nearest open node with this tag. Nodes opened after it were
        // self-closing after all: their content moves up next to them.
        for ( $i = count( $stack ) - 1; $i > 0 && $stack[ $i ]['tag'] !== $tag; $i-- );
        if ( $i === 0 ) {
          $top['parts'][] = $raw;
          unset( $top );
          continue;
        }
        while ( count( $stack ) - 1 > $i ) {
          self::spill( $stack );
        }
        $stack[ $i ]['closed'] = true;
        array_pop( $stack );
        unset( $top );
        continue;
      }
      $node = [ 'tag' => $tag, 'raw' => $raw, 'atts' => (array) shortcode_parse_atts( $m[4][0] ), 'parts' => [], 'closed' => false ];
      $top['parts'][] = $node;
      if ( $m[5][0] !== '/' ) {
        $stack[] = &$top['parts'][ count( $top['parts'] ) - 1 ];
      }
      unset( $top );
    }
    $top = &$stack[ count( $stack ) - 1 ];
    if ( $offset < strlen( $content ) ) {
      $top['parts'][] = substr( $content, $offset );
    }
    unset( $top );
    while ( count( $stack ) > 1 ) {
      self::spill( $stack );
    }
    self::number( $root['parts'], '' );
    return $root;
  }

  // The innermost open node turns out not to enclose anything: its parts follow it in its parent.
  private static function spill( array &$stack ) {
    $node = &$stack[ count( $stack ) - 1 ];
    $parts = $node['parts'];
    $node['parts'] = [];
    array_pop( $stack );
    $parent = &$stack[ count( $stack ) - 1 ];
    $index = count( $parent['parts'] ) - 1;
    array_splice( $parent['parts'], $index + 1, 0, $parts );
  }

  private static function number( array &$parts, string $prefix ) {
    $i = 0;
    foreach ( $parts as &$part ) {
      if ( is_array( $part ) ) {
        $part['_path'] = $prefix === '' ? (string) $i : $prefix . '.' . $i;
        $i++;
        self::number( $part['parts'], $part['_path'] );
      }
    }
  }

  public static function serialize( array $parts ): string {
    $out = '';
    foreach ( $parts as $part ) {
      if ( is_string( $part ) ) {
        $out .= $part;
        continue;
      }
      $out .= $part['raw'] ?? self::open_tag( $part );
      if ( $part['closed'] ) {
        $out .= self::serialize( $part['parts'] ) . '[/' . $part['tag'] . ']';
      }
    }
    return $out;
  }

  private static function open_tag( array $node ): string {
    $atts = '';
    foreach ( $node['atts'] as $key => $value ) {
      $value = str_replace( [ '"', '[', ']' ], [ '&quot;', '&#91;', '&#93;' ], (string) $value );
      $atts .= is_int( $key ) ? ' ' . $value : ' ' . $key . '="' . $value . '"';
    }
    return '[' . $node['tag'] . $atts . ']';
  }
  #endregion

  #region Reading
  private static function children( array $node ): array {
    return array_values( array_filter( $node['parts'], 'is_array' ) );
  }

  private static function text( array $node ): string {
    $text = implode( ' ', array_filter( $node['parts'], 'is_string' ) );
    $text = trim( preg_replace( '/\s+/u', ' ', html_entity_decode( wp_strip_all_tags( $text ), ENT_QUOTES, 'UTF-8' ) ) );
    return mb_strlen( $text ) > 100 ? mb_substr( $text, 0, 97 ) . '...' : $text;
  }

  public static function outline( array $node ): array {
    $out = [];
    foreach ( self::children( $node ) as $child ) {
      $row = [ 'path' => $child['_path'] ?? '?', 'tag' => $child['tag'] ];
      $atts = [];
      foreach ( $child['atts'] as $key => $value ) {
        // Long values are encoded payloads (images, CSS): their name is enough here.
        $atts[ $key ] = mb_strlen( (string) $value ) > 80 ? '(' . mb_strlen( (string) $value ) . ' chars)' : $value;
      }
      if ( $atts ) {
        $row['atts'] = $atts;
      }
      if ( ( $text = self::text( $child ) ) !== '' ) {
        $row['text'] = $text;
      }
      if ( $kids = self::outline( $child ) ) {
        $row['children'] = $kids;
      }
      $out[] = $row;
    }
    return $out;
  }

  public static function find( array $node, string $path ): ?array {
    foreach ( self::children( $node ) as $child ) {
      if ( ( $child['_path'] ?? null ) === $path ) {
        return $child;
      }
      if ( $found = self::find( $child, $path ) ) {
        return $found;
      }
    }
    return null;
  }
  #endregion

  #region Edits
  // Calls $fn( &$parent, $index in parts ) where the node with this path sits.
  private static function at( array &$parent, string $path, callable $fn ): bool {
    foreach ( $parent['parts'] as $i => $part ) {
      if ( is_array( $part ) && ( $part['_path'] ?? null ) === $path ) {
        $fn( $parent, $i );
        return true;
      }
    }
    foreach ( $parent['parts'] as $i => $part ) {
      if ( is_array( $part ) && self::at( $parent['parts'][ $i ], $path, $fn ) ) {
        return true;
      }
    }
    return false;
  }

  private static function replace_text( array &$node, string $search, string $replace ): int {
    $count = 0;
    foreach ( $node['parts'] as $i => $part ) {
      if ( is_string( $part ) ) {
        $n = 0;
        $node['parts'][ $i ] = str_replace( $search, $replace, $part, $n );
        $count += $n;
      }
      else {
        $count += self::replace_text( $node['parts'][ $i ], $search, $replace );
      }
    }
    return $count;
  }

  private static function markup( array $op, string $label ): array {
    $nodes = array_values( array_filter( self::parse( (string) ( $op['markup'] ?? '' ) )['parts'], 'is_array' ) );
    if ( !$nodes ) {
      throw new Exception( "$label: \"markup\" holds no shortcode this site knows." );
    }
    $strip = function ( array $node ) use ( &$strip ) {
      unset( $node['_path'] );
      foreach ( $node['parts'] as $i => $part ) {
        if ( is_array( $part ) ) {
          $node['parts'][ $i ] = $strip( $part );
        }
      }
      return $node;
    };
    return array_map( $strip, $nodes );
  }

  public static function apply( array $root, array $ops ): array {
    foreach ( array_values( $ops ) as $n => $op ) {
      $label = 'Operation ' . ( $n + 1 );
      $path = (string) ( $op['path'] ?? '' );
      $require = function ( $path ) use ( &$root, $label ) {
        if ( $path === '' || !self::find( $root, $path ) ) {
          throw new Exception( "$label: no shortcode at path \"$path\" (paths are the ones from wp_get_shortcodes; one removed by an earlier operation is gone)." );
        }
      };
      switch ( $op['op'] ?? '' ) {
        case 'update':
          $require( $path );
          self::at( $root, $path, function ( &$parent, $i ) use ( $op, $label, $path ) {
            $node = &$parent['parts'][ $i ];
            if ( isset( $op['atts'] ) ) {
              foreach ( (array) $op['atts'] as $key => $value ) {
                if ( $value === null ) {
                  unset( $node['atts'][ $key ] );
                }
                else {
                  $node['atts'][ $key ] = (string) $value;
                }
              }
              unset( $node['raw'] );
            }
            if ( isset( $op['content'] ) ) {
              if ( self::children( $node ) ) {
                throw new Exception( "$label: \"$path\" holds other shortcodes; change them, or use search and replace." );
              }
              $node['parts'] = [ (string) $op['content'] ];
              $node['closed'] = true;
            }
            if ( isset( $op['search'] ) ) {
              if ( (string) $op['search'] === '' || !self::replace_text( $node, (string) $op['search'], (string) ( $op['replace'] ?? '' ) ) ) {
                throw new Exception( "$label: \"{$op['search']}\" was not found in \"$path\"." );
              }
            }
            if ( !isset( $op['atts'] ) && !isset( $op['content'] ) && !isset( $op['search'] ) ) {
              throw new Exception( "$label: \"update\" needs atts, content, or search and replace." );
            }
          } );
          break;

        case 'insert':
          self::place( $root, self::markup( $op, $label ), $path, (string) ( $op['position'] ?? ( $path === '' ? 'end' : 'after' ) ), $label, $require );
          break;

        case 'move':
          $require( $path );
          $to = (string) ( $op['to'] ?? '' );
          $require( $to );
          $moving = self::find( $root, $path );
          if ( $to === $path || self::find( $moving, $to ) ) {
            throw new Exception( "$label: a shortcode cannot be moved into itself." );
          }
          self::at( $root, $path, function ( &$parent, $i ) {
            array_splice( $parent['parts'], $i, 1 );
          } );
          self::place( $root, [ $moving ], $to, (string) ( $op['position'] ?? 'after' ), $label, $require );
          break;

        case 'delete':
          $require( $path );
          self::at( $root, $path, function ( &$parent, $i ) {
            array_splice( $parent['parts'], $i, 1 );
          } );
          break;

        default:
          throw new Exception( "$label: \"op\" must be update, insert, move or delete." );
      }
    }
    return $root;
  }

  private static function place( array &$root, array $nodes, string $anchor, string $position, string $label, callable $require ) {
    if ( $position === 'start' || $position === 'end' ) {
      $position === 'start' ? array_splice( $root['parts'], 0, 0, $nodes ) : array_push( $root['parts'], ...$nodes );
      return;
    }
    if ( !in_array( $position, [ 'before', 'after', 'inside' ], true ) ) {
      throw new Exception( "$label: \"position\" must be before, after, inside, start or end." );
    }
    $require( $anchor );
    self::at( $root, $anchor, function ( &$parent, $i ) use ( $nodes, $position, $label ) {
      if ( $position === 'inside' ) {
        $target = &$parent['parts'][ $i ];
        if ( !$target['closed'] ) {
          throw new Exception( "$label: [{$target['tag']}] does not hold other shortcodes." );
        }
        array_push( $target['parts'], ...$nodes );
        return;
      }
      array_splice( $parent['parts'], $position === 'before' ? $i : $i + 1, 0, $nodes );
    } );
  }
  #endregion

  #region Tools
  private function tools(): array {
    return [
      'wp_get_shortcodes' => [
        'name' => 'wp_get_shortcodes',
        'description' => 'Read a page built with a shortcode page builder (' . implode( ', ', self::builders() ) . ') as an outline: each shortcode with its path ("0.1.2"), tag, attributes and text, plus a hash. Pass path to get one shortcode in full. Then change it with wp_edit_shortcodes.',
        'inputSchema' => [ 'type' => 'object', 'properties' => [
          'ID' => [ 'type' => 'integer' ], 'path' => [ 'type' => 'string', 'description' => 'Optional: one shortcode, in full.' ],
        ], 'required' => [ 'ID' ] ],
        'accessLevel' => 'read',
      ],
      'wp_edit_shortcodes' => [
        'name' => 'wp_edit_shortcodes',
        'description' => 'Change a shortcode page builder page without rewriting it, using the paths from wp_get_shortcodes. "operations" run in order, all paths refer to the outline you read, and nothing is saved if one fails: {"op":"update","path":"0.0.1", then "atts" (merged; null removes one), "content" (the new inner text or HTML of a shortcode holding no other), or "search"+"replace"}; {"op":"insert","path":"0.0","position":"before|after|inside","markup":"[vc_column_text]...[/vc_column_text]"} (no path with position "start" or "end"); {"op":"move","path":"1","to":"0","position":"before|after|inside"}; {"op":"delete","path":"2"}. Use the builder\'s own shortcode names and attributes, as read. dry_run returns the new outline; if_hash refuses the edit if the page changed. Can be undone with mcp_undo_change.',
        'inputSchema' => [ 'type' => 'object', 'properties' => [
          'ID' => [ 'type' => 'integer' ],
          'operations' => [ 'type' => 'array', 'items' => [ 'type' => 'object', 'additionalProperties' => true ] ],
          'dry_run' => [ 'type' => 'boolean' ],
          'if_hash' => [ 'type' => 'string' ],
        ], 'required' => [ 'ID', 'operations' ] ],
        'accessLevel' => 'write',
      ],
    ];
  }

  public function register_tools( array $prev ): array {
    if ( !self::builders() ) {
      return $prev;
    }
    foreach ( $this->tools() as $tool ) {
      $tool['annotations'] = [ 'readOnlyHint' => $tool['accessLevel'] === 'read', 'destructiveHint' => false, 'openWorldHint' => false ];
      $prev[] = $tool;
    }
    return $prev;
  }

  public function handle_call( $prev, string $tool, array $args, $id ) {
    if ( !empty( $prev ) || !isset( $this->tools()[ $tool ] ) ) {
      return $prev;
    }
    $post = get_post( (int) ( $args['ID'] ?? $args['post_id'] ?? 0 ) );
    if ( !$post ) {
      throw new Exception( 'Post not found (pass "ID").' );
    }
    if ( !current_user_can( 'edit_post', $post->ID ) ) {
      throw new Exception( "You are not allowed to edit post #{$post->ID}.", Meow_MWAI_Labs_MCP::DENIED_CODE );
    }
    $root = self::parse( $post->post_content );
    if ( !self::children( $root ) ) {
      throw new Exception( "Post #{$post->ID} has no builder shortcodes. For blocks use wp_get_blocks; otherwise wp_alter_post." );
    }
    $hash = substr( md5( $post->post_content ), 0, 12 );
    if ( $tool === 'wp_get_shortcodes' ) {
      if ( !empty( $args['path'] ) ) {
        $node = self::find( $root, (string) $args['path'] );
        if ( !$node ) {
          throw new Exception( 'No shortcode at path "' . $args['path'] . '".' );
        }
        return [ 'path' => (string) $args['path'], 'tag' => $node['tag'], 'atts' => (object) $node['atts'], 'markup' => self::serialize( [ $node ] ), 'hash' => $hash ];
      }
      return [ 'ID' => $post->ID, 'builders' => self::builders(), 'hash' => $hash, 'shortcodes' => self::outline( $root ) ];
    }
    if ( !empty( $args['if_hash'] ) && $args['if_hash'] !== $hash ) {
      throw new Exception( 'The page changed since you read it. Call wp_get_shortcodes again.' );
    }
    $ops = is_string( $args['operations'] ?? null ) ? json_decode( $args['operations'], true ) : ( $args['operations'] ?? [] );
    if ( !is_array( $ops ) || !$ops ) {
      throw new Exception( '"operations" must be a non-empty array.' );
    }
    try {
      $root = self::apply( $root, $ops );
    }
    catch ( Exception $e ) {
      throw new Exception( $e->getMessage() . ' Nothing was saved.' );
    }
    $content = self::serialize( $root['parts'] );
    if ( !empty( $args['dry_run'] ) ) {
      return [ 'ID' => $post->ID, 'dry_run' => true, 'shortcodes' => self::outline( self::parse( $content ) ) ];
    }
    $update = [ 'ID' => $post->ID, 'post_content' => $content ];
    // A draft keeps floating, as with the other content tools.
    if ( $post->post_date_gmt === '0000-00-00 00:00:00' && in_array( $post->post_status, [ 'draft', 'pending', 'auto-draft' ], true ) ) {
      $update += [ 'post_date' => $post->post_date, 'edit_date' => true ];
    }
    $saved = wp_update_post( wp_slash( $update ), true );
    if ( is_wp_error( $saved ) ) {
      throw new Exception( $saved->get_error_message() );
    }
    // WPBakery builds its CSS from the shortcodes and caches it: rebuilt on the next view.
    delete_post_meta( $post->ID, '_wpb_shortcodes_default_css_updated' );
    delete_post_meta( $post->ID, '_wpb_shortcodes_custom_css_updated' );
    $fresh = get_post( $post->ID )->post_content;
    return [ 'ID' => $post->ID, 'saved' => true, 'hash' => substr( md5( $fresh ), 0, 12 ), 'shortcodes' => self::outline( self::parse( $fresh ) ) ];
  }
  #endregion
}
