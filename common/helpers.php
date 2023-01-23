<?php

if ( !class_exists( 'MeowCommon_Helpers' ) ) {

	class MeowCommon_Helpers {
	
		//public static $version = MeowCommon_Admin::version;
		private static $startTimes = array();
		private static $startQueries = array();

		static function is_divi_builder() {
			return isset( $_GET['et_fb'] ) && $_GET['et_fb'] === '1';
		}

		static function is_cornerstone_builder() {
			return isset( $_GET['cs-render'] ) && $_GET['cs-render'] === '1';
		}

		static function is_pagebuilder_request() {
			return self::is_divi_builder() || self::is_cornerstone_builder();
		}

		static function is_asynchronous_request() {
			return self::is_ajax_request() || self::is_woocommerce_ajax_request() || self::is_rest();
		}

		static function is_ajax_request() {
			return wp_doing_ajax();
		}

		static function is_woocommerce_ajax_request() {
			return !empty( $_GET['wc-ajax'] );
		}

		// Originally created by matzeeable, modified by jordymeow
		static function is_rest() {

			// WP_REST_Request init.
			$is_rest_request = defined('REST_REQUEST') && REST_REQUEST;
			if ( $is_rest_request ) {
				MeowCommon_Rest::init_once();
				return true;
			}

			// Plain permalinks.
			$prefix = rest_get_url_prefix();
			$request_contains_rest = isset( $_GET['rest_route'] ) && strpos( trim( $_GET['rest_route'], '\\/' ), $prefix , 0 ) === 0;
			if ( $request_contains_rest) {
				MeowCommon_Rest::init_once();
				return true;
			}		

			// It can happen that WP_Rewrite is not yet initialized, so better to do it.
			global $wp_rewrite;
			if ( $wp_rewrite === null ) { 
				$wp_rewrite = new WP_Rewrite();
			}
			$rest_url = wp_parse_url( trailingslashit( rest_url() ) );
			$current_url = wp_parse_url( add_query_arg( array() ) );
			if ( !$rest_url || !$current_url )
				return false;

			// URL Path begins with wp-json.
			if ( !empty( $current_url['path'] ) && !empty( $rest_url['path'] ) ) {
				$request_contains_rest = strpos( $current_url['path'], $rest_url['path'], 0 ) === 0;
				if ( $request_contains_rest) {
					MeowCommon_Rest::init_once();
					return true;
				}
			}

			return false;
		}

		static function test_error( $error = 'timeout', $diceSides = 1 ) {
			if ( rand( 1, $diceSides ) === 1 ) {
				if ( $error === 'timeout' ) {
					header("HTTP/1.0 408 Request Timeout");
					die();
				}
				else {
					trigger_error( "Error", E_USER_ERROR);
				}
			}
		}

		static function php_error_logs() {
			$errorpath = ini_get( 'error_log' );
			$output_lines = array();
			if ( !empty( $errorpath ) && file_exists( $errorpath ) ) {
				try {
					$file = new SplFileObject( $errorpath, 'r' );
					$file->seek( PHP_INT_MAX );
					$last_line = $file->key();
					$iterator = new LimitIterator( $file, $last_line > 3500 ? $last_line - 3500 : 0, $last_line );
					$lines = iterator_to_array( $iterator );
					$previous_line = null;
					foreach ( $lines as $line ) {

						// Parse the date
						$date = '';
						try {
							$dateArr = [];
							preg_match( '~^\[(.*?)\]~', $line, $dateArr );
							if ( isset( $dateArr[0] ) ) {
								$line = str_replace( $dateArr[0], '', $line );
								$line = trim( $line );
								$date = new DateTime( $dateArr[1] );
								$date = get_date_from_gmt( $date->format('Y-m-d H:i:s'), 'Y-m-d H:i:s' );
							}
							else {
								continue;
							}
						} 
						catch ( Exception $e ) {
							continue;
						}

						// Parse the error
						$type = '';
						if ( preg_match( '/PHP Fatal error/', $line ) ) {
							$line = trim( str_replace( 'PHP Fatal error:', '', $line ) );
							$type = 'fatal';
						}
						else if ( preg_match( '/PHP Warning/', $line ) ) {
							$line = trim( str_replace( 'PHP Warning:', '', $line ) );
							$type = 'warning';
						}
						else if ( preg_match( '/PHP Notice/', $line ) ) {
							$line = trim( str_replace( 'PHP Notice:', '', $line ) );
							$type = 'notice';
						}
						else if ( preg_match( '/PHP Parse error/', $line ) ) {
							$line = trim( str_replace( 'PHP Parse error:', '', $line ) );
							$type = 'parse';
						}
						else if ( preg_match( '/PHP Exception/', $line ) ) {
							$line = trim( str_replace( 'PHP Exception:', '', $line ) );
							$type = 'exception';
						}
						else {
							continue;
						}

						// Skip the error if is the same as before.
						if ( $line !== $previous_line ) {
							array_push( $output_lines, array( 'date' => $date, 'type' => $type, 'content' => $line ) );
							$previous_line = $line;
						}
					}
				}
				catch ( OutOfBoundsException $e ) {
					error_log( $e->getMessage() );
					return array();
				}
			}
			return $output_lines;

			// else {
			// 	$output_lines = array_reverse( $output_lines );
			// 	$html = '';
			// 	$previous = '';
			// 	foreach ( $output_lines as $line ) {
			// 		// Let's avoid similar errors, since it's not useful. We should also make this better
			// 		// and not only theck this depending on tie.
			// 		if ( preg_replace( '/\[.*\] PHP/', '', $previous ) !== preg_replace( '/\[.*\] PHP/', '', $line ) ) {
			// 			$html .=  $line;
			// 			$previous = $line;
			// 		}
			// 	}
			// 	return $html;
			// }
		}

		static function timer_start( $timerName = 'default' ) {
			MeowCommon_Helpers::$startQueries[ $timerName ] = get_num_queries();
			MeowCommon_Helpers::$startTimes[ $timerName ] = microtime( true );
		}

		static function timer_elapsed( $timerName = 'default' ) {
			return microtime( true ) - MeowCommon_Helpers::$startTimes[ $timerName ];
		}

		static function timer_log_elapsed( $timerName = 'default' ) {
			$elapsed = MeowCommon_Helpers::timer_elapsed( $timerName );
			$queries = get_num_queries() - MeowCommon_Helpers::$startQueries[ $timerName ];
			error_log( $timerName . ": " . $elapsed . "ms (" . $queries . " queries)" );
		}
	}

	// Asked by WP Security Team to remove this.

	// if ( MeowCommon_Helpers::is_rest() ) {
	// 	ini_set( 'display_errors', 0 );
	// }
}
