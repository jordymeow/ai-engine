<?php

// Block-level editing for MCP (wp_get_blocks, wp_edit_blocks in labs/mcp-core.php): a post's blocks
// as an outline with paths ("2", "2.0"), and edits that touch one block instead of rewriting the
// whole post.
//
// Every block keeps the path it had in the outline the agent read ('_path'), whatever earlier
// operations did to the tree, so a batch of operations never addresses a shifted block.
// A parent lists its children twice: in innerBlocks, and as null placeholders in innerContent
// (the HTML around them). Both are kept in step, or serialize_block() drops or misplaces children.
class Meow_MWAI_Labs_MCP_Blocks {
  private const OUTLINE_ATTRS = [ 'level', 'ordered', 'id', 'url', 'href', 'align', 'ref', 'slug', 'className' ];

  public static function hash( string $content ): string {
    return substr( md5( $content ), 0, 12 );
  }

  public static function has_blocks( string $content ): bool {
    return strpos( $content, '<!-- wp:' ) !== false;
  }

  // WordPress's own block delimiter pattern (WP_Block_Parser::next_token()).
  private const DELIMITER = '/<!--[ \t\f\r\n]+(?P<closer>\/)?wp:(?P<namespace>[a-z][a-z0-9_-]*\/)?(?P<name>[a-z][a-z0-9_-]*)[ \t\f\r\n]+(?P<attrs>{(?:(?:[^}]+|}+(?=})|(?!}[ \t\f\r\n]+\/?-->).)*+)?}[ \t\f\r\n]+)?(?P<void>\/)?-->/s';

  // The root is a pseudo-parent, so the top level is edited like any other parent.
  public static function parse( string $content ): array {
    $blocks = parse_blocks( $content );
    self::keep_raw_attrs( $blocks, $content );
    $root = [ 'blockName' => null, 'innerBlocks' => self::without_gaps( $blocks ), 'innerContent' => null ];
    self::number( $root['innerBlocks'], '' );
    return $root;
  }

  // Attributes go back exactly as written unless an edit changed them. Re-encoding them is not
  // neutral: PHP turns an empty object into [] (WooCommerce's taxQuery: {} broke that way) and
  // rewrites numbers (0.80000000000000004 became 0.8). Openers come in document order, the
  // same order as a depth-first walk of the parsed tree.
  private static function keep_raw_attrs( array &$blocks, string $content ) {
    if ( !preg_match_all( self::DELIMITER, $content, $matches, PREG_SET_ORDER ) ) {
      return;
    }
    $openers = array_values( array_filter( $matches, function ( $m ) { return empty( $m['closer'] ); } ) );
    $named = 0;
    $count = function ( array $list ) use ( &$count, &$named ) {
      foreach ( $list as $b ) {
        $named += empty( $b['blockName'] ) ? 0 : 1;
        $count( $b['innerBlocks'] ?? [] );
      }
    };
    $count( $blocks );
    if ( $named !== count( $openers ) ) {
      return;
    }
    $i = 0;
    $assign = function ( array &$list ) use ( &$assign, &$i, $openers ) {
      foreach ( $list as &$b ) {
        if ( !empty( $b['blockName'] ) ) {
          $b['_raw_attrs'] = trim( (string) ( $openers[ $i++ ]['attrs'] ?? '' ) );
          $b['_orig_attrs'] = $b['attrs'];
        }
        $assign( $b['innerBlocks'] );
      }
    };
    $assign( $blocks );
  }

  // The whitespace between top-level blocks comes back from parse_blocks() as empty classic blocks.
  private static function without_gaps( array $blocks ): array {
    return array_values( array_filter( $blocks, function ( $b ) {
      return !empty( $b['blockName'] ) || trim( (string) $b['innerHTML'] ) !== '';
    } ) );
  }

  private static function number( array &$blocks, string $prefix ) {
    foreach ( $blocks as $i => &$b ) {
      $b['_path'] = $prefix === '' ? (string) $i : $prefix . '.' . $i;
      if ( !empty( $b['innerBlocks'] ) ) {
        self::number( $b['innerBlocks'], $b['_path'] );
      }
    }
  }

  public static function serialize( array $root ): string {
    return implode( "\n\n", array_map( [ __CLASS__, 'serialize_block' ], $root['innerBlocks'] ) );
  }

  // serialize_block() from core, but with the attributes as written when they did not change.
  public static function serialize_block( array $b ): string {
    $content = '';
    $index = 0;
    foreach ( (array) $b['innerContent'] as $chunk ) {
      $content .= is_string( $chunk ) ? $chunk : self::serialize_block( $b['innerBlocks'][ $index++ ] );
    }
    if ( empty( $b['blockName'] ) ) {
      return $content;
    }
    $attrs = is_array( $b['attrs'] ?? null ) ? $b['attrs'] : [];
    if ( isset( $b['_raw_attrs'] ) && $attrs === $b['_orig_attrs'] ) {
      $json = $b['_raw_attrs'] === '' ? '' : $b['_raw_attrs'] . ' ';
    }
    else {
      $json = $attrs ? serialize_block_attributes( $attrs ) . ' ' : '';
    }
    $name = strpos( $b['blockName'], 'core/' ) === 0 ? substr( $b['blockName'], 5 ) : $b['blockName'];
    return $content === '' ? "<!-- wp:$name $json/-->" : "<!-- wp:$name $json-->" . $content . "<!-- /wp:$name -->";
  }

  #region Reading
  public static function type( array $b ): string {
    return empty( $b['blockName'] ) ? 'classic' : preg_replace( '/^core\//', '', $b['blockName'] );
  }

  // Attribute keys that are structure, not content: never shown as text, never searched.
  private const TECHNICAL_ATTRS = [ 'className', 'anchor', 'id', 'ref', 'slug', 'tagName', 'layout', 'style', 'lock', 'metadata' ];

  // The longest text kept in a block's attributes: blocks like Divi 5 modules keep their content
  // there ({"content":{"innerContent":{"desktop":{"value":"<p>...</p>"}}}}), not in their HTML.
  private static function attr_text( $value ): string {
    if ( is_string( $value ) ) {
      return $value;
    }
    $best = '';
    if ( is_array( $value ) ) {
      foreach ( $value as $key => $item ) {
        if ( is_string( $key ) && in_array( $key, self::TECHNICAL_ATTRS, true ) ) {
          continue;
        }
        $text = self::attr_text( $item );
        if ( mb_strlen( wp_strip_all_tags( $text ) ) > mb_strlen( wp_strip_all_tags( $best ) ) ) {
          $best = $text;
        }
      }
    }
    return $best;
  }

  private static function text( array $b ): string {
    $html = trim( wp_strip_all_tags( (string) ( $b['innerHTML'] ?? '' ) ) ) !== '' ? (string) $b['innerHTML'] : self::attr_text( $b['attrs'] ?? [] );
    $text = html_entity_decode( wp_strip_all_tags( $html ), ENT_QUOTES, 'UTF-8' );
    $text = trim( preg_replace( '/\s+/u', ' ', $text ) );
    return mb_strlen( $text ) > 100 ? mb_substr( $text, 0, 97 ) . '...' : $text;
  }

  public static function outline( array $blocks ): array {
    $out = [];
    foreach ( $blocks as $b ) {
      $node = [ 'path' => $b['_path'] ?? '?', 'type' => self::type( $b ) ];
      $text = self::text( $b );
      if ( $text !== '' ) {
        $node['text'] = $text;
      }
      $attrs = array_intersect_key( (array) ( $b['attrs'] ?? [] ), array_flip( self::OUTLINE_ATTRS ) );
      if ( $attrs ) {
        $node['attrs'] = $attrs;
      }
      if ( !empty( $b['innerBlocks'] ) ) {
        $node['blocks'] = self::outline( $b['innerBlocks'] );
      }
      $out[] = $node;
    }
    return $out;
  }

  public static function find( array $blocks, string $path ): ?array {
    foreach ( $blocks as $b ) {
      if ( ( $b['_path'] ?? null ) === $path ) {
        return $b;
      }
      if ( !empty( $b['innerBlocks'] ) && ( $found = self::find( $b['innerBlocks'], $path ) ) ) {
        return $found;
      }
    }
    return null;
  }
  #endregion

  #region Tree edits
  // Calls $fn( &$parent, $index ) on the parent holding the block with this path.
  private static function at( array &$parent, string $path, callable $fn ): bool {
    foreach ( $parent['innerBlocks'] as $i => $b ) {
      if ( ( $b['_path'] ?? null ) === $path ) {
        $fn( $parent, $i );
        return true;
      }
    }
    foreach ( $parent['innerBlocks'] as $i => $b ) {
      if ( !empty( $b['innerBlocks'] ) && self::at( $parent['innerBlocks'][ $i ], $path, $fn ) ) {
        return true;
      }
    }
    return false;
  }

  private static function remove_child( array &$parent, int $index ): array {
    $child = $parent['innerBlocks'][ $index ];
    array_splice( $parent['innerBlocks'], $index, 1 );
    if ( is_array( $parent['innerContent'] ) ) {
      $slot = self::slot( $parent['innerContent'], $index );
      array_splice( $parent['innerContent'], $slot, 1 );
      $parent['innerContent'] = self::merge_strings( $parent['innerContent'] );
    }
    return $child;
  }

  private static function insert_children( array &$parent, int $index, array $children ) {
    array_splice( $parent['innerBlocks'], $index, 0, $children );
    if ( !is_array( $parent['innerContent'] ) ) {
      return;
    }
    $content = $parent['innerContent'];
    $count = count( array_filter( $content, 'is_null' ) );
    $placeholders = [];
    foreach ( $children as $n => $child ) {
      if ( $n > 0 ) {
        $placeholders[] = "\n\n";
      }
      $placeholders[] = null;
    }
    if ( $count === 0 ) {
      // An empty wrapper is one string: the children go before its closing tag.
      $html = (string) implode( '', $content );
      $close = strrpos( $html, '</' );
      $close = $close === false ? strlen( $html ) : $close;
      $content = array_merge( [ substr( $html, 0, $close ) ], $placeholders, [ substr( $html, $close ) ] );
    }
    elseif ( $index < $count ) {
      array_splice( $content, self::slot( $content, $index ), 0, array_merge( $placeholders, [ "\n\n" ] ) );
    }
    else {
      array_splice( $content, self::slot( $content, $count - 1 ) + 1, 0, array_merge( [ "\n\n" ], $placeholders ) );
    }
    $parent['innerContent'] = self::merge_strings( $content );
  }

  // Position in innerContent of the placeholder for child $index.
  private static function slot( array $content, int $index ): int {
    $seen = -1;
    foreach ( $content as $pos => $chunk ) {
      if ( $chunk === null && ++$seen === $index ) {
        return $pos;
      }
    }
    return count( $content );
  }

  private static function merge_strings( array $content ): array {
    $out = [];
    foreach ( $content as $chunk ) {
      $last = count( $out ) - 1;
      if ( $chunk !== null && $last >= 0 && $out[ $last ] !== null ) {
        $out[ $last ] .= $chunk;
        continue;
      }
      $out[] = $chunk;
    }
    return $out;
  }

  private static function refresh_html( array &$b ) {
    $b['innerHTML'] = implode( '', array_filter( (array) $b['innerContent'], 'is_string' ) );
  }

  private static function replace_in_attrs( $value, string $search, string $replace, int &$count ) {
    if ( is_string( $value ) ) {
      $n = 0;
      $value = str_replace( $search, $replace, $value, $n );
      $count += $n;
      return $value;
    }
    if ( is_array( $value ) ) {
      foreach ( $value as $key => $item ) {
        if ( !( is_string( $key ) && in_array( $key, self::TECHNICAL_ATTRS, true ) ) ) {
          $value[ $key ] = self::replace_in_attrs( $item, $search, $replace, $count );
        }
      }
    }
    return $value;
  }

  private static function replace_text( array &$b, string $search, string $replace ): int {
    $count = 0;
    // Text kept in attributes (Divi 5 modules, many third-party blocks) is content too.
    if ( !empty( $b['attrs'] ) ) {
      $b['attrs'] = self::replace_in_attrs( $b['attrs'], $search, $replace, $count );
    }
    foreach ( $b['innerContent'] as $i => $chunk ) {
      if ( is_string( $chunk ) ) {
        $n = 0;
        $b['innerContent'][ $i ] = str_replace( $search, $replace, $chunk, $n );
        $count += $n;
      }
    }
    self::refresh_html( $b );
    foreach ( $b['innerBlocks'] as $i => $child ) {
      $count += self::replace_text( $b['innerBlocks'][ $i ], $search, $replace );
    }
    return $count;
  }
  #endregion

  #region Operations
  // Applies the operations in order to the parsed tree. $toBlocks turns an operation's "block",
  // "blocks" or "markup" into parsed blocks (or throws). Throws on the first bad operation, so
  // nothing is saved half-done.
  public static function apply( array $root, array $ops, callable $toBlocks ): array {
    foreach ( array_values( $ops ) as $n => $op ) {
      $label = 'Operation ' . ( $n + 1 );
      if ( !is_array( $op ) ) {
        throw new Exception( "$label is not an object." );
      }
      $action = (string) ( $op['op'] ?? '' );
      $path = isset( $op['path'] ) ? (string) $op['path'] : '';
      $require = function ( $path ) use ( &$root, $label ) {
        if ( $path === '' || !self::find( $root['innerBlocks'], $path ) ) {
          throw new Exception( "$label: no block at path \"$path\" (paths are the ones from wp_get_blocks; a block removed by an earlier operation is gone)." );
        }
      };
      switch ( $action ) {
        case 'update':
          $require( $path );
          self::at( $root, $path, function ( &$parent, $i ) use ( $op, $label, $toBlocks, $path ) {
            $block = &$parent['innerBlocks'][ $i ];
            if ( isset( $op['block'] ) || isset( $op['markup'] ) ) {
              $new = $toBlocks( isset( $op['block'] ) ? [ 'blocks' => [ $op['block'] ] ] : [ 'markup' => $op['markup'] ], $label );
              if ( count( $new ) !== 1 ) {
                throw new Exception( "$label: \"update\" takes exactly one block; use \"insert\" to add more." );
              }
              $new[0]['_path'] = $path;
              $block = $new[0];
            }
            if ( isset( $op['attrs'] ) ) {
              if ( !is_array( $op['attrs'] ) ) {
                throw new Exception( "$label: \"attrs\" must be an object." );
              }
              foreach ( $op['attrs'] as $key => $value ) {
                if ( $value === null ) {
                  unset( $block['attrs'][ $key ] );
                }
                else {
                  $block['attrs'][ $key ] = $value;
                }
              }
            }
            if ( isset( $op['search'] ) ) {
              $search = (string) $op['search'];
              if ( $search === '' || self::replace_text( $block, $search, (string) ( $op['replace'] ?? '' ) ) === 0 ) {
                throw new Exception( "$label: \"$search\" was not found in block $path." );
              }
            }
            if ( !isset( $op['block'] ) && !isset( $op['markup'] ) && !isset( $op['attrs'] ) && !isset( $op['search'] ) ) {
              throw new Exception( "$label: \"update\" needs block, markup, attrs, or search and replace." );
            }
          } );
          break;

        case 'insert':
          $new = $toBlocks( $op, $label );
          self::place( $root, $new, $path, (string) ( $op['position'] ?? ( $path === '' ? 'end' : 'after' ) ), $label, $require );
          break;

        case 'move':
          $require( $path );
          $to = (string) ( $op['to'] ?? '' );
          $require( $to );
          if ( $to === $path || self::is_inside( $root, $to, $path ) ) {
            throw new Exception( "$label: a block cannot be moved into itself." );
          }
          $moved = null;
          self::at( $root, $path, function ( &$parent, $i ) use ( &$moved ) {
            $moved = self::remove_child( $parent, $i );
          } );
          self::place( $root, [ $moved ], $to, (string) ( $op['position'] ?? 'after' ), $label, $require );
          break;

        case 'delete':
          $require( $path );
          self::at( $root, $path, function ( &$parent, $i ) {
            self::remove_child( $parent, $i );
          } );
          break;

        default:
          throw new Exception( "$label: \"op\" must be update, insert, move or delete." );
      }
    }
    return $root;
  }

  // Whether the block at $path currently sits inside the block with path $ancestor.
  private static function is_inside( array $root, string $path, string $ancestor ): bool {
    $outer = self::find( $root['innerBlocks'], $ancestor );
    return $outer && self::find( $outer['innerBlocks'] ?? [], $path ) !== null;
  }

  private static function place( array &$root, array $blocks, string $anchor, string $position, string $label, callable $require ) {
    if ( $position === 'start' || $position === 'end' ) {
      self::check_parent( $blocks, $root, $label );
      self::insert_children( $root, $position === 'start' ? 0 : count( $root['innerBlocks'] ), $blocks );
      return;
    }
    if ( !in_array( $position, [ 'before', 'after', 'inside' ], true ) ) {
      throw new Exception( "$label: \"position\" must be before, after, inside, start or end." );
    }
    $require( $anchor );
    self::at( $root, $anchor, function ( &$parent, $i ) use ( $blocks, $position, $label ) {
      if ( $position === 'inside' ) {
        $target = &$parent['innerBlocks'][ $i ];
        if ( empty( $target['innerBlocks'] ) && !self::can_nest( $target ) ) {
          throw new Exception( "$label: a " . self::type( $target ) . ' block cannot hold other blocks.' );
        }
        self::check_parent( $blocks, $target, $label );
        self::insert_children( $target, count( $target['innerBlocks'] ), $blocks );
        return;
      }
      self::check_parent( $blocks, $parent, $label );
      self::insert_children( $parent, $position === 'before' ? $i : $i + 1, $blocks );
    } );
  }

  // A block type may only live in some parents (a column in columns, a list item in a list).
  private static function check_parent( array $blocks, array $container, string $label ) {
    $registry = WP_Block_Type_Registry::get_instance();
    foreach ( $blocks as $b ) {
      $type = !empty( $b['blockName'] ) ? $registry->get_registered( $b['blockName'] ) : null;
      if ( $type && !empty( $type->parent ) && !in_array( $container['blockName'] ?? '', (array) $type->parent, true ) ) {
        $allowed = implode( ', ', array_map( function ( $name ) { return preg_replace( '/^core\//', '', $name ); }, (array) $type->parent ) );
        throw new Exception( "$label: a " . self::type( $b ) . " block can only go inside $allowed." );
      }
    }
  }

  // Empty containers have no placeholder to tell us they nest; these core ones do.
  private static function can_nest( array $b ): bool {
    return in_array( $b['blockName'] ?? '', [ 'core/group', 'core/column', 'core/columns', 'core/cover', 'core/buttons',
      'core/list', 'core/quote', 'core/media-text', 'core/details' ], true );
  }
  #endregion
}
