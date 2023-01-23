<?php

if ( !class_exists( 'MeowCommon_Ratings' ) ) {

	class MeowCommon_Ratings {

		public $mainfile; 	// plugin main file (media-file-renamer.php)
		public $domain; 		// domain used for translation (media-file-renamer)
		public $prefix;			// used for many things (filters, options, etc)

		public function __construct( $prefix, $mainfile, $domain ) {
			$this->mainfile = $mainfile;
			$this->domain = $domain;
			$this->prefix = $prefix;

      register_activation_hook( $mainfile, array( $this, 'show_meowapps_create_rating_date' ) );

      if ( is_admin() ) {
        $rating_date = $this->create_rating_date();
        if ( time() > $rating_date ) {
          add_action( 'admin_notices', array( $this, 'admin_notices_rating' ) );
					add_filter( 'safe_style_css', function( $styles ) {
						$styles[] = 'display';
						return $styles;
					} );
        }
      }
		}

		function show_meowapps_create_rating_date() {
			delete_option( 'meowapps_hide_meowapps' );
			$this->create_rating_date();
		}

		function create_rating_date() {
			$rating_date = get_option( $this->prefix . '_rating_date' );
			if ( empty( $rating_date ) ) {
				$two_weeks = strtotime( '+2 weeks' );
				$three_weeks = strtotime( '+3 weeks' );
				$rating_date = mt_rand( $two_weeks, $three_weeks );
				update_option( $this->prefix . '_rating_date', $rating_date, false );
			}
			return $rating_date;
		}

		function admin_notices_rating() {
			if ( isset( $_POST[$this->prefix . '_remind_me'] ) ) {
				$two_weeks = strtotime( '+2 weeks' );
				$six_weeks = strtotime( '+6 weeks' );
				$future_date = mt_rand( $two_weeks, $six_weeks );
				update_option( $this->prefix . '_rating_date', $future_date, false );
				return;
			}
			else if ( isset( $_POST[$this->prefix . '_never_remind_me'] ) ) {
				$twenty_years = strtotime( '+5 years' );
				update_option( $this->prefix . '_rating_date', $twenty_years, false );
				return;
			}
			else if ( isset( $_POST[$this->prefix . '_did_it'] ) ) {
				$twenty_years = strtotime( '+100 years' );
				update_option( $this->prefix . '_rating_date', $twenty_years, false );
				return;
			}
			$rating_date = get_option( $this->prefix . '_rating_date' );
			$html = wp_kses_post( '<div class="notice notice-success" data-rating-date="' .
				date( 'Y-m-d', $rating_date ) . '">' );
			$esc_nice_name = esc_attr( $this->nice_name_from_file( $this->mainfile ) );
			if ( $esc_nice_name === 'Wp Retina 2x Pro' ) {
				$esc_nice_name = "Perfect Images Pro";
			}
			else if ( $esc_nice_name === 'Wp Retina 2x' ) {
				$esc_nice_name = "Perfect Images";
			}
			$esc_short_url = esc_attr( $this->nice_short_url_from_file( $this->mainfile ) );
			$escaped_prefix = $this->prefix;
			$html .= '<p style="font-size: 100%;">';
			// Translators: %1$s is a plugin nicename, %2$s is a short url (slug)
			$html .= sprintf(
				__( '<h2 class="title">You have been using <b>%1$s</b> for some time now. Thank you 💕</h2>Could you take one minute and write a <b>little review</b> for me? That would <b>really</b> bring me joy and motivation 🥰<br />In the review, don\'t hesitate to share your feature requests and remarks. I will try my best!
					', $this->domain ), $esc_nice_name
			);
			$html .= '<div style="padding: 20px 0 12px 0; display: flex; align-items: center;">';
			$html .= '<a target="_blank" class="button button-primary" style="margin-right: 10px;" 
					href="https://wordpress.org/support/plugin/' . $esc_short_url . '/reviews/?rate=5#new-post">
					✍🏼 Yes, let\'s write it now!
				</a>
				<form method="post" action="" style="margin-right: 10px;">
					<input type="hidden" name="' . $escaped_prefix . '_did_it" value="true">
					<input type="submit" name="submit" id="submit" class="button button-primary" value="'
					. __( '🥰 I did it', $this->domain ) . '">
				</form>

				<div style="flex: auto;"></div>

				<form method="post" action="" style="margin-right: 10px;">
					<input type="hidden" name="' . $escaped_prefix . '_remind_me" value="true">
					<input type="submit" name="submit" id="submit" class="button button-primary" value="'
					. __( '⏰ Remind me later', $this->domain ) . '">
				</form>

				<form method="post" action="">
					<input type="hidden" name="' . $escaped_prefix . '_never_remind_me" value="true">
					<input type="submit" name="submit" id="submit" class="button-link" style="font-size: small;" value="'
					. __( 'Hide this', $this->domain ) . '">
				</form>
			</div>';
			$html .= '</div>';
			echo wp_kses( $html, array(
				'div' => array(
					'class' => array(),
					'data-rating-date' => array(),
					'style' => array(),
				),
				'p' => array(
					'style' => array(),
				),
				'h2' => array(
					'class' => array(),
				),
				'b' => array(),
				'a' => array(
					'href' => array(),
					'target' => array(),
					'class' => array(),
					'style' => array(),
				),
				'form' => array(
					'method' => array(),
					'action' => array(),
					'class' => array(),
					'style' => array(),
				),
				'input' => array(
					'type' => array(),
					'name' => array(),
					'value' => array(),
					'id' => array(),
					'class' => array(),
				),
			) );
		}

		function nice_short_url_from_file( $file ) {
			$info = pathinfo( $file );
			if ( !empty( $info ) ) {
				$info['filename'] = str_replace( '-pro', '', $info['filename'] );
				return $info['filename'];
			}
			return "";
		}

		function nice_name_from_file( $file ) {
			$info = pathinfo( $file );
			if ( !empty( $info ) ) {
				if ( $info['filename'] == 'wplr-sync' ) {
					return "Photo Engine";
				}
				$info['filename'] = str_replace( '-', ' ', $info['filename'] );
				$file = ucwords( $info['filename'] );
			}
			return $file;
		}
	}
}

?>
