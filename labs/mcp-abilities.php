<?php

/**
 * Exposes abilities from the WordPress Abilities API (WP 6.9+) as MCP tools.
 *
 * An ability is included when it opts into public exposure: `meta.mcp.public`
 * (the MCP Adapter convention) or `meta.show_in_rest`. Plugins like Easy Digital
 * Downloads only set `show_in_rest`, so checking `mcp.public` alone hides them.
 * An explicit `meta.mcp.public = false` always wins.
 *
 * Permissions stay with the ability: WP_Ability::execute() runs its own
 * permission_callback against the MCP user.
 */
class Meow_MWAI_Labs_MCP_Abilities {
  /** MCP tool name → ability name. */
  private $tool_map = [];

  /** Tool names whose ability takes a non-object input, wrapped as { input }. */
  private $wrapped = [];

  public function __construct() {
    if ( !function_exists( 'wp_get_abilities' ) ) {
      return;
    }
    add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
  }

  public function rest_api_init() {
    // Late, so every other module's tools are known before an ability claims
    // a name, and so abilities only answer calls no other module handled.
    add_filter( 'mwai_mcp_tools', [ $this, 'register_tools' ], 99 );
    add_filter( 'mwai_mcp_callback', [ $this, 'handle_call' ], 99, 4 );
  }

  /** The abilities that opted into public exposure, after `mwai_mcp_abilities`. */
  public static function exposed(): array {
    if ( !function_exists( 'wp_get_abilities' ) ) {
      return [];
    }
    $abilities = array_filter( wp_get_abilities(), function ( $ability ) {
      $meta = $ability->get_meta();
      $mcp_public = $meta['mcp']['public'] ?? null;
      if ( $mcp_public === false ) {
        return false;
      }
      return $mcp_public === true || !empty( $meta['show_in_rest'] );
    } );
    $abilities = apply_filters( 'mwai_mcp_abilities', $abilities );
    return is_array( $abilities ) ? $abilities : [];
  }

  /**
   * Category label → number of exposed abilities, for the Settings screen.
   * False when this WordPress has no Abilities API.
   */
  public static function summary() {
    if ( !function_exists( 'wp_get_abilities' ) ) {
      return false;
    }
    $summary = [];
    foreach ( self::exposed() as $ability ) {
      $label = self::category_label( $ability );
      $summary[ $label ] = ( $summary[ $label ] ?? 0 ) + 1;
    }
    arsort( $summary );
    return $summary;
  }

  /**
   * The ability's category label, used to group tools in MCP Tools & Abilities and
   * Workspace. Core's own categories ("Site", "User") mean nothing next to
   * plugin names, so core abilities share one group.
   */
  private static function category_label( $ability ): string {
    if ( strpos( $ability->get_name(), 'core/' ) === 0 ) {
      return 'WordPress Abilities';
    }
    $slug = $ability->get_category();
    $category = function_exists( 'wp_get_ability_category' ) ? wp_get_ability_category( $slug ) : null;
    return $category ? $category->get_label() : $slug;
  }

  public function register_tools( $prev_tools ) {
    $taken = array_column( $prev_tools, 'name' );
    foreach ( self::exposed() as $ability ) {
      $tool_name = $this->tool_name( $ability->get_name() );
      if ( in_array( $tool_name, $taken, true ) ) {
        // Once a day per ability: a lasting clash would otherwise log on every tools/list.
        $warned = 'mwai_mcp_ability_clash_' . md5( $ability->get_name() );
        if ( !get_transient( $warned ) ) {
          error_log( '[AI Engine MCP] ⚠️ Ability "' . $ability->get_name() . '" skipped: the tool name "' . $tool_name . '" is already used.' );
          set_transient( $warned, 1, DAY_IN_SECONDS );
        }
        continue;
      }
      $taken[] = $tool_name;
      $this->tool_map[ $tool_name ] = $ability->get_name();

      $schema = $ability->get_input_schema();
      if ( empty( $schema ) ) {
        $schema = [ 'type' => 'object', 'properties' => (object) [] ];
      }
      elseif ( ( $schema['type'] ?? 'object' ) !== 'object' ) {
        $this->wrapped[ $tool_name ] = true;
        $schema = [
          'type' => 'object',
          'properties' => [ 'input' => $schema ],
          'required' => [ 'input' ],
        ];
      }
      $schema = self::to_json_schema( $schema );

      $hints = $ability->get_meta()['annotations'] ?? [];
      $annotations = [ 'title' => $ability->get_label() ];
      foreach ( [ 'readonly' => 'readOnlyHint', 'destructive' => 'destructiveHint', 'idempotent' => 'idempotentHint' ] as $from => $to ) {
        if ( isset( $hints[ $from ] ) ) {
          $annotations[ $to ] = (bool) $hints[ $from ];
        }
      }

      $prev_tools[] = [
        'name' => $tool_name,
        'description' => $ability->get_description() ?: $ability->get_label(),
        'category' => self::category_label( $ability ),
        'inputSchema' => $schema,
        'annotations' => $annotations,
        'accessLevel' => $this->access_level( $hints ),
        // Lets MCP Tools & Abilities label it; MCP clients never see these keys.
        'source' => 'ability',
        'ability' => $ability->get_name(),
      ];
    }
    return $prev_tools;
  }

  public function handle_call( $result, $tool, $args, $id ) {
    if ( $result !== null ) {
      return $result;
    }
    if ( empty( $this->tool_map ) ) {
      $this->register_tools( [] );
    }
    if ( !isset( $this->tool_map[ $tool ] ) ) {
      return $result;
    }
    $ability = wp_get_ability( $this->tool_map[ $tool ] );
    if ( !$ability ) {
      throw new Exception( "The ability behind \"{$tool}\" is no longer registered." );
    }

    $args = is_array( $args ) ? $args : [];
    if ( isset( $this->wrapped[ $tool ] ) ) {
      $input = $args['input'] ?? null;
    }
    else {
      // Abilities without an input schema expect null, not an empty array.
      $input = empty( $args ) && empty( $ability->get_input_schema() ) ? null : $args;
    }

    $output = $ability->execute( $input );
    if ( is_wp_error( $output ) ) {
      $message = $output->get_error_message();
      $denied = $output->get_error_code() === 'ability_invalid_permissions';
      // An administrator refused by an ability is almost always a plugin keeping
      // this action off in its own settings (EDD: Downloads → Tools → AI), not a
      // missing role. Say so, or the model can only report "permission error".
      if ( $denied && current_user_can( 'manage_options' ) ) {
        $message .= ' Your account is an administrator, so ' . self::category_label( $ability )
          . ' probably keeps this action switched off in its own settings.';
      }
      throw new Exception( $message, $denied ? Meow_MWAI_Labs_MCP::DENIED_CODE : 0 );
    }
    if ( is_string( $output ) ) {
      return $output;
    }
    // Wrapped here, not left to format_tool_result(): it takes any array with a
    // `content` key as a ready MCP result, and an ability returning a post has one.
    $json = wp_json_encode( $output, JSON_PRETTY_PRINT );
    $result = [ 'content' => [ [ 'type' => 'text', 'text' => $json ] ] ];
    if ( is_array( $output ) ) {
      $result['data'] = $output;
    }
    return $result;
  }

  /**
   * Abilities use WordPress REST schemas, which allow `required: true` on a
   * property (draft 3) and WP-only keys. OpenAI, Anthropic and Gemini reject
   * the whole request over one such schema (EDD's search tools have it), so
   * lift property-level `required` into the parent list and drop WP-only keys.
   */
  private static function to_json_schema( $schema ) {
    if ( !is_array( $schema ) ) {
      return $schema;
    }
    unset( $schema['context'], $schema['arg_options'], $schema['sanitize_callback'], $schema['validate_callback'], $schema['readonly'] );
    if ( isset( $schema['required'] ) && !is_array( $schema['required'] ) ) {
      unset( $schema['required'] );
    }
    if ( isset( $schema['properties'] ) && is_array( $schema['properties'] ) ) {
      $required = $schema['required'] ?? [];
      foreach ( $schema['properties'] as $key => $property ) {
        if ( is_array( $property ) && isset( $property['required'] ) && is_bool( $property['required'] ) ) {
          if ( $property['required'] ) {
            $required[] = $key;
          }
          unset( $property['required'] );
        }
        $schema['properties'][ $key ] = self::to_json_schema( $property );
      }
      if ( !empty( $required ) ) {
        $schema['required'] = array_values( array_unique( $required ) );
      }
    }
    foreach ( [ 'items', 'additionalProperties' ] as $key ) {
      if ( isset( $schema[ $key ] ) && is_array( $schema[ $key ] ) ) {
        $schema[ $key ] = self::to_json_schema( $schema[ $key ] );
      }
    }
    foreach ( [ 'anyOf', 'oneOf', 'allOf' ] as $key ) {
      if ( isset( $schema[ $key ] ) && is_array( $schema[ $key ] ) ) {
        $schema[ $key ] = array_map( [ self::class, 'to_json_schema' ], $schema[ $key ] );
      }
    }
    return $schema;
  }

  /** MCP clients only accept [a-zA-Z0-9_-]{1,64}: "edd/orders-read" → "edd_orders-read". */
  private function tool_name( string $ability_name ): string {
    $name = preg_replace( '/[^a-zA-Z0-9_-]/', '_', $ability_name );
    if ( strlen( $name ) <= 64 ) {
      return $name;
    }
    // A hash suffix keeps two long names that share their first 64 characters apart.
    return substr( $name, 0, 57 ) . '_' . substr( md5( $ability_name ), 0, 6 );
  }

  private function access_level( array $hints ): string {
    if ( !empty( $hints['readonly'] ) ) {
      return 'read';
    }
    // Unknown hints are treated as destructive: only an explicit "not destructive" is 'write'.
    return ( $hints['destructive'] ?? null ) === false ? 'write' : 'admin';
  }
}
