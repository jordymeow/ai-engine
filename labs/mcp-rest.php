<?php

class Meow_MWAI_Labs_MCP_Rest {
  // Bump the suffix when build_schema_from_args() changes so old cached schemas are ignored.
  private $cache_key = 'mwai_mcp_tools_cache_v4';
  private $allowed = [ 'posts', 'pages', 'media' ];

  public function __construct() {
    add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
  }

  public function rest_api_init() {
    add_filter( 'mwai_mcp_tools', [ $this, 'register_rest_tools' ] );
    add_filter( 'mwai_mcp_callback', [ $this, 'handle_call' ], 10, 4 );
  }

  public function register_rest_tools( $prevTools ) {
    $cached = get_transient( $this->cache_key );

    if ( !$cached ) {
      $tools = [];
      $server = rest_get_server();
      $routes = $server->get_routes();

      foreach ( $this->allowed as $resource ) {
        $base = "/wp/v2/{$resource}";
        $item = "{$base}/(?P<id>[\d]+)";

        if ( isset( $routes[ $base ] ) ) {
          foreach ( $routes[ $base ] as $endpoint ) {
            if ( !empty( $endpoint['methods']['GET'] ) ) {
              $tools[ "list_{$resource}" ] = [
                'name' => "list_{$resource}",
                'description' => "List {$resource}",
                'category' => 'Dynamic REST',
                'inputSchema' => $this->build_schema_from_args( $endpoint['args'] ),
                'outputSchema' => $this->build_output_schema(),
                'accessLevel' => 'read',
              ];
              break;
            }
          }
        }

        if ( isset( $routes[ $item ] ) ) {
          foreach ( $routes[ $item ] as $endpoint ) {
            if ( !empty( $endpoint['methods']['GET'] ) ) {
              $tools[ "get_{$resource}" ] = [
                'name' => "get_{$resource}",
                'description' => "Get single {$resource} by ID",
                'category' => 'Dynamic REST',
                'inputSchema' => $this->build_schema_from_args( $endpoint['args'] ),
                'outputSchema' => $this->build_output_schema(),
                'accessLevel' => 'read',
              ];
              break;
            }
          }
        }

        if ( isset( $routes[ $base ] ) ) {
          foreach ( $routes[ $base ] as $endpoint ) {
            if ( !empty( $endpoint['methods']['POST'] ) ) {
              $tools[ "create_{$resource}" ] = [
                'name' => "create_{$resource}",
                'description' => "Create {$resource}",
                'category' => 'Dynamic REST',
                'inputSchema' => $this->build_schema_from_args( $endpoint['args'] ),
                'outputSchema' => $this->build_output_schema(),
                'accessLevel' => 'write',
              ];
              break;
            }
          }
        }

        if ( isset( $routes[ $item ] ) ) {
          foreach ( $routes[ $item ] as $endpoint ) {
            $methods = array_keys( $endpoint['methods'] );
            if ( array_intersect( [ 'POST', 'PUT', 'PATCH' ], $methods ) ) {
              $tools[ "update_{$resource}" ] = [
                'name' => "update_{$resource}",
                'description' => "Update {$resource}",
                'category' => 'Dynamic REST',
                'inputSchema' => $this->build_schema_from_args( $endpoint['args'] ),
                'outputSchema' => $this->build_output_schema(),
                'accessLevel' => 'write',
              ];
              break;
            }
          }
        }

        if ( isset( $routes[ $item ] ) ) {
          foreach ( $routes[ $item ] as $endpoint ) {
            if ( !empty( $endpoint['methods']['DELETE'] ) ) {
              $tools[ "delete_{$resource}" ] = [
                'name' => "delete_{$resource}",
                'description' => "Delete {$resource}",
                'category' => 'Dynamic REST',
                'inputSchema' => $this->build_schema_from_args( $endpoint['args'] ),
                'outputSchema' => $this->build_output_schema(),
                'accessLevel' => 'admin',
              ];
              break;
            }
          }
        }
      }

      set_transient( $this->cache_key, $tools, DAY_IN_SECONDS );
      $cached = $tools;
    }

    return array_merge( array_values( $cached ), $prevTools );
  }

  private function build_schema_from_args( $args ) {
    $schema = [
      'type' => 'object',
      'properties' => [],
      'required' => [],
    ];

    // JSON Schema keys worth forwarding from WordPress REST arg definitions.
    // PHP callbacks (sanitize_callback/validate_callback) and WP-only keys (arg_options,
    // required) are intentionally excluded - clients would choke on them.
    $allowed_keys = [
      'type', 'description', 'enum', 'default', 'format',
      'items', 'properties', 'additionalProperties',
      'minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum', 'multipleOf',
      'minLength', 'maxLength', 'pattern',
      'minItems', 'maxItems', 'uniqueItems',
      'oneOf', 'anyOf', 'allOf',
    ];

    foreach ( $args as $name => $def ) {
      $property = [];
      foreach ( $allowed_keys as $key ) {
        if ( array_key_exists( $key, $def ) ) {
          $property[ $key ] = $def[ $key ];
        }
      }
      if ( !isset( $property['type'] ) ) {
        $property['type'] = 'string';
      }
      if ( !isset( $property['description'] ) ) {
        $property['description'] = '';
      }

      $schema['properties'][ $name ] = $this->normalize_schema_node( $property );

      if ( !empty( $def['required'] ) ) {
        $schema['required'][] = $name;
      }
    }

    return $this->normalize_schema_node( $schema );
  }

  /**
   * JSON Schema requires "properties" to be an object. WP REST arg definitions
   * commonly set it to an empty PHP array (e.g. the "meta" arg on media/posts),
   * which json_encode would serialize as [] and Claude's MCP validator rejects.
   * Walk the schema and cast any empty "properties" / object-typed
   * "additionalProperties" to (object)[] so they serialize as {}.
   */
  private function normalize_schema_node( $node ) {
    if ( !is_array( $node ) ) {
      return $node;
    }

    if ( array_key_exists( 'properties', $node ) ) {
      if ( is_array( $node['properties'] ) ) {
        if ( empty( $node['properties'] ) ) {
          $node['properties'] = (object) [];
        }
        else {
          foreach ( $node['properties'] as $key => $child ) {
            $node['properties'][ $key ] = $this->normalize_schema_node( $child );
          }
        }
      }
    }

    if ( isset( $node['items'] ) ) {
      $node['items'] = $this->normalize_schema_node( $node['items'] );
    }

    if ( isset( $node['additionalProperties'] ) && is_array( $node['additionalProperties'] ) ) {
      $node['additionalProperties'] = empty( $node['additionalProperties'] )
        ? (object) []
        : $this->normalize_schema_node( $node['additionalProperties'] );
    }

    foreach ( [ 'oneOf', 'anyOf', 'allOf' ] as $combinator ) {
      if ( isset( $node[ $combinator ] ) && is_array( $node[ $combinator ] ) ) {
        foreach ( $node[ $combinator ] as $i => $child ) {
          $node[ $combinator ][ $i ] = $this->normalize_schema_node( $child );
        }
      }
    }

    // Some clients (notably Google Gemini) only allow "enum" on string-typed
    // properties and reject the request with a 400 otherwise. WordPress REST
    // sometimes defines integer enums, e.g. Jetpack's publicize "status" => [0, 1].
    // Drop the enum when the type is not a string; the value still works, it just
    // loses the schema-level enumeration. Coercing to string instead would risk
    // breaking the endpoint's own integer validation when the tool is called.
    if ( isset( $node['enum'] ) ) {
      $type = $node['type'] ?? null;
      $isStringType = $type === 'string'
        || ( is_array( $type ) && in_array( 'string', $type, true ) )
        || ( $type === null && count( array_filter( (array) $node['enum'], function ( $v ) {
          return !is_string( $v );
        } ) ) === 0 );
      if ( !$isStringType ) {
        unset( $node['enum'] );
      }
    }

    return $node;
  }

  private function build_output_schema() {
    return [
      'type' => 'object',
      'properties' => [
        'content' => [
          'type' => 'array',
          'items' => [
            'type' => 'object',
            'properties' => [
              'type' => [
                'type' => 'string',
                'description' => 'Block type, e.g. text or image',
              ],
              'text' => [
                'type' => 'string',
                'description' => 'Human-readable content',
              ],
            ],
            'required' => [ 'type', 'text' ],
          ],
        ],
      ],
      'required' => [ 'content' ],
    ];
  }

  public function handle_call( $existing, $tool, $args, $id ) {
    if ( !empty( $existing ) ) {
      return $existing;
    }

    $tools = get_transient( $this->cache_key );
    if ( !isset( $tools[ $tool ] ) ) {
      return $existing;
    }

    // Security check is already done in the MCP auth layer
    // If we reach here, the user is authorized to use MCP

    list( $action, $resource ) = explode( '_', $tool, 2 );
    $path = "/wp/v2/{$resource}";
    $method = 'GET';

    if ( in_array( $action, [ 'get', 'update', 'delete' ], true ) ) {
      if ( empty( $args['id'] ) ) {
        return [
          'jsonrpc' => '2.0',
          'id' => $id,
          'error' => [
            'code' => -32602,
            'message' => 'Missing parameter: id',
          ],
        ];
      }
      $path .= '/' . intval( $args['id'] );
    }

    switch ( $action ) {
      case 'create':
      case 'update':
        $method = 'POST';
        break;
      case 'delete':
        $method = 'DELETE';
        break;
      default:
        $method = 'GET';
        break;
    }

    $request = new WP_REST_Request( $method, $path );

    if ( $method === 'GET' ) {
      foreach ( $args as $key => $value ) {
        $request->set_param( $key, $value );
      }
    }
    else {
      $request->set_body_params( $args );
    }

    $response = rest_do_request( $request );

    if ( is_wp_error( $response ) || $response->get_status() >= 400 ) {
      $error_obj = is_wp_error( $response ) ? $response : $response->as_error();

      // Return error in old format for backward compatibility
      // The execute_tool method will detect this and not re-wrap it
      return [
        'jsonrpc' => '2.0',
        'id' => $id,
        'error' => [
          'code' => (int) ( $error_obj->get_error_code() ?: $response->get_status() ),
          'message' => $error_obj->get_error_message(),
          'data' => $error_obj->get_error_data() ?: null,
        ],
      ];
    }

    $data = $response->get_data();

    // Return just the data - execute_tool will wrap it properly
    return $data;
  }
}
