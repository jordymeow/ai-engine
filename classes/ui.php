<?php

class Meow_MWAI_UI {
	private $core = null;

	function __construct( $core ) {
		$this->core = $core;
		add_action( 'admin_menu', array( $this, 'admin_menu' ) );
		add_filter( 'post_row_actions', [ $this, 'post_row_actions' ], 10, 2 );
		add_action( 'admin_footer', [ $this, 'admin_footer' ] );
	}

	function admin_menu() {
		add_management_page( 'AI Playground', __( 'AI Playground', 'ai-engine' ), 'manage_options', 
			'mwai_dashboard', array( $this, 'ai_playground' ) );
		add_action( 'admin_bar_menu', array( $this, 'admin_bar_menu' ), 100 );
		add_submenu_page( 'edit.php', 'Generate New', 'Generate New', 'manage_options', 'mwai_generate', 
			array( $this, 'ai_generate' ), 2 );

		// Add the mwai_generate page under Tools
		add_management_page( 'Content Generator', 'Content Generator', 'manage_options', 'mwai_generate', 
			array( $this, 'ai_generate' ) );
	}

	function admin_bar_menu( $wp_admin_bar ) {
		$url = MWAI_URL . "/images/wand.png";
		$image_html = "<img style='height: 22px; margin-bottom: -5px; margin-right: 10px;' src='${url}' alt='UI Engine' />";
		
		$args = array(
			'id' => 'mwai-playground',
			'title' => $image_html . __( 'AI Playground', 'ai-engine' ),
			'href' => admin_url( 'tools.php?page=mwai_dashboard' ),
			'meta' => array( 'class' => 'mwai-playground' ),
		);
		$wp_admin_bar->add_node( $args );
	}

	public function ai_playground() {
		echo '<div id="mwai-playground"></div>';
	}

	public function ai_generate() {
		echo '<div id="mwai-generator"></div>';
	}

	function post_row_actions( $actions, $post ) {
		if ( $post->post_type === 'post' ) {
			$actions['ai_titles'] = '<a class="mwai-link-title" href="#" data-id="' .
				$post->ID . '" data-title="' . $post->post_title . '">
				<span class="dashicons dashicons-update"></span> Generate Titles</a>';
		}
		return $actions;
	}

	function admin_footer() {
		echo '<div id="mwai-admin-postsList"></div>';
	}
}
