<?php

class Meow_MWAI_Labs_MCP_Rest {
  private $cache_key = 'mwai_mcp_tools_cache';
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
            if ( ! empty( $endpoint['methods']['GET'] ) ) {
              $tools[ "list_{$resource}" ] = [
                'name' => "list_{$resource}",
                'description' => "List {$resource}",
                'category' => 'Dynamic REST',
                'inputSchema' => $this->build_schema_from_args( $endpoint['args'] ),
                'outputSchema' => $this->build_output_schema(),
              ];
              break;
            }
          }
        }

        if ( isset( $routes[ $item ] ) ) {
          foreach ( $routes[ $item ] as $endpoint ) {
            if ( ! empty( $endpoint['methods']['GET'] ) ) {
              $tools[ "get_{$resource}" ] = [
                'name' => "get_{$resource}",
                'description' => "Get single {$resource} by ID",
                'category' => 'Dynamic REST',
                'inputSchema' => $this->build_schema_from_args( $endpoint['args'] ),
                'outputSchema' => $this->build_output_schema(),
              ];
              break;
            }
          }
        }

        if ( isset( $routes[ $base ] ) ) {
          foreach ( $routes[ $base ] as $endpoint ) {
            if ( ! empty( $endpoint['methods']['POST'] ) ) {
              $tools[ "create_{$resource}" ] = [
                'name' => "create_{$resource}",
                'description' => "Create {$resource}",
                'category' => 'Dynamic REST',
                'inputSchema' => $this->build_schema_from_args( $endpoint['args'] ),
                'outputSchema' => $this->build_output_schema(),
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
              ];
              break;
            }
          }
        }

        if ( isset( $routes[ $item ] ) ) {
          foreach ( $routes[ $item ] as $endpoint ) {
            if ( ! empty( $endpoint['methods']['DELETE'] ) ) {
              $tools[ "delete_{$resource}" ] = [
                'name' => "delete_{$resource}",
                'description' => "Delete {$resource}",
                'category' => 'Dynamic REST',
                'inputSchema' => $this->build_schema_from_args( $endpoint['args'] ),
                'outputSchema' => $this->build_output_schema(),
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

    foreach ( $args as $name => $def ) {
      $schema['properties'][ $name ] = [
        'type' => $def['type'] ?? 'string',
        'description' => $def['description'] ?? '',
      ];

      if ( ! empty( $def['required'] ) ) {
        $schema['required'][] = $name;
      }
    }

    return $schema;
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
    if ( ! isset( $tools[ $tool ] ) ) {
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
