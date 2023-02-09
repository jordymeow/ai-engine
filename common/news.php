<?php

if ( !class_exists( 'MeowCommon_News' ) ) {

	class MeowCommon_News {
		private $domain = null;
		private $topic = null;
		private $fromDate = null;
		private $toDate = null;

		public function __construct( $domain ) {
			$this->domain = $domain;
			$this->topic = "mwai-1.0";
			$this->fromDate = new DateTime( '2023-02-01' );
			$this->toDate = new DateTime( '2023-06-01' );
			
      if ( is_admin() ) {
				// Time constraint for the news.
				$now = new DateTime();
				if ( $now < $this->fromDate || $now > $this->toDate ) {
					return;
				}

				// Other constraint for the news.
				$mwai_options = get_option( 'mwai_options' );
				if ( !empty( $mwai_options ) ) {
					return;
				}

				// Check the news date.
        $news_date = $this->retrieve_news_date();

				// THIS FROM PROD:
        if ( !empty( $news_date ) && time() > $news_date ) {
          add_action( 'admin_notices', array( $this, 'admin_notices_news' ) );
					add_filter( 'safe_style_css', function( $styles ) {
						$styles[] = 'display';
						return $styles;
					} );
        }
      }
		}

		function retrieve_news_date() {
			$news = get_option( 'meowapps_news', [ 'topic' => $this->topic, 'date' => null ] );
			// New Topic or Fresh Option => Plan the news.
			if ( $news['topic'] !== $this->topic || $news['date'] === null ) {
				$two_days = strtotime( '+3 days' );
				$seven_days = strtotime( '+7 days' );
				$news['topic'] = $this->topic;
				$news['date'] = mt_rand( $two_days, $seven_days );
				update_option( 'meowapps_news', $news, false );
			}
			return $news['date'];
		}

		function admin_notices_news() {
			if ( isset( $_POST['meowapps_remind_me'] ) ) {
				$news = get_option( 'meowapps_news' );
				$twelve_hours = strtotime( '+12 hours' );
				$thirtysix_hours = strtotime( '+36 hours' );
				$news['date'] = mt_rand( $twelve_hours, $thirtysix_hours );
				update_option( 'meowapps_news', $news, false );
				return;
			}
			else if ( isset( $_POST['meowapps_done_it'] ) ) {
				$news = get_option( 'meowapps_news' );
				$news['date'] = "";
				update_option( 'meowapps_news', $news, false );
				return;
			}
			$html = wp_kses_post( '<div class="notice notice-success" style="margin: 20px 0;">' );
			$html .= '<p style="font-size: 100%;">';

			// Title
			$html .= sprintf( __( '<h2 style="margin: 0 0 10px 0" class="title">AI Engine by Meow Apps: The Power of AI into WordPress 💫</h2>' ) );

			// Content
			$html .= sprintf( __( '<p style="font-size: 14px;">Since the end of 2022, I worked a lot to craft <b>the perfect AI plugin for WordPress</b>. As of February 2023, it\'s perfectly stable and packed with features. You\'ll get chatbots, AI forms, easy model training, content and images generation, a template system that will allow you to create your personal assistants for various tasks and much more! Here it is: <a href="%s" target="_blank">AI Engine</a>. Believe me, you will enjoy this. Have fun, and let me know how it goes! 🥳</p>', $this->domain ), 'https://wordpress.org/plugins/ai-engine/' );

			// Buttons
			$html .= '<div style="padding: 10px 0 12px 0; display: flex; align-items: center;">';
			$html .= '<a href="https://wordpress.org/plugins/ai-engine/" target="_blank" class="button button-primary" style="margin-right: 10px;">'
				. __( '👉 AI Engine at WordPress.org', $this->domain ) . '</a>';
			$html .= '<form method="post" action="" style="margin-right: 10px;">
				<input type="hidden" name="meowapps_remind_me" value="true">
				<input type="submit" name="submit" id="submit" class="button button-primary" value="'
				. __( '⏰ Remind me later', $this->domain ) . '"></form>';
			$html .= '<div style="flex: auto;"></div>';
			$html .= '<form method="post" action="">
				<input type="hidden" name="meowapps_done_it" value="true">
				<input type="submit" name="submit" id="submit" class="button" value="'
				. __( '❌ Delete', $this->domain ) . '">
				</form>
			</div>';
			$html .= '</div>';

			// Escape the output
			echo wp_kses( $html, array(
				'div' => array(
					'class' => array(),
					'style' => array(),
				),
				'p' => array(
					'style' => array(),
				),
				'h2' => array(
					'class' => array(),
					'style' => array()
				),
				'b' => array(),
				'br' => array(),
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
	}
}

?>
