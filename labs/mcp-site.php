<?php

// Site structure for MCP: menus, Additional CSS, theme mods and global styles. Part of the core
// set, for users with edit_theme_options (edit_css for CSS), and every write can be undone
// (labs/mcp-undo.php: the menu, css, theme_mod and global_styles kinds below).
//
// Block themes keep their menus as wp_navigation posts made of blocks: wp_get_menus lists them,
// and wp_get_blocks / wp_edit_blocks edit them like any post.
class Meow_MWAI_Labs_MCP_Site {
  // Theme mods with a tool of their own, or WordPress bookkeeping: never written from here.
  private const RESERVED_MODS = [ 'nav_menu_locations', 'custom_css_post_id', 'sidebars_widgets' ];
  private const ITEM_FIELDS = [ 'title', 'url', 'type', 'object', 'object_id', 'parent', 'position', 'target', 'classes', 'attr_title', 'description', 'xfn' ];

  public function __construct() {
    add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
  }

  public function rest_api_init() {
    add_filter( 'mwai_mcp_tools', [ $this, 'register_tools' ] );
    add_filter( 'mwai_mcp_callback', [ $this, 'handle_call' ], 10, 4 );
    add_filter( 'mwai_mcp_undo_targets', [ $this, 'undo_targets' ], 10, 3 );
    add_filter( 'mwai_mcp_undo_kinds', [ $this, 'undo_kinds' ] );
  }

  #region Tools
  private function tools(): array {
    return [
      'wp_get_menus' => [
        'name' => 'wp_get_menus',
        'description' => 'List the site\'s menus: classic menus with their items (ID, title, URL, what they link to, parent) and the theme locations they fill, and, on block themes, the navigation menus (wp_navigation posts, edited with wp_get_blocks and wp_edit_blocks). Pass menu (ID or name) for one menu only.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'menu' => [ 'type' => 'string', 'description' => 'Optional. A classic menu ID or name.' ],
          ],
        ],
        'accessLevel' => 'read',
      ],
      'wp_edit_menu' => [
        'name' => 'wp_edit_menu',
        'description' => 'Change a classic menu ("menu": its ID or name; with create: true, a new menu of that name). "operations" run in order, all checked before any write: {"op":"add","title":"...", plus "post_id" (a page or post), "term_id"+"taxonomy", or "url"; optional "parent" (an item ID) and "position" (1-based)}; {"op":"update","item":123, plus any of title, url, parent (0 = top level), position}; {"op":"delete","item":123}; {"op":"rename","name":"..."}; {"op":"location","location":"primary"} (a theme location from wp_get_menus; "remove": true unassigns). Returns the menu. Block theme menus are wp_navigation posts: edit them with wp_edit_blocks.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'menu' => [ 'type' => 'string', 'description' => 'Menu ID or name.' ],
            'create' => [ 'type' => 'boolean', 'description' => 'Create the menu if no menu has this name.' ],
            'operations' => [
              'type' => 'array',
              'description' => 'Operations to apply, in order (see the tool description).',
              'items' => [ 'type' => 'object', 'additionalProperties' => true ],
            ],
          ],
          'required' => [ 'menu', 'operations' ],
        ],
        'accessLevel' => 'admin',
      ],
      'wp_get_templates' => [
        'name' => 'wp_get_templates',
        'description' => 'Block themes only: list the templates (home, single, page, archive, 404...) and template parts (header, footer...) of the active theme, with whether the site owner customized each one and, if so, its post ID. To change one, call wp_open_template, then edit it with wp_get_blocks and wp_edit_blocks like any post.',
        'inputSchema' => [ 'type' => 'object', 'properties' => [
          'type' => [ 'type' => 'string', 'enum' => [ 'wp_template', 'wp_template_part' ], 'description' => 'Optional: only templates, or only parts.' ],
        ] ],
        'accessLevel' => 'read',
      ],
      'wp_open_template' => [
        'name' => 'wp_open_template',
        'description' => 'Get an editable copy of a block theme template or template part (e.g. slug "header", type "wp_template_part"), and return its post ID for wp_get_blocks / wp_edit_blocks. A template still coming from the theme files is copied into the site first, exactly as the Site Editor does when you change it; undoing this goes back to the theme\'s version.',
        'inputSchema' => [ 'type' => 'object', 'properties' => [
          'slug' => [ 'type' => 'string', 'description' => 'The template slug from wp_get_templates.' ],
          'type' => [ 'type' => 'string', 'enum' => [ 'wp_template', 'wp_template_part' ] ],
        ], 'required' => [ 'slug', 'type' ] ],
        // 'write' so it is journaled and undoable (see wp_site_maintenance in labs/mcp-ops.php).
        'accessLevel' => 'write',
      ],
      'wp_get_widgets' => [
        'name' => 'wp_get_widgets',
        'description' => 'Classic themes only: list the widget areas (sidebars, footers) and the widgets in each, with their ID (e.g. "block-3", "text-2"), type and content.',
        'inputSchema' => [ 'type' => 'object', 'properties' => (object) [] ],
        'accessLevel' => 'read',
      ],
      'wp_edit_widgets' => [
        'name' => 'wp_edit_widgets',
        'description' => 'Change the widgets of a classic theme, using the IDs from wp_get_widgets. "operations" run in order, all checked before any write: {"op":"add","sidebar":"sidebar-1","content":"<!-- wp:paragraph --><p>...</p><!-- /wp:paragraph -->","position":0} (a block widget; plain text or HTML is wrapped in a paragraph or HTML block; position optional, end by default); {"op":"update","widget":"block-3","content":"..."} (block widgets) or "settings":{...} (other widgets, merged, e.g. {"title":"...","text":"..."}); {"op":"move","widget":"text-2","sidebar":"footer-1","position":0}; {"op":"remove","widget":"block-3"} (to Inactive Widgets, where WordPress keeps it). Can be undone with mcp_undo_change.',
        'inputSchema' => [ 'type' => 'object', 'properties' => [
          'operations' => [ 'type' => 'array', 'items' => [ 'type' => 'object', 'additionalProperties' => true ] ],
        ], 'required' => [ 'operations' ] ],
        'accessLevel' => 'write',
      ],
      'wp_get_site_style' => [
        'name' => 'wp_get_site_style',
        'description' => 'Read how the active theme is styled: the Additional CSS, the theme mods (Customizer settings such as colors, logo or header options), and on block themes the global styles the site owner customized (theme.json "settings" and "styles"). Pass only to limit the answer to css, theme_mods or global_styles.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'only' => [ 'type' => 'string', 'enum' => [ 'css', 'theme_mods', 'global_styles' ] ],
          ],
        ],
        'accessLevel' => 'read',
      ],
      'wp_update_site_style' => [
        'name' => 'wp_update_site_style',
        'description' => 'Change how the active theme looks, with any of: "css" (replaces the Additional CSS: read it first with wp_get_site_style) or "append_css" (added at the end); "theme_mods" (merged into the Customizer settings, null removes one); "global_styles" (block themes: {"styles": {...}, "settings": {...}} deep-merged, theme.json format, e.g. {"styles":{"color":{"background":"#fdfaf4"}}}). Can be undone with mcp_undo_change.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'css' => [ 'type' => 'string', 'description' => 'The full Additional CSS (replaces it).' ],
            'append_css' => [ 'type' => 'string', 'description' => 'CSS added at the end of the Additional CSS.' ],
            'theme_mods' => [ 'type' => 'object', 'description' => 'Theme mods to set (null removes one).', 'additionalProperties' => true ],
            'global_styles' => [ 'type' => 'object', 'description' => 'theme.json "styles" and/or "settings" to merge.', 'additionalProperties' => true ],
          ],
        ],
        'accessLevel' => 'admin',
      ],
    ];
  }

  public function register_tools( array $prev ): array {
    foreach ( $this->tools() as $name => $tool ) {
      // Widgets exist only where the theme registers widget areas (block themes have none).
      if ( strpos( $name, '_widgets' ) !== false && !self::has_sidebars() ) {
        continue;
      }
      $tool['annotations'] = [
        'readOnlyHint' => $tool['accessLevel'] === 'read',
        'destructiveHint' => false,
        'openWorldHint' => false,
      ];
      $prev[] = $tool;
    }
    return $prev;
  }

  public function handle_call( $prev, string $tool, array $args, $id ) {
    if ( !empty( $prev ) || !isset( $this->tools()[ $tool ] ) ) {
      return $prev;
    }
    $cap = $tool === 'wp_update_site_style' && ( isset( $args['css'] ) || isset( $args['append_css'] ) ) ? 'edit_css' : 'edit_theme_options';
    if ( !current_user_can( 'edit_theme_options' ) || !current_user_can( $cap ) ) {
      throw new Exception( 'You are not allowed to change the theme\'s menus or styles.', Meow_MWAI_Labs_MCP::DENIED_CODE );
    }
    switch ( $tool ) {
      case 'wp_get_menus':
        return $this->get_menus( $args );
      case 'wp_edit_menu':
        return $this->edit_menu( $args );
      case 'wp_get_site_style':
        return $this->get_style( (string) ( $args['only'] ?? '' ) );
      case 'wp_update_site_style':
        return $this->update_style( $args );
      case 'wp_get_widgets':
        return $this->get_widgets();
      case 'wp_edit_widgets':
        return $this->edit_widgets( $args );
      case 'wp_get_templates':
        return $this->get_templates( (string) ( $args['type'] ?? '' ) );
      case 'wp_open_template':
        return $this->open_template( sanitize_key( (string) ( $args['slug'] ?? '' ) ), (string) ( $args['type'] ?? 'wp_template' ) );
    }
    return $prev;
  }
  #endregion

  #region Menus
  private static function find_menu( $ref ) {
    if ( is_numeric( $ref ) ) {
      return wp_get_nav_menu_object( (int) $ref ) ?: null;
    }
    $ref = trim( (string) $ref );
    return $ref === '' ? null : ( wp_get_nav_menu_object( $ref ) ?: null );
  }

  private static function menu_locations( int $menu_id ): array {
    return array_keys( array_filter( (array) get_nav_menu_locations(), function ( $id ) use ( $menu_id ) {
      return (int) $id === $menu_id;
    } ) );
  }

  private static function items( int $menu_id ): array {
    $out = [];
    foreach ( (array) wp_get_nav_menu_items( $menu_id, [ 'post_status' => 'any' ] ) as $item ) {
      $row = [ 'id' => (int) $item->ID, 'title' => $item->title, 'url' => $item->url, 'type' => $item->type, 'object' => $item->object,
        'object_id' => (int) $item->object_id, 'parent' => (int) $item->menu_item_parent, 'position' => (int) $item->menu_order ];
      if ( $item->target ) {
        $row['target'] = $item->target;
      }
      $out[] = $row;
    }
    return $out;
  }

  private function describe_menu( $menu ): array {
    return [ 'id' => (int) $menu->term_id, 'name' => $menu->name, 'locations' => self::menu_locations( (int) $menu->term_id ),
      'items' => self::items( (int) $menu->term_id ) ];
  }

  private function get_menus( array $a ): array {
    if ( !empty( $a['menu'] ) ) {
      $menu = self::find_menu( $a['menu'] );
      if ( !$menu ) {
        throw new Exception( 'No menu "' . $a['menu'] . '". Call wp_get_menus without "menu" to list them.' );
      }
      return $this->describe_menu( $menu );
    }
    $out = [
      'menus' => array_map( [ $this, 'describe_menu' ], wp_get_nav_menus() ),
      'locations' => (object) get_registered_nav_menus(),
    ];
    if ( wp_is_block_theme() ) {
      $out['navigation_menus'] = array_map( function ( $post ) {
        return [ 'ID' => $post->ID, 'title' => $post->post_title, 'status' => $post->post_status ];
      }, get_posts( [ 'post_type' => 'wp_navigation', 'post_status' => [ 'publish', 'draft' ], 'numberposts' => 50 ] ) );
      $out['note'] = 'This is a block theme: its header uses navigation_menus (blocks). Edit them with wp_get_blocks and wp_edit_blocks.';
    }
    return $out;
  }

  // Item fields as wp_update_nav_menu_item() takes them, from an operation or a stored item.
  private static function item_args( array $op, array $current = [] ): array {
    $args = [ 'menu-item-status' => 'publish' ];
    foreach ( $current as $key => $value ) {
      $args[ 'menu-item-' . str_replace( '_', '-', $key === 'parent' ? 'parent_id' : $key ) ] = $value;
    }
    if ( !empty( $op['post_id'] ) ) {
      $post = get_post( (int) $op['post_id'] );
      if ( !$post ) {
        throw new Exception( 'Post #' . (int) $op['post_id'] . ' was not found.' );
      }
      $args = array_merge( $args, [ 'menu-item-type' => 'post_type', 'menu-item-object' => $post->post_type, 'menu-item-object-id' => $post->ID, 'menu-item-url' => '' ] );
    }
    elseif ( !empty( $op['term_id'] ) ) {
      $taxonomy = sanitize_key( $op['taxonomy'] ?? 'category' );
      if ( !term_exists( (int) $op['term_id'], $taxonomy ) ) {
        throw new Exception( 'Term #' . (int) $op['term_id'] . " was not found in $taxonomy." );
      }
      $args = array_merge( $args, [ 'menu-item-type' => 'taxonomy', 'menu-item-object' => $taxonomy, 'menu-item-object-id' => (int) $op['term_id'], 'menu-item-url' => '' ] );
    }
    elseif ( isset( $op['url'] ) ) {
      $args = array_merge( $args, [ 'menu-item-type' => 'custom', 'menu-item-object' => 'custom', 'menu-item-url' => esc_url_raw( (string) $op['url'] ) ] );
    }
    if ( isset( $op['title'] ) ) {
      $args['menu-item-title'] = sanitize_text_field( (string) $op['title'] );
    }
    if ( isset( $op['parent'] ) ) {
      $args['menu-item-parent-id'] = (int) $op['parent'];
    }
    if ( isset( $op['position'] ) ) {
      $args['menu-item-position'] = (int) $op['position'];
    }
    if ( isset( $op['target'] ) ) {
      $args['menu-item-target'] = $op['target'] === '_blank' ? '_blank' : '';
    }
    return $args;
  }

  private function edit_menu( array $a ): array {
    $menu = self::find_menu( $a['menu'] ?? '' );
    if ( !$menu ) {
      if ( empty( $a['create'] ) || is_numeric( $a['menu'] ?? '' ) ) {
        throw new Exception( 'No menu "' . ( $a['menu'] ?? '' ) . '". Pass create: true to make a new one with this name.' );
      }
      $menu_id = wp_create_nav_menu( sanitize_text_field( (string) $a['menu'] ) );
      if ( is_wp_error( $menu_id ) ) {
        throw new Exception( $menu_id->get_error_message() );
      }
      $menu = wp_get_nav_menu_object( $menu_id );
    }
    $menu_id = (int) $menu->term_id;
    $ops = $a['operations'] ?? [];
    if ( is_string( $ops ) ) {
      $ops = json_decode( $ops, true );
    }
    $ops = array_values( (array) $ops );
    if ( !$ops ) {
      throw new Exception( '"operations" must be a non-empty array.' );
    }
    // Everything is checked before the first write, so a failing batch changes nothing.
    foreach ( $ops as $n => $op ) {
      $this->check_menu_op( is_array( $op ) ? $op : [], 'Operation ' . ( $n + 1 ), $menu_id );
    }
    foreach ( $ops as $n => $op ) {
      $label = 'Operation ' . ( $n + 1 );
      $item_id = (int) ( $op['item'] ?? 0 );
      switch ( $op['op'] ) {
        case 'add':
          $done = wp_update_nav_menu_item( $menu_id, 0, self::item_args( $op ) );
          break;
        case 'update':
          $current = array_intersect_key( self::item_row( wp_setup_nav_menu_item( get_post( $item_id ) ) ), array_flip( self::ITEM_FIELDS ) );
          $done = wp_update_nav_menu_item( $menu_id, $item_id, self::item_args( $op, $current ) );
          break;
        case 'delete':
          $done = wp_delete_post( $item_id, true );
          break;
        case 'rename':
          $done = wp_update_nav_menu_object( $menu_id, [ 'menu-name' => sanitize_text_field( (string) $op['name'] ) ] );
          break;
        case 'location':
          $locations = (array) get_theme_mod( 'nav_menu_locations', [] );
          $location = sanitize_key( (string) $op['location'] );
          if ( !empty( $op['remove'] ) ) {
            unset( $locations[ $location ] );
          }
          else {
            $locations[ $location ] = $menu_id;
          }
          set_theme_mod( 'nav_menu_locations', $locations );
          $done = true;
          break;
      }
      if ( is_wp_error( $done ) || !$done ) {
        throw new Exception( "$label failed" . ( is_wp_error( $done ) ? ': ' . $done->get_error_message() : '.' ) );
      }
    }
    return $this->describe_menu( wp_get_nav_menu_object( $menu_id ) );
  }

  private function check_menu_op( array $op, string $label, int $menu_id ) {
    $action = $op['op'] ?? '';
    if ( !in_array( $action, [ 'add', 'update', 'delete', 'rename', 'location' ], true ) ) {
      throw new Exception( "$label: \"op\" must be add, update, delete, rename or location. Nothing was changed." );
    }
    if ( $action === 'update' || $action === 'delete' ) {
      $item_id = (int) ( $op['item'] ?? 0 );
      if ( !$item_id || get_post_type( $item_id ) !== 'nav_menu_item' || !has_term( $menu_id, 'nav_menu', $item_id ) ) {
        throw new Exception( "$label: item #$item_id is not in this menu. Nothing was changed." );
      }
    }
    if ( isset( $op['parent'] ) && (int) $op['parent'] && !has_term( $menu_id, 'nav_menu', (int) $op['parent'] ) ) {
      throw new Exception( "$label: parent #" . (int) $op['parent'] . ' is not in this menu. Nothing was changed.' );
    }
    if ( $action === 'add' && empty( $op['post_id'] ) && empty( $op['term_id'] ) && !isset( $op['url'] ) ) {
      throw new Exception( "$label: \"add\" needs post_id, term_id or url. Nothing was changed." );
    }
    if ( $action === 'rename' && trim( (string) ( $op['name'] ?? '' ) ) === '' ) {
      throw new Exception( "$label: \"rename\" needs a name. Nothing was changed." );
    }
    if ( $action === 'location' && !array_key_exists( sanitize_key( (string) ( $op['location'] ?? '' ) ), get_registered_nav_menus() ) ) {
      $known = array_keys( get_registered_nav_menus() );
      throw new Exception( "$label: not a menu location of this theme" . ( $known ? ' (' . implode( ', ', $known ) . ')' : ', which has none' ) . '. Nothing was changed.' );
    }
    // Checks that the linked post or term exists.
    if ( $action === 'add' || $action === 'update' ) {
      self::item_args( $op );
    }
  }

  // Every field of an item, as stored, for undo and for updates that keep what they don't set.
  private static function item_row( $item ): array {
    return [ 'id' => (int) $item->ID, 'title' => $item->post_title, 'url' => $item->url, 'type' => $item->type, 'object' => $item->object,
      'object_id' => (int) $item->object_id, 'parent' => (int) $item->menu_item_parent, 'position' => (int) $item->menu_order,
      'target' => (string) $item->target, 'classes' => implode( ' ', array_filter( (array) $item->classes ) ),
      'attr_title' => (string) $item->attr_title, 'description' => (string) $item->description, 'xfn' => (string) $item->xfn ];
  }
  #endregion

  #region Templates
  private function get_templates( string $only ): array {
    if ( !wp_is_block_theme() ) {
      throw new Exception( 'The active theme is not a block theme, so it has no editable templates. Its look is changed with wp_update_site_style (css, theme_mods).' );
    }
    $out = [];
    foreach ( [ 'wp_template', 'wp_template_part' ] as $type ) {
      if ( $only && $only !== $type ) {
        continue;
      }
      foreach ( get_block_templates( [], $type ) as $template ) {
        $row = [ 'slug' => $template->slug, 'type' => $type, 'title' => $template->title,
          'customized' => $template->source === 'custom', 'ID' => $template->wp_id ? (int) $template->wp_id : null ];
        if ( $type === 'wp_template_part' && !empty( $template->area ) ) {
          $row['area'] = $template->area;
        }
        $out[] = $row;
      }
    }
    return [ 'theme' => get_stylesheet(), 'templates' => $out ];
  }

  // The same copy the Site Editor makes on the first change: a post holding the theme's markup,
  // tied to the theme (and to its area, for parts). Trashing it falls back to the theme file.
  private function open_template( string $slug, string $type ): array {
    if ( !wp_is_block_theme() ) {
      throw new Exception( 'The active theme is not a block theme, so it has no templates to open.' );
    }
    $type = $type === 'wp_template_part' ? 'wp_template_part' : 'wp_template';
    $template = get_block_template( get_stylesheet() . '//' . $slug, $type );
    if ( !$template ) {
      throw new Exception( "No $type \"$slug\" in this theme. See wp_get_templates." );
    }
    if ( $template->wp_id ) {
      return [ 'ID' => (int) $template->wp_id, 'slug' => $slug, 'note' => 'Already customized: edit it with wp_get_blocks and wp_edit_blocks.' ];
    }
    $id = wp_insert_post( wp_slash( [ 'post_type' => $type, 'post_status' => 'publish', 'post_name' => $slug,
      'post_title' => $template->title ?: $slug, 'post_content' => $template->content, 'post_excerpt' => $template->description ] ), true );
    if ( is_wp_error( $id ) ) {
      throw new Exception( $id->get_error_message() );
    }
    wp_set_post_terms( $id, [ get_stylesheet() ], 'wp_theme' );
    if ( $type === 'wp_template_part' ) {
      wp_set_post_terms( $id, [ $template->area ?: WP_TEMPLATE_PART_AREA_UNCATEGORIZED ], 'wp_template_part_area' );
    }
    return [ 'ID' => (int) $id, 'slug' => $slug, 'note' => 'Copied from the theme. Edit it with wp_get_blocks and wp_edit_blocks; the change shows on the site right away.' ];
  }
  #endregion

  #region Widgets
  // Block themes never display widget areas, even when a plugin registers one.
  private static function has_sidebars(): bool {
    global $wp_registered_sidebars;
    return !empty( $wp_registered_sidebars ) && !wp_is_block_theme();
  }

  // "block-3" → [ "block", 3 ].
  private static function widget_parts( string $widget_id ): array {
    return preg_match( '/^(.+)-(\d+)$/', $widget_id, $m ) ? [ $m[1], (int) $m[2] ] : [ $widget_id, 0 ];
  }

  private static function widget_instance( string $widget_id ): ?array {
    [ $base, $number ] = self::widget_parts( $widget_id );
    $all = get_option( 'widget_' . $base, [] );
    return is_array( $all ) && isset( $all[ $number ] ) && is_array( $all[ $number ] ) ? $all[ $number ] : null;
  }

  private function get_widgets(): array {
    global $wp_registered_sidebars;
    if ( !self::has_sidebars() ) {
      throw new Exception( 'This theme has no widget areas (block themes use templates: see wp_get_templates).' );
    }
    $areas = wp_get_sidebars_widgets();
    $out = [];
    foreach ( array_merge( array_keys( $wp_registered_sidebars ), [ 'wp_inactive_widgets' ] ) as $sidebar_id ) {
      $widgets = [];
      foreach ( (array) ( $areas[ $sidebar_id ] ?? [] ) as $widget_id ) {
        [ $base ] = self::widget_parts( $widget_id );
        $instance = self::widget_instance( $widget_id ) ?? [];
        $text = $base === 'block' ? (string) ( $instance['content'] ?? '' ) : implode( ' ', array_filter( array_map( function ( $v ) { return is_scalar( $v ) ? (string) $v : ''; }, $instance ) ) );
        $text = trim( preg_replace( '/\s+/u', ' ', wp_strip_all_tags( $text ) ) );
        $widgets[] = [ 'widget' => $widget_id, 'type' => $base, 'title' => (string) ( $instance['title'] ?? '' ),
          'text' => mb_strlen( $text ) > 100 ? mb_substr( $text, 0, 97 ) . '...' : $text ];
      }
      $out[] = [ 'sidebar' => $sidebar_id, 'name' => $sidebar_id === 'wp_inactive_widgets' ? 'Inactive Widgets' : $wp_registered_sidebars[ $sidebar_id ]['name'], 'widgets' => $widgets ];
    }
    return [ 'theme' => get_stylesheet(), 'sidebars' => $out ];
  }

  // Text or HTML without block markup becomes a block: a paragraph for text, an HTML block otherwise.
  private static function as_block( string $content ): string {
    if ( strpos( $content, '<!-- wp:' ) !== false ) {
      return $content;
    }
    if ( $content === wp_strip_all_tags( $content ) ) {
      return "<!-- wp:paragraph -->\n<p>" . esc_html( $content ) . "</p>\n<!-- /wp:paragraph -->";
    }
    return "<!-- wp:html -->\n" . $content . "\n<!-- /wp:html -->";
  }

  private function edit_widgets( array $a ): array {
    global $wp_registered_sidebars;
    if ( !self::has_sidebars() ) {
      throw new Exception( 'This theme has no widget areas.' );
    }
    $ops = is_string( $a['operations'] ?? null ) ? json_decode( $a['operations'], true ) : ( $a['operations'] ?? [] );
    if ( !is_array( $ops ) || !$ops ) {
      throw new Exception( '"operations" must be a non-empty array.' );
    }
    $areas = wp_get_sidebars_widgets();
    $find = function ( string $widget_id ) use ( &$areas ) {
      foreach ( $areas as $sidebar_id => $list ) {
        $index = is_array( $list ) ? array_search( $widget_id, $list, true ) : false;
        if ( $index !== false ) {
          return [ $sidebar_id, $index ];
        }
      }
      return null;
    };
    $options = [];
    $option = function ( string $base ) use ( &$options ) {
      if ( !isset( $options[ $base ] ) ) {
        $options[ $base ] = get_option( 'widget_' . $base, [] );
        $options[ $base ] = is_array( $options[ $base ] ) ? $options[ $base ] : [];
      }
      return $options[ $base ];
    };
    // Applied to copies first: a bad operation changes nothing.
    foreach ( array_values( $ops ) as $n => $op ) {
      $label = 'Operation ' . ( $n + 1 );
      $sidebar = (string) ( $op['sidebar'] ?? '' );
      if ( in_array( $op['op'] ?? '', [ 'add', 'move' ], true ) && !isset( $wp_registered_sidebars[ $sidebar ] ) ) {
        throw new Exception( "$label: \"$sidebar\" is not a widget area. Areas: " . implode( ', ', array_keys( $wp_registered_sidebars ) ) . '. Nothing was changed.' );
      }
      $widget = (string) ( $op['widget'] ?? '' );
      $where = $widget !== '' ? $find( $widget ) : null;
      if ( in_array( $op['op'] ?? '', [ 'update', 'move', 'remove' ], true ) && !$where ) {
        throw new Exception( "$label: no widget \"$widget\". See wp_get_widgets. Nothing was changed." );
      }
      switch ( $op['op'] ?? '' ) {
        case 'add':
          $blocks = $option( 'block' );
          $number = max( array_merge( [ 1 ], array_filter( array_keys( $blocks ), 'is_int' ) ) ) + 1;
          $blocks[ $number ] = [ 'content' => self::as_block( (string) ( $op['content'] ?? '' ) ) ];
          $blocks['_multiwidget'] = 1;
          $options['block'] = $blocks;
          $list = (array) ( $areas[ $sidebar ] ?? [] );
          array_splice( $list, isset( $op['position'] ) ? max( 0, (int) $op['position'] ) : count( $list ), 0, [ 'block-' . $number ] );
          $areas[ $sidebar ] = $list;
          break;
        case 'update':
          [ $base, $number ] = self::widget_parts( $widget );
          $all = $option( $base );
          if ( $base === 'block' ) {
            if ( !isset( $op['content'] ) ) {
              throw new Exception( "$label: a block widget is changed with \"content\". Nothing was changed." );
            }
            $all[ $number ]['content'] = self::as_block( (string) $op['content'] );
          }
          else {
            if ( !is_array( $op['settings'] ?? null ) ) {
              throw new Exception( "$label: this widget is changed with \"settings\". Nothing was changed." );
            }
            $all[ $number ] = array_merge( (array) ( $all[ $number ] ?? [] ), $op['settings'] );
          }
          $options[ $base ] = $all;
          break;
        case 'move':
        case 'remove':
          [ $from, $index ] = $where;
          array_splice( $areas[ $from ], $index, 1 );
          $to = $op['op'] === 'move' ? $sidebar : 'wp_inactive_widgets';
          $list = (array) ( $areas[ $to ] ?? [] );
          array_splice( $list, isset( $op['position'] ) ? max( 0, (int) $op['position'] ) : count( $list ), 0, [ $widget ] );
          $areas[ $to ] = $list;
          break;
        default:
          throw new Exception( "$label: \"op\" must be add, update, move or remove. Nothing was changed." );
      }
    }
    foreach ( $options as $base => $value ) {
      update_option( 'widget_' . $base, $value );
    }
    wp_set_sidebars_widgets( $areas );
    return $this->get_widgets();
  }
  #endregion

  #region Styles
  private static function user_global_styles_id(): int {
    return class_exists( 'WP_Theme_JSON_Resolver' ) && wp_is_block_theme() ? (int) WP_Theme_JSON_Resolver::get_user_global_styles_post_id() : 0;
  }

  private static function theme_mods(): array {
    return array_diff_key( (array) get_theme_mods(), array_flip( self::RESERVED_MODS ) );
  }

  private function get_style( string $only ): array {
    $out = [ 'theme' => get_stylesheet(), 'block_theme' => wp_is_block_theme() ];
    if ( !$only || $only === 'css' ) {
      $out['css'] = wp_get_custom_css();
    }
    if ( !$only || $only === 'theme_mods' ) {
      $out['theme_mods'] = (object) self::theme_mods();
    }
    if ( ( !$only || $only === 'global_styles' ) && ( $post_id = self::user_global_styles_id() ) ) {
      $data = json_decode( (string) get_post( $post_id )->post_content, true );
      $out['global_styles'] = [ 'settings' => (object) ( $data['settings'] ?? [] ), 'styles' => (object) ( $data['styles'] ?? [] ) ];
    }
    return $out;
  }

  // Deep merge where null removes a key.
  private static function merge( array $base, array $changes ): array {
    foreach ( $changes as $key => $value ) {
      if ( $value === null ) {
        unset( $base[ $key ] );
      }
      elseif ( is_array( $value ) && isset( $base[ $key ] ) && is_array( $base[ $key ] ) && array_keys( $value ) !== range( 0, count( $value ) - 1 ) ) {
        $base[ $key ] = self::merge( $base[ $key ], $value );
      }
      else {
        $base[ $key ] = $value;
      }
    }
    return $base;
  }

  // PHP decodes {} and [] alike. Everything under "styles" is an object in theme.json, so an empty
  // one goes back as {}; "settings" holds real lists (palettes) and is left as decoded.
  private static function objects( $value ) {
    if ( !is_array( $value ) ) {
      return $value;
    }
    if ( !$value ) {
      return (object) [];
    }
    return array_map( [ __CLASS__, 'objects' ], $value );
  }

  private static function save_global_styles( int $post_id, array $data ) {
    if ( array_key_exists( 'styles', $data ) ) {
      $data['styles'] = self::objects( $data['styles'] );
    }
    $done = wp_update_post( wp_slash( [ 'ID' => $post_id, 'post_content' => wp_json_encode( $data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) ] ), true );
    if ( is_wp_error( $done ) ) {
      throw new Exception( $done->get_error_message() );
    }
    if ( function_exists( 'wp_clean_theme_json_cache' ) ) {
      wp_clean_theme_json_cache();
    }
  }

  private function update_style( array $a ): string {
    $done = [];
    if ( isset( $a['css'] ) || isset( $a['append_css'] ) ) {
      $css = isset( $a['css'] ) ? (string) $a['css'] : rtrim( wp_get_custom_css() ) . "\n\n" . (string) $a['append_css'];
      $saved = wp_update_custom_css_post( trim( $css ) . "\n" );
      if ( is_wp_error( $saved ) ) {
        throw new Exception( $saved->get_error_message() );
      }
      $done[] = 'Additional CSS';
    }
    if ( isset( $a['theme_mods'] ) ) {
      $mods = is_string( $a['theme_mods'] ) ? json_decode( $a['theme_mods'], true ) : $a['theme_mods'];
      foreach ( (array) $mods as $key => $value ) {
        if ( in_array( $key, self::RESERVED_MODS, true ) ) {
          throw new Exception( "\"$key\" is managed elsewhere (menus with wp_edit_menu, CSS with css)." );
        }
        $value === null ? remove_theme_mod( $key ) : set_theme_mod( $key, $value );
      }
      $done[] = 'theme mods (' . implode( ', ', array_keys( (array) $mods ) ) . ')';
    }
    if ( isset( $a['global_styles'] ) ) {
      $post_id = self::user_global_styles_id();
      if ( !$post_id ) {
        throw new Exception( 'Global styles are for block themes; this theme uses theme_mods and css.' );
      }
      $changes = is_string( $a['global_styles'] ) ? json_decode( $a['global_styles'], true ) : $a['global_styles'];
      $changes = array_intersect_key( (array) $changes, [ 'styles' => 1, 'settings' => 1 ] );
      if ( !$changes ) {
        throw new Exception( '"global_styles" takes "styles" and/or "settings".' );
      }
      $data = json_decode( (string) get_post( $post_id )->post_content, true ) ?: [];
      $data = self::merge( array_merge( [ 'version' => WP_Theme_JSON::LATEST_SCHEMA, 'isGlobalStylesUserThemeJSON' => true ], $data ), $changes );
      self::save_global_styles( $post_id, $data );
      $done[] = 'global styles';
    }
    if ( !$done ) {
      throw new Exception( 'Pass css, append_css, theme_mods or global_styles.' );
    }
    return 'Updated: ' . implode( '; ', $done ) . '. Undo with mcp_undo_change if needed.';
  }
  #endregion

  #region Undo (labs/mcp-undo.php)
  public function undo_targets( $targets, string $tool, array $a ) {
    switch ( $tool ) {
      case 'wp_edit_widgets':
        // Where each widget sits, and the settings of every widget type the operations touch.
        $ops = is_string( $a['operations'] ?? null ) ? json_decode( $a['operations'], true ) : ( $a['operations'] ?? [] );
        $bases = [ 'block' ];
        foreach ( (array) $ops as $op ) {
          if ( !empty( $op['widget'] ) ) {
            $bases[] = self::widget_parts( (string) $op['widget'] )[0];
          }
        }
        return array_merge( [ [ 'kind' => 'option', 'name' => 'sidebars_widgets' ] ], array_map( function ( $base ) {
          return [ 'kind' => 'option', 'name' => 'widget_' . $base ];
        }, array_values( array_unique( $bases ) ) ) );
      case 'wp_edit_menu':
        $menu = self::find_menu( $a['menu'] ?? '' );
        // A menu created by the call is found here only afterwards: its target is the name.
        return [ [ 'kind' => 'menu', 'id' => $menu ? (int) $menu->term_id : 0, 'name' => $menu ? '' : sanitize_text_field( (string) ( $a['menu'] ?? '' ) ) ] ];
      case 'wp_update_site_style':
        $out = [];
        if ( isset( $a['css'] ) || isset( $a['append_css'] ) ) {
          $out[] = [ 'kind' => 'custom_css', 'theme' => get_stylesheet() ];
        }
        $mods = is_string( $a['theme_mods'] ?? null ) ? json_decode( $a['theme_mods'], true ) : ( $a['theme_mods'] ?? [] );
        foreach ( array_keys( (array) $mods ) as $key ) {
          $out[] = [ 'kind' => 'theme_mod', 'theme' => get_stylesheet(), 'key' => (string) $key ];
        }
        if ( isset( $a['global_styles'] ) && ( $post_id = self::user_global_styles_id() ) ) {
          $out[] = [ 'kind' => 'global_styles', 'id' => $post_id ];
        }
        return $out;
    }
    return $targets;
  }

  private static function menu_of( array $t ) {
    return $t['id'] ? ( wp_get_nav_menu_object( (int) $t['id'] ) ?: null ) : ( $t['name'] !== '' ? ( wp_get_nav_menu_object( $t['name'] ) ?: null ) : null );
  }

  public function undo_kinds( array $kinds ): array {
    $theme_ok = function () { return current_user_can( 'edit_theme_options' ); };
    $kinds['menu'] = [
      // restore_menu() rebuilds a deleted menu, so undoing a menu's creation can be undone too.
      'recreates' => true,
      'read' => function ( $t ) {
        $menu = self::menu_of( $t );
        if ( !$menu ) {
          return null;
        }
        $items = array_map( [ __CLASS__, 'item_row' ], (array) wp_get_nav_menu_items( (int) $menu->term_id, [ 'post_status' => 'any' ] ) );
        return [ 'name' => $menu->name, 'locations' => self::menu_locations( (int) $menu->term_id ), 'items' => $items ];
      },
      'write' => [ __CLASS__, 'restore_menu' ],
      'can' => $theme_ok,
      'title' => function ( $t ) {
        $menu = self::menu_of( $t );
        return $menu ? $menu->name . ' (menu)' : 'Menu';
      },
    ];
    $kinds['custom_css'] = [
      'recreates' => true,
      'read' => function ( $t ) { return wp_get_custom_css( $t['theme'] ); },
      'write' => function ( $t, $state ) {
        $saved = wp_update_custom_css_post( (string) $state, [ 'stylesheet' => $t['theme'] ] );
        if ( is_wp_error( $saved ) ) {
          throw new Exception( $saved->get_error_message() );
        }
      },
      'can' => function () { return current_user_can( 'edit_css' ); },
      'title' => function () { return 'Additional CSS'; },
    ];
    $kinds['theme_mod'] = [
      'recreates' => true,
      'read' => function ( $t ) {
        $mods = (array) get_option( 'theme_mods_' . $t['theme'], [] );
        return array_key_exists( $t['key'], $mods ) ? [ 'v' => $mods[ $t['key'] ] ] : null;
      },
      'write' => function ( $t, $state ) {
        if ( $t['theme'] !== get_stylesheet() ) {
          throw new Exception( 'This setting belongs to the theme ' . $t['theme'] . ', which is no longer active.' );
        }
        $state === null ? remove_theme_mod( $t['key'] ) : set_theme_mod( $t['key'], $state['v'] );
      },
      'can' => $theme_ok,
      'title' => function ( $t ) { return 'Theme setting ' . $t['key']; },
    ];
    $kinds['global_styles'] = [
      'read' => function ( $t ) {
        $post = get_post( (int) $t['id'] );
        return $post ? (string) $post->post_content : null;
      },
      'write' => function ( $t, $state ) {
        $data = json_decode( (string) $state, true );
        if ( !is_array( $data ) ) {
          throw new Exception( 'The previous global styles could not be read.' );
        }
        self::save_global_styles( (int) $t['id'], $data );
      },
      'can' => $theme_ok,
      'title' => function () { return 'Global styles'; },
    ];
    return $kinds;
  }

  // Puts a menu back as it was: same name, locations and items. Items deleted since come back
  // with new IDs, so children are re-pointed to their parent's new ID.
  public static function restore_menu( array $t, $state ) {
    $menu = self::menu_of( $t );
    if ( $state === null ) {
      if ( $menu ) {
        wp_delete_nav_menu( (int) $menu->term_id );
      }
      return;
    }
    if ( !$menu ) {
      $created = wp_create_nav_menu( $state['name'] );
      if ( is_wp_error( $created ) ) {
        throw new Exception( $created->get_error_message() );
      }
      $menu = wp_get_nav_menu_object( $created );
    }
    $menu_id = (int) $menu->term_id;
    if ( $menu->name !== $state['name'] ) {
      wp_update_nav_menu_object( $menu_id, [ 'menu-name' => $state['name'] ] );
    }
    $current = array_map( 'intval', wp_list_pluck( (array) wp_get_nav_menu_items( $menu_id, [ 'post_status' => 'any' ] ), 'ID' ) );
    $keep = array_map( 'intval', wp_list_pluck( $state['items'], 'id' ) );
    foreach ( array_diff( $current, $keep ) as $id ) {
      wp_delete_post( $id, true );
    }
    // Parents first, so a child's parent already has its (possibly new) ID.
    $items = $state['items'];
    usort( $items, function ( $x, $y ) { return $x['position'] <=> $y['position']; } );
    $ids = [];
    $pending = $items;
    for ( $pass = 0; $pending && $pass < 20; $pass++ ) {
      $next = [];
      foreach ( $pending as $item ) {
        if ( $item['parent'] && !isset( $ids[ $item['parent'] ] ) && in_array( $item['parent'], $keep, true ) ) {
          $next[] = $item;
          continue;
        }
        $row = $item;
        $row['parent'] = $item['parent'] ? ( $ids[ $item['parent'] ] ?? 0 ) : 0;
        $exists = in_array( $item['id'], $current, true );
        $saved = wp_update_nav_menu_item( $menu_id, $exists ? $item['id'] : 0, self::item_args( [], array_diff_key( $row, [ 'id' => 1 ] ) ) );
        if ( is_wp_error( $saved ) ) {
          throw new Exception( $saved->get_error_message() );
        }
        $ids[ $item['id'] ] = (int) $saved;
      }
      $pending = $next;
    }
    $locations = (array) get_theme_mod( 'nav_menu_locations', [] );
    foreach ( $locations as $location => $id ) {
      if ( (int) $id === $menu_id && !in_array( $location, $state['locations'], true ) ) {
        unset( $locations[ $location ] );
      }
    }
    foreach ( $state['locations'] as $location ) {
      $locations[ $location ] = $menu_id;
    }
    set_theme_mod( 'nav_menu_locations', $locations );
  }
  #endregion
}
