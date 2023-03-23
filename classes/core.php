<?php

require_once( MWAI_PATH . '/vendor/autoload.php' );
require_once( MWAI_PATH . '/constants/init.php' );

use Rahul900day\Gpt3Encoder\Encoder;

class Meow_MWAI_Core
{
	public $admin = null;
	public $is_rest = false;
	public $is_cli = false;
	public $site_url = null;
	public $ai = null;
	private $option_name = 'mwai_options';
	public $defaultChatbotParams = MWAI_CHATBOT_PARAMS;

	public function __construct() {
		$this->site_url = get_site_url();
		$this->is_rest = MeowCommon_Helpers::is_rest();
		$this->is_cli = defined( 'WP_CLI' ) && WP_CLI;
		$this->ai = new Meow_MWAI_AI( $this );
		add_action( 'plugins_loaded', array( $this, 'init' ) );
	}

	function init() {
		global $mwai;
		$mwai = new Meow_MWAI_API();
		if ( $this->is_rest ) {
			new Meow_MWAI_Rest( $this );
		}
		if ( is_admin() ) {
			new Meow_MWAI_Admin( $this );
			new Meow_MWAI_Modules_Assistants( $this );
		}
		else {
			//new Meow_MWAI_UI( $this );
			if ( $this->get_option( 'shortcode_chat' ) ) {
				new Meow_MWAI_Modules_Chatbot();
			}
		}

		// Advanced core
		if ( class_exists( 'MeowPro_MWAI_Core' ) ) {
			new MeowPro_MWAI_Core( $this );
		}

		// Dynamic max tokens
		if ( $this->get_option( 'dynamic_max_tokens' ) ) {
			add_filter( 'mwai_estimate_tokens', array( $this, 'dynamic_max_tokens' ), 10, 2 );
		}
	}

	#region Roles & Capabilities

	function can_access_settings() {
		return apply_filters( 'mwai_allow_setup', current_user_can( 'manage_options' ) );
	}

	function can_access_features() {
		$editor_or_admin = current_user_can( 'editor' ) || current_user_can( 'administrator' );
		return apply_filters( 'mwai_allow_usage', $editor_or_admin );
	}

	#endregion

	#region Text-Related Helpers

	// Clean the text perfectly, resolve shortcodes, etc, etc.
  function cleanText( $rawText = "" ) {
    $text = strip_tags( $rawText );
    $text = strip_shortcodes( $text );

		// Remove everything <script>...</script>, <style>...</style> ?

    $text = html_entity_decode( $text );
    $text = str_replace( array( "\r", "\n" ), "", $text );
    $sentences = preg_split( '/(?<=[.?!])(?=[a-zA-Z ])/', $text );
    foreach ( $sentences as $key => $sentence ) {
      $sentences[$key] = trim( $sentence );
    }
    $text = implode( " ", $sentences );
    $text = preg_replace( '/^[\pZ\pC]+|[\pZ\pC]+$/u', '', $text );
    return $text . " ";
  }

  // Make sure there are no duplicate sentences, and keep the length under a maximum length.
  function cleanSentences( $text, $maxTokens = 512 ) {
    //$sentences = preg_split( '/(?<=[.?!])(?=[a-zA-Z ])/', $text );
		$sentences = preg_split('/(?<=[.?!。．！？])+/u', $text);
    $hashes = array();
    $uniqueSentences = array();
    $length = 0;
    foreach ( $sentences as $sentence ) {
      $sentence = preg_replace( '/^[\pZ\pC]+|[\pZ\pC]+$/u', '', $sentence );
      $hash = md5( $sentence );
      if ( !in_array( $hash, $hashes ) ) {
				$tokensCount = apply_filters( 'mwai_estimate_tokens', 0, $sentence );
        if ( $length + $tokensCount > $maxTokens ) {
          continue;
        }
        $hashes[] = $hash;
        $uniqueSentences[] = $sentence;
        $length += $tokensCount;
      }
    }
    $freshText = implode( " ", $uniqueSentences );
    $freshText = preg_replace( '/^[\pZ\pC]+|[\pZ\pC]+$/u', '', $freshText );
    return $freshText;
  }

	function getCleanPostContent( $postId ) {
		$post = get_post( $postId );
		if ( !$post ) {
			return false;
		}
		$post->post_content = apply_filters( 'the_content', $post->post_content );
		$text = $this->cleanText( $post->post_content );
		$text = $this->cleanSentences( $text );
		return $text;
	}

	function markdown_to_html( $content ) {
		$Parsedown = new Parsedown();
		$content = $Parsedown->text( $content );
		return $content;
	}

	function get_post_language( $postId ) {
		$locale = get_locale();
		$code = strtolower( substr( $locale, 0, 2 ) );
		$lang_codes = array(
			'aa' => 'Afar',
			'ab' => 'Abkhazian',
			'af' => 'Afrikaans',
			'ak' => 'Akan',
			'sq' => 'Albanian',
			'am' => 'Amharic',
			'ar' => 'Arabic',
			'an' => 'Aragonese',
			'hy' => 'Armenian',
			'as' => 'Assamese',
			'av' => 'Avaric',
			'ae' => 'Avestan',
			'ay' => 'Aymara',
			'az' => 'Azerbaijani',
			'ba' => 'Bashkir',
			'bm' => 'Bambara',
			'eu' => 'Basque',
			'be' => 'Belarusian',
			'bn' => 'Bengali',
			'bh' => 'Bihari',
			'bi' => 'Bislama',
			'bs' => 'Bosnian',
			'br' => 'Breton',
			'bg' => 'Bulgarian',
			'my' => 'Burmese',
			'ca' => 'Catalan; Valencian',
			'ch' => 'Chamorro',
			'ce' => 'Chechen',
			'zh' => 'Chinese',
			'cu' => 'Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic',
			'cv' => 'Chuvash',
			'kw' => 'Cornish',
			'co' => 'Corsican',
			'cr' => 'Cree',
			'cs' => 'Czech',
			'da' => 'Danish',
			'dv' => 'Divehi; Dhivehi; Maldivian',
			'nl' => 'Dutch; Flemish',
			'dz' => 'Dzongkha',
			'en' => 'English',
			'eo' => 'Esperanto',
			'et' => 'Estonian',
			'ee' => 'Ewe',
			'fo' => 'Faroese',
			'fj' => 'Fijjian',
			'fi' => 'Finnish',
			'fr' => 'French',
			'fy' => 'Western Frisian',
			'ff' => 'Fulah',
			'ka' => 'Georgian',
			'de' => 'German',
			'gd' => 'Gaelic; Scottish Gaelic',
			'ga' => 'Irish',
			'gl' => 'Galician',
			'gv' => 'Manx',
			'el' => 'Greek, Modern',
			'gn' => 'Guarani',
			'gu' => 'Gujarati',
			'ht' => 'Haitian; Haitian Creole',
			'ha' => 'Hausa',
			'he' => 'Hebrew',
			'hz' => 'Herero',
			'hi' => 'Hindi',
			'ho' => 'Hiri Motu',
			'hu' => 'Hungarian',
			'ig' => 'Igbo',
			'is' => 'Icelandic',
			'io' => 'Ido',
			'ii' => 'Sichuan Yi',
			'iu' => 'Inuktitut',
			'ie' => 'Interlingue',
			'ia' => 'Interlingua (International Auxiliary Language Association)',
			'id' => 'Indonesian',
			'ik' => 'Inupiaq',
			'it' => 'Italian',
			'jv' => 'Javanese',
			'ja' => 'Japanese',
			'kl' => 'Kalaallisut; Greenlandic',
			'kn' => 'Kannada',
			'ks' => 'Kashmiri',
			'kr' => 'Kanuri',
			'kk' => 'Kazakh',
			'km' => 'Central Khmer',
			'ki' => 'Kikuyu; Gikuyu',
			'rw' => 'Kinyarwanda',
			'ky' => 'Kirghiz; Kyrgyz',
			'kv' => 'Komi',
			'kg' => 'Kongo',
			'ko' => 'Korean',
			'kj' => 'Kuanyama; Kwanyama',
			'ku' => 'Kurdish',
			'lo' => 'Lao',
			'la' => 'Latin',
			'lv' => 'Latvian',
			'li' => 'Limburgan; Limburger; Limburgish',
			'ln' => 'Lingala',
			'lt' => 'Lithuanian',
			'lb' => 'Luxembourgish; Letzeburgesch',
			'lu' => 'Luba-Katanga',
			'lg' => 'Ganda',
			'mk' => 'Macedonian',
			'mh' => 'Marshallese',
			'ml' => 'Malayalam',
			'mi' => 'Maori',
			'mr' => 'Marathi',
			'ms' => 'Malay',
			'mg' => 'Malagasy',
			'mt' => 'Maltese',
			'mo' => 'Moldavian',
			'mn' => 'Mongolian',
			'na' => 'Nauru',
			'nv' => 'Navajo; Navaho',
			'nr' => 'Ndebele, South; South Ndebele',
			'nd' => 'Ndebele, North; North Ndebele',
			'ng' => 'Ndonga',
			'ne' => 'Nepali',
			'nn' => 'Norwegian Nynorsk; Nynorsk, Norwegian',
			'nb' => 'Bokmål, Norwegian, Norwegian Bokmål',
			'no' => 'Norwegian',
			'ny' => 'Chichewa; Chewa; Nyanja',
			'oc' => 'Occitan, Provençal',
			'oj' => 'Ojibwa',
			'or' => 'Oriya',
			'om' => 'Oromo',
			'os' => 'Ossetian; Ossetic',
			'pa' => 'Panjabi; Punjabi',
			'fa' => 'Persian',
			'pi' => 'Pali',
			'pl' => 'Polish',
			'pt' => 'Portuguese',
			'ps' => 'Pushto',
			'qu' => 'Quechua',
			'rm' => 'Romansh',
			'ro' => 'Romanian',
			'rn' => 'Rundi',
			'ru' => 'Russian',
			'sg' => 'Sango',
			'sa' => 'Sanskrit',
			'sr' => 'Serbian',
			'hr' => 'Croatian',
			'si' => 'Sinhala; Sinhalese',
			'sk' => 'Slovak',
			'sl' => 'Slovenian',
			'se' => 'Northern Sami',
			'sm' => 'Samoan',
			'sn' => 'Shona',
			'sd' => 'Sindhi',
			'so' => 'Somali',
			'st' => 'Sotho, Southern',
			'es' => 'Spanish; Castilian',
			'sc' => 'Sardinian',
			'ss' => 'Swati',
			'su' => 'Sundanese',
			'sw' => 'Swahili',
			'sv' => 'Swedish',
			'ty' => 'Tahitian',
			'ta' => 'Tamil',
			'tt' => 'Tatar',
			'te' => 'Telugu',
			'tg' => 'Tajik',
			'tl' => 'Tagalog',
			'th' => 'Thai',
			'bo' => 'Tibetan',
			'ti' => 'Tigrinya',
			'to' => 'Tonga (Tonga Islands)',
			'tn' => 'Tswana',
			'ts' => 'Tsonga',
			'tk' => 'Turkmen',
			'tr' => 'Turkish',
			'tw' => 'Twi',
			'ug' => 'Uighur; Uyghur',
			'uk' => 'Ukrainian',
			'ur' => 'Urdu',
			'uz' => 'Uzbek',
			've' => 'Venda',
			'vi' => 'Vietnamese',
			'vo' => 'Volapük',
			'cy' => 'Welsh',
			'wa' => 'Walloon',
			'wo' => 'Wolof',
			'xh' => 'Xhosa',
			'yi' => 'Yiddish',
			'yo' => 'Yoruba',
			'za' => 'Zhuang; Chuang',
			'zu' => 'Zulu',
		);
		$language = strtr( $code, $lang_codes );
		$lang = apply_filters( 'wpml_post_language_details', null, $postId );
		if ( !empty( $lang ) ) {
			$language = $lang['display_name'];
		}
		return strtolower( $language );
	}
	#endregion

	#region Users/Sessions Helpers

	function get_session_id() {
		if ( isset( $_COOKIE['mwai_session_id'] ) ) {
			return $_COOKIE['mwai_session_id'];
		}
		return "N/A";
	}

	// Get the UserID from the data, or from the current user
  function get_user_id( $data = null ) {
    if ( isset( $data ) && isset( $data['userId'] ) ) {
      return (int)$data['userId'];
    }
    if ( is_user_logged_in() ) {
      $current_user = wp_get_current_user();
      if ( $current_user->ID > 0 ) {
        return $current_user->ID;
      }
    }
    return null;
  }

	function get_ip_address( $data = null ) {
    if ( isset( $data ) && isset( $data['ip'] ) ) {
      $data['ip'] = (string)$data['ip'];
    }
    else {
      if ( isset( $_SERVER['REMOTE_ADDR'] ) ) {
        $data['ip'] = sanitize_text_field( $_SERVER['REMOTE_ADDR'] );
      }
      else if ( isset( $_SERVER['HTTP_CLIENT_IP'] ) ) {
        $data['ip'] = sanitize_text_field( $_SERVER['HTTP_CLIENT_IP'] );
      }
      else if ( isset( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
        $data['ip'] = sanitize_text_field( $_SERVER['HTTP_X_FORWARDED_FOR'] );
      }
    }
    return $data['ip'];
  }

	#endregion

	#region Other Helpers

	function isUrl( $url ) {
		return strpos( $url, 'http' ) === 0 ? true : false;
	}

	function getPostTypes() {
		$excluded = array( 'attachment', 'revision', 'nav_menu_item' );
		$post_types = array();
		$types = get_post_types( array( 'public' => true ), 'objects' );
		foreach ( $types as $type ) {
			if ( in_array( $type->name, $excluded ) ) {
				continue;
			}
			$post_types[] = array(
				'name' => $type->labels->name,
				'type' => $type->name,
			);
		}
		return $post_types;
	}

	#endregion

	#region Usage & Costs

	public function dynamic_max_tokens( $tokens, $text ) {
		// Approximation (fast, no lib)
    $asciiCount = 0;
    $nonAsciiCount = 0;
    for ( $i = 0; $i < mb_strlen( $text ); $i++ ) {
      $char = mb_substr( $text, $i, 1 );
      if ( ord( $char ) < 128 ) {
        $asciiCount++;
      }
      else {
        $nonAsciiCount++;
      }
    }
    $asciiTokens = $asciiCount / 3.5;
    $nonAsciiTokens = $nonAsciiCount * 2.5;
    $tokens = $asciiTokens + $nonAsciiTokens;

    // More exact (slower, and lib)
    if ( PHP_VERSION_ID >= 70400 && function_exists( 'mb_convert_encoding' ) ) {
      try {
        $token_array = Encoder::encode( $text );
        if ( !empty( $token_array ) ) {
          $tokens = count( $token_array );
        }
      }
      catch ( Exception $e ) {
        error_log( $e->getMessage() );
      }
    }

		$tokens = $tokens;
		return (int)$tokens;
	}

  public function record_tokens_usage( $model, $prompt_tokens, $completion_tokens = 0 ) {
    if ( !is_numeric( $prompt_tokens ) ) {
      throw new Exception( 'Record usage: prompt_tokens is not a number.' );
    }
    if ( !is_numeric( $completion_tokens ) ) {
      $completion_tokens = 0;
    }
    if ( !$model ) {
      throw new Exception( 'Record usage: model is missing.' );
    }
    $usage = $this->get_option( 'openai_usage' );
    $month = date( 'Y-m' );
    if ( !isset( $usage[$month] ) ) {
      $usage[$month] = array();
    }
    if ( !isset( $usage[$month][$model] ) ) {
      $usage[$month][$model] = array(
        'prompt_tokens' => 0,
        'completion_tokens' => 0,
        'total_tokens' => 0
      );
    }
    $usage[$month][$model]['prompt_tokens'] += $prompt_tokens;
    $usage[$month][$model]['completion_tokens'] += $completion_tokens;
    $usage[$month][$model]['total_tokens'] += $prompt_tokens + $completion_tokens;
    $this->update_option( 'openai_usage', $usage );
    return [
      'prompt_tokens' => $prompt_tokens,
      'completion_tokens' => $completion_tokens,
      'total_tokens' => $prompt_tokens + $completion_tokens
    ];
  }

  public function record_images_usage( $model, $resolution, $images ) {
    if ( !$model || !$resolution || !$images ) {
      throw new Exception( 'Missing parameters for record_image_usage.' );
    }
    $usage = $this->get_option( 'openai_usage' );
    $month = date( 'Y-m' );
    if ( !isset( $usage[$month] ) ) {
      $usage[$month] = array();
    }
    if ( !isset( $usage[$month][$model] ) ) {
      $usage[$month][$model] = array(
        'resolution' => array(),
        'images' => 0
      );
    }
    if ( !isset( $usage[$month][$model]['resolution'][$resolution] ) ) {
      $usage[$month][$model]['resolution'][$resolution] = 0;
    }
    $usage[$month][$model]['resolution'][$resolution] += $images;
    $usage[$month][$model]['images'] += $images;
    $this->update_option( 'openai_usage', $usage );
    return [
      'resolution' => $resolution,
      'images' => $images
    ];
  }

	#endregion

	#region Options
	function get_all_options() {
		$options = get_option( $this->option_name, null );
		foreach ( MWAI_OPTIONS as $key => $value ) {
			if ( !isset( $options[$key] ) ) {
				$options[$key] = $value;
			}
			if ( $key === 'languages' ) {
				// TODO: If we decide to make a set of options for languages, we can keep it in the settings
				$options[$key] = MWAI_LANGUAGES;
				$options[$key] = apply_filters( 'mwai_languages', $options[$key] );
			}
		}
		$options['shortcode_chat_default_params'] = MWAI_CHATBOT_PARAMS;
		$options['default_limits'] = MWAI_LIMITS;
		$options['openai_models'] = MWAI_OPENAI_MODELS;
		return $options;
	}

	// Validate and keep the options clean and logical.
	function sanitize_options() {
		$options = $this->get_all_options();
		$needs_update = false;

		// We can sanitize our future options here, let's always remember it.
		// Now, it is empty...

		if ( $needs_update ) {
			update_option( $this->option_name, $options, false );
		}
		return $options;
	}

	function update_options( $options ) {
		if ( !update_option( $this->option_name, $options, false ) ) {
			return false;
		}
		$options = $this->sanitize_options();
		return $options;
	}

	function update_option( $option, $value ) {
		$options = $this->get_all_options();
		$options[$option] = $value;
		return $this->update_options( $options );
	}

	function get_option( $option, $default = null ) {
		$options = $this->get_all_options();
		return $options[$option] ?? $default;
	}
	#endregion
}

?>