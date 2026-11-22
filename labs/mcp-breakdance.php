<?php

// Breakdance (and Oxygen 6, same code base) bring their own agent tools through the WordPress
// Abilities API, and labs/mcp-abilities.php already turns them into MCP tools. This class adds
// what that bridge cannot know, and registers no tool of its own:
//
// 1. Instructions. Breakdance gives its ground rules ("call get-instructions first") to the MCP
//    Adapter only. They are appended to ours, with the names its tools have here.
// 2. A guard. On a page Breakdance renders, post_content is not what visitors see: our content
//    tools reported success and changed nothing, or broke the saved layout through its meta.
// 3. Undo, for its tools that rewrite one page, restored through Breakdance's own save.
//
// Found and specified by a user running both (HS 3515976198, 2026-11-16). Every call into
// Breakdance is guarded: without it, or after it renames a function, that part does nothing.
class Meow_MWAI_Labs_MCP_Breakdance {
  // Claude cuts a server's instructions at about 4 KB. Ours come first, so the vendor's rules
  // get what is left, cut at the end of a sentence.
  private const BUDGET = 3800;

  // Breakdance tools that rewrite the tree of one page (they all take post_id).
  private const TREE_TOOLS = [ 'edit-post', 'html-to-page', 'set-element-interactions', 'set-element-animations',
    'set-element-form', 'set-element-conditions', 'set-element-variable-overrides' ];

  public function __construct() {
    add_filter( 'mwai_mcp_instructions', [ $this, 'instructions' ] );
    // Before the tools themselves (priority 10), so a refused call never runs.
    add_filter( 'mwai_mcp_callback', [ $this, 'guard' ], 5, 3 );
    add_filter( 'mwai_mcp_undo_targets', [ $this, 'undo_targets' ], 10, 3 );
    add_filter( 'mwai_mcp_undo_kinds', [ $this, 'undo_kinds' ] );
  }

  #region Breakdance
  private function active(): bool {
    return function_exists( '\Breakdance\Data\get_meta' );
  }

  // "breakdance" or "oxygen", the prefix of its tools. Null when its agent tools are off.
  private function prefix(): ?string {
    if ( !$this->active() || !function_exists( 'breakdance_mcp_ability_namespace' ) ) {
      return null;
    }
    $ns = (string) breakdance_mcp_ability_namespace();
    return $ns !== '' ? $ns : null;
  }

  private function label(): string {
    return defined( 'BREAKDANCE_MODE' ) && BREAKDANCE_MODE === 'oxygen' ? 'Oxygen' : 'Breakdance';
  }

  // The post meta a page is kept in: _breakdance_data, or its Oxygen equivalent.
  private function data_key(): string {
    $bdox = '\Breakdance\BreakdanceOxygen\Strings\__bdox';
    $prefix = function_exists( $bdox ) ? call_user_func( $bdox, '_meta_prefix' ) : null;
    return ( is_string( $prefix ) && $prefix !== '' ? $prefix : '_breakdance_' ) . 'data';
  }

  // The page as Breakdance stores it (a JSON string), or null when it has none.
  private function read_tree( int $post_id ): ?string {
    if ( !$post_id || !$this->active() ) {
      return null;
    }
    $json = call_user_func( '\Breakdance\Data\get_meta', $post_id, $this->data_key(), 'tree_json_string' );
    return is_string( $json ) && $json !== '' ? $json : null;
  }

  private function is_builder_page( int $post_id ): bool {
    $tree = json_decode( (string) $this->read_tree( $post_id ), true );
    return is_array( $tree ) && !empty( $tree['root']['children'] );
  }

  // The same three steps as Breakdance's save_document(), which also takes eight arguments we
  // have no business sending: store the tree, touch the post (its revision), rebuild the CSS.
  private function write_tree( int $post_id, ?string $json ): void {
    if ( $json === null ) {
      delete_post_meta( $post_id, $this->data_key() );
      clean_post_cache( $post_id );
      return;
    }
    if ( !function_exists( '\Breakdance\Data\set_meta' ) ) {
      throw new Exception( $this->label() . ' is not active, so this page cannot be restored.' );
    }
    call_user_func( '\Breakdance\Data\set_meta', $post_id, $this->data_key(), [ 'tree_json_string' => $json ] );
    wp_update_post( [ 'ID' => $post_id ] );
    if ( function_exists( '\Breakdance\Render\generateCacheForPost' ) ) {
      call_user_func( '\Breakdance\Render\generateCacheForPost', $post_id );
    }
  }
  #endregion

  #region Instructions
  public function instructions( $instructions ) {
    $instructions = is_string( $instructions ) ? trim( $instructions ) : '';
    if ( !$this->active() ) {
      return $instructions;
    }
    $builder = $this->label();
    $prefix = $this->prefix();
    if ( !$prefix ) {
      return $instructions . ' ' . sprintf( 'Pages built with %1$s are shown from its layout, not from post_content, and the agent tools of %1$s are off on this site: the content of those pages cannot be edited from here (title, slug and status can). Say so instead of trying another tool.', $builder );
    }
    $ours = sprintf(
      '%1$s is installed and its tools are here with the "%2$s_" prefix: where its guidance says get-instructions or edit-post, call %2$s_get-instructions or %2$s_edit-post, and so on. A page built with %1$s is shown from its layout, not from post_content: read it with %2$s_get-post-tree and change it only with the %2$s_ tools (title, slug and status stay editable with wp_update_post).',
      $builder,
      $prefix
    );
    $out = $instructions . ' ' . $ours;
    $rules = function_exists( 'breakdance_mcp_server_description' ) ? (string) breakdance_mcp_server_description() : '';
    $rules = trim( (string) preg_replace( '/\s+/', ' ', $rules ) );
    if ( $rules === '' ) {
      return $out;
    }
    $budget = max( 0, (int) apply_filters( 'mwai_mcp_breakdance_instructions_budget', self::BUDGET ) );
    $room = $budget - strlen( $out ) - 1;
    if ( !$budget || strlen( $rules ) <= $room ) {
      return $out . ' ' . $rules;
    }
    $note = sprintf( '(Shortened to fit; the rest is in %s_get-instructions.)', $prefix );
    $kept = '';
    foreach ( (array) preg_split( '/(?<=[.!?])\s+/', $rules ) as $sentence ) {
      if ( strlen( $kept ) + strlen( $sentence ) + strlen( $note ) + 2 > $room ) {
        break;
      }
      $kept = trim( $kept . ' ' . $sentence );
    }
    return $kept !== '' ? $out . ' ' . $kept . ' ' . $note : $out;
  }
  #endregion

  #region Guard
  private function post_id_of( array $a ): int {
    foreach ( [ 'ID', 'post_id', 'id' ] as $key ) {
      if ( isset( $a[$key] ) && is_scalar( $a[$key] ) && $a[$key] !== '' ) {
        return (int) $a[$key];
      }
    }
    return 0;
  }

  // An object argument, which some clients send as a JSON string.
  private function object_arg( $value ): array {
    $value = is_string( $value ) ? json_decode( $value, true ) : $value;
    return is_array( $value ) ? $value : [];
  }

  // What this call would do to a builder page, or null when it is harmless there.
  private function refusal( string $tool, array $a ): ?string {
    $key = $this->data_key();
    $no_effect = 'its visible content is the builder\'s layout, not post_content, so this would change nothing on the page';
    $raw_meta = 'the "' . $key . '" custom field is the builder\'s saved layout, and writing it directly can break the page';
    switch ( $tool ) {
      case 'wp_write_blocks':
      case 'wp_edit_blocks':
      case 'wp_insert_block_pattern':
      case 'wp_edit_shortcodes':
        return empty( $a['dry_run'] ) ? $no_effect : null;
      case 'wp_alter_post':
        return ( $a['field'] ?? 'post_content' ) === 'post_content' ? $no_effect : null;
      case 'wp_update_post':
        if ( array_key_exists( $key, $this->object_arg( $a['meta_input'] ?? null ) ) ) {
          return $raw_meta;
        }
        return array_key_exists( 'post_content', $this->object_arg( $a['fields'] ?? null ) ) || array_key_exists( 'post_content', $a ) ? $no_effect : null;
      case 'wp_update_post_meta':
      case 'wp_delete_post_meta':
        $named = ( $a['key'] ?? null ) === $key || array_key_exists( $key, $this->object_arg( $a['meta'] ?? null ) );
        return $named ? $raw_meta : null;
    }
    return null;
  }

  // Never answers a call: it throws, which the MCP server reports to the model as a failed
  // tool, or passes $prev on untouched.
  public function guard( $prev, $tool, $args ) {
    if ( $prev !== null || !is_string( $tool ) || !is_array( $args ) || strpos( $tool, 'wp_' ) !== 0 || !$this->active() ) {
      return $prev;
    }
    $reason = $this->refusal( $tool, $args );
    $post_id = $reason === null ? 0 : $this->post_id_of( $args );
    if ( !$post_id || !$this->is_builder_page( $post_id ) ) {
      return $prev;
    }
    $builder = $this->label();
    $prefix = $this->prefix();
    $next = $prefix
      ? sprintf( 'Read the page with %1$s_get-post-tree and edit it with %1$s_edit-post (call %1$s_get-instructions first if you have not).', $prefix )
      : sprintf( 'The agent tools of %1$s are off on this site, so the content of this page cannot be edited from here; its title, slug and status still can. Tell the user instead of trying another tool.', $builder );
    throw new Exception( sprintf( 'Post #%1$d is built with %2$s: %3$s. Nothing was changed. %4$s', $post_id, $builder, $reason, $next ) );
  }
  #endregion

  #region Undo (labs/mcp-undo.php)
  public function undo_targets( $targets, $tool, $a ) {
    $prefix = $this->prefix();
    if ( !$prefix || !is_string( $tool ) || !is_array( $a ) || strpos( $tool, $prefix . '_' ) !== 0 ) {
      return $targets;
    }
    if ( !in_array( substr( $tool, strlen( $prefix ) + 1 ), self::TREE_TOOLS, true ) ) {
      return $targets;
    }
    $post_id = $this->post_id_of( $a );
    return $post_id ? [ [ 'kind' => 'breakdance', 'id' => $post_id ] ] : $targets;
  }

  public function undo_kinds( $kinds ) {
    if ( !is_array( $kinds ) ) {
      return $kinds;
    }
    $kinds['breakdance'] = [
      // A page that had no builder data gets it back by a plain write, and the other way round.
      'recreates' => true,
      'read' => function ( $t ) { return $this->read_tree( (int) $t['id'] ); },
      'write' => function ( $t, $state ) {
        if ( $state !== null && !is_string( $state ) ) {
          throw new Exception( 'The previous version of this page could not be read.' );
        }
        $this->write_tree( (int) $t['id'], $state );
      },
      // Breakdance's own tools ask for manage_options: putting a page back asks for no less.
      'can' => function ( $t ) { return current_user_can( 'manage_options' ) && current_user_can( 'edit_post', (int) $t['id'] ); },
      'title' => function ( $t ) { return Meow_MWAI_Labs_MCP_Undo::post_title( (int) $t['id'] ); },
    ];
    return $kinds;
  }
  #endregion
}
