<?php

// Advanced Custom Fields for MCP. Writing ACF values as plain post meta "works" until ACF looks
// for the field reference it keeps next to each value (_name => field key): without it, the
// value shows empty in the editor and get_field() can miss it. These tools go through ACF's API.
// Listed only when ACF is active. Undo uses the "acf" kind (labs/mcp-undo.php).
class Meow_MWAI_Labs_MCP_Acf {
  private const CHOICE_TYPES = [ 'select', 'radio', 'checkbox', 'button_group' ];

  public function __construct() {
    add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
  }

  public function rest_api_init() {
    if ( !function_exists( 'acf_get_field_groups' ) ) {
      return;
    }
    add_filter( 'mwai_mcp_tools', [ $this, 'register_tools' ] );
    add_filter( 'mwai_mcp_callback', [ $this, 'handle_call' ], 10, 4 );
    add_filter( 'mwai_mcp_undo_targets', [ $this, 'undo_targets' ], 10, 3 );
    add_filter( 'mwai_mcp_undo_kinds', [ $this, 'undo_kinds' ] );
  }

  private function tools(): array {
    $target = [
      'ID' => [ 'type' => 'integer', 'description' => 'A post, page or custom post ID.' ],
      'term_id' => [ 'type' => 'integer', 'description' => 'Or a term ID (with taxonomy).' ],
      'taxonomy' => [ 'type' => 'string', 'description' => 'The term\'s taxonomy.' ],
    ];
    return [
      'acf_get_fields' => [
        'name' => 'acf_get_fields',
        'description' => 'List the Advanced Custom Fields (ACF) of a post or term: every field its field groups give it, even empty ones, with name, label, type, current value (raw: an image or a post is its ID), and choices for selects. Read this before acf_update_fields.',
        'inputSchema' => [ 'type' => 'object', 'properties' => $target ],
        'accessLevel' => 'read',
      ],
      'acf_update_fields' => [
        'name' => 'acf_update_fields',
        'description' => 'Set ACF field values of a post or term through ACF, by field name: "fields" is {"name": value}. Use raw values as acf_get_fields shows them (IDs for images, files and posts; one of the choices for selects; arrays for checkboxes; an object of sub-field names for a group, a list of them for a repeater). null clears a field. Can be undone with mcp_undo_change.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => $target + [ 'fields' => [ 'type' => 'object', 'additionalProperties' => true, 'description' => 'Field names and their new values.' ] ],
          'required' => [ 'fields' ],
        ],
        'accessLevel' => 'write',
      ],
    ];
  }

  public function register_tools( array $prev ): array {
    foreach ( $this->tools() as $tool ) {
      $tool['annotations'] = [ 'readOnlyHint' => $tool['accessLevel'] === 'read', 'destructiveHint' => false, 'openWorldHint' => false ];
      $prev[] = $tool;
    }
    return $prev;
  }

  // [ ACF's id for the object ("123" or "term_5"), the field groups' screen arguments, label ].
  private static function object( array $a ): array {
    if ( !empty( $a['term_id'] ) ) {
      $term = get_term( (int) $a['term_id'], sanitize_key( (string) ( $a['taxonomy'] ?? '' ) ) );
      if ( !$term || is_wp_error( $term ) ) {
        throw new Exception( 'Term #' . (int) $a['term_id'] . ' was not found (pass its taxonomy).' );
      }
      if ( !current_user_can( 'edit_term', $term->term_id ) ) {
        throw new Exception( 'You are not allowed to edit this term.', Meow_MWAI_Labs_MCP::DENIED_CODE );
      }
      return [ 'term_' . $term->term_id, [ 'taxonomy' => $term->taxonomy, 'term_id' => $term->term_id ] ];
    }
    $id = (int) ( $a['ID'] ?? $a['post_id'] ?? $a['id'] ?? 0 );
    $post = $id ? get_post( $id ) : null;
    if ( !$post ) {
      throw new Exception( 'Pass the ID of a post (or term_id and taxonomy).' );
    }
    if ( !current_user_can( 'edit_post', $id ) ) {
      throw new Exception( "You are not allowed to edit post #{$id}.", Meow_MWAI_Labs_MCP::DENIED_CODE );
    }
    return [ $id, [ 'post_id' => $id, 'post_type' => $post->post_type ] ];
  }

  // Every field the object's field groups give it, keyed by name.
  private static function fields_of( array $screen ): array {
    $out = [];
    foreach ( acf_get_field_groups( $screen ) as $group ) {
      foreach ( (array) acf_get_fields( $group ) as $field ) {
        if ( !empty( $field['name'] ) ) {
          $out[ $field['name'] ] = $field + [ 'group_title' => $group['title'] ];
        }
      }
    }
    return $out;
  }

  private static function describe( array $field, $acf_id ): array {
    $row = [ 'name' => $field['name'], 'label' => $field['label'], 'type' => $field['type'], 'group' => $field['group_title'],
      'value' => get_field( $field['key'], $acf_id, false ) ];
    if ( in_array( $field['type'], self::CHOICE_TYPES, true ) && !empty( $field['choices'] ) ) {
      $row['choices'] = array_keys( $field['choices'] );
    }
    if ( !empty( $field['sub_fields'] ) ) {
      $row['sub_fields'] = array_map( function ( $sub ) { return $sub['name'] . ' (' . $sub['type'] . ')'; }, $field['sub_fields'] );
    }
    if ( !empty( $field['required'] ) ) {
      $row['required'] = true;
    }
    return $row;
  }

  public function handle_call( $prev, string $tool, array $args, $id ) {
    if ( !empty( $prev ) || !isset( $this->tools()[ $tool ] ) ) {
      return $prev;
    }
    [ $acf_id, $screen ] = self::object( $args );
    $fields = self::fields_of( $screen );
    if ( !$fields ) {
      throw new Exception( 'No ACF field group applies to this ' . ( isset( $screen['term_id'] ) ? 'term' : 'post' ) . '.' );
    }
    if ( $tool === 'acf_get_fields' ) {
      return [ 'fields' => array_values( array_map( function ( $f ) use ( $acf_id ) { return self::describe( $f, $acf_id ); }, $fields ) ) ];
    }
    $changes = is_string( $args['fields'] ?? null ) ? json_decode( $args['fields'], true ) : ( $args['fields'] ?? [] );
    if ( !is_array( $changes ) || !$changes ) {
      throw new Exception( '"fields" must be an object of field names and values.' );
    }
    // Everything is checked first, so a bad name or choice changes nothing.
    foreach ( $changes as $name => $value ) {
      $field = $fields[ $name ] ?? null;
      if ( !$field ) {
        throw new Exception( "No ACF field \"$name\" here. Fields: " . implode( ', ', array_keys( $fields ) ) . '. Nothing was changed.' );
      }
      if ( $value !== null && in_array( $field['type'], [ 'select', 'radio', 'button_group' ], true ) && !empty( $field['choices'] ) ) {
        foreach ( (array) $value as $choice ) {
          if ( !array_key_exists( $choice, $field['choices'] ) ) {
            throw new Exception( "\"$choice\" is not a choice of \"$name\" (" . implode( ', ', array_keys( $field['choices'] ) ) . '). Nothing was changed.' );
          }
        }
      }
    }
    foreach ( $changes as $name => $value ) {
      self::write( $fields[ $name ]['key'], $value, $acf_id );
    }
    $fresh = self::fields_of( $screen );
    return [ 'updated' => array_values( array_map( function ( $name ) use ( $fresh, $acf_id ) { return self::describe( $fresh[ $name ], $acf_id ); }, array_keys( $changes ) ) ) ];
  }

  private static function write( string $key, $value, $acf_id ) {
    if ( $value === null ) {
      delete_field( $key, $acf_id );
      return;
    }
    // update_field() ends in update_metadata(), which unslashes: a "\" in the text was lost.
    if ( !update_field( $key, wp_slash( $value ), $acf_id ) && get_field( $key, $acf_id, false ) != $value ) {
      throw new Exception( "ACF did not save the field $key." );
    }
  }

  #region Undo (labs/mcp-undo.php)
  public function undo_targets( $targets, string $tool, array $a ) {
    if ( $tool !== 'acf_update_fields' ) {
      return $targets;
    }
    try {
      [ $acf_id, $screen ] = self::object( $a );
      $fields = self::fields_of( $screen );
      $changes = is_string( $a['fields'] ?? null ) ? json_decode( $a['fields'], true ) : ( $a['fields'] ?? [] );
      $keys = [];
      foreach ( array_keys( (array) $changes ) as $name ) {
        if ( isset( $fields[ $name ] ) ) {
          $keys[] = $fields[ $name ]['key'];
        }
      }
      return $keys ? [ [ 'kind' => 'acf', 'acf_id' => (string) $acf_id, 'keys' => $keys ] ] : [];
    }
    catch ( Throwable $e ) {
      return null;
    }
  }

  public function undo_kinds( array $kinds ): array {
    $kinds['acf'] = [
      'recreates' => true,
      'read' => function ( $t ) {
        $out = [];
        foreach ( $t['keys'] as $key ) {
          $out[ $key ] = get_field( $key, $t['acf_id'], false );
        }
        return $out;
      },
      'write' => function ( $t, $state ) {
        foreach ( (array) $state as $key => $value ) {
          self::write( $key, $value === '' ? null : $value, $t['acf_id'] );
        }
      },
      'can' => function ( $t ) {
        return strpos( $t['acf_id'], 'term_' ) === 0
          ? current_user_can( 'edit_term', (int) substr( $t['acf_id'], 5 ) )
          : current_user_can( 'edit_post', (int) $t['acf_id'] );
      },
      'title' => function ( $t ) {
        if ( strpos( $t['acf_id'], 'term_' ) === 0 ) {
          $term = get_term( (int) substr( $t['acf_id'], 5 ) );
          return $term && !is_wp_error( $term ) ? $term->name : $t['acf_id'];
        }
        return Meow_MWAI_Labs_MCP_Undo::post_title( (int) $t['acf_id'] );
      },
    ];
    return $kinds;
  }
  #endregion
}
