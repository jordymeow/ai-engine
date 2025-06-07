<?php

class Meow_MWAI_Modules_Search {
  private $core = null;
  private $namespace = 'mwai-ui/v1';

  public function __construct( $core ) {
    $this->core = $core;
    add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
    add_action( 'pre_get_posts', [ $this, 'pre_get_posts' ] );
    add_filter( 'the_posts', [ $this, 'filter_embeddings_search_results' ], 10, 2 );
    add_filter( 'get_search_query', [ $this, 'customize_search_display' ] );
    
    // Initialize search frontend settings if they don't exist
    $this->init_frontend_settings();
  }
  
  private function init_frontend_settings() {
    // Ensure frontend search settings exist with defaults
    if ( $this->core->get_option( 'search_frontend_method' ) === null ) {
      $this->core->update_option( 'search_frontend_method', 'wordpress' );
    }
    if ( $this->core->get_option( 'search_frontend_env_id' ) === null ) {
      $this->core->update_option( 'search_frontend_env_id', null );
    }
    if ( $this->core->get_option( 'search_website_context' ) === null ) {
      $this->core->update_option( 'search_website_context', 'This is a website with useful information and content.' );
    }
  }

  public function rest_api_init() {
    register_rest_route( $this->namespace, '/search', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_search' ],
      'permission_callback' => '__return_true'
    ] );
  }

  public function pre_get_posts( $query ) {
    if ( is_admin() || !$query->is_main_query() || !$query->is_search() ) {
      return;
    }
    $search = $query->get( 's' );
    if ( empty( $search ) ) {
      return;
    }
    
    // Get the frontend search method setting
    $frontend_method = $this->core->get_option( 'search_frontend_method', 'wordpress' );
    
    // If WordPress method is selected, do nothing (use default WordPress search)
    if ( $frontend_method === 'wordpress' ) {
      return;
    }
    
    // For Keywords method, use the full progressive search like admin
    if ( $frontend_method === 'keywords' ) {
      // Store the original search for later use
      $query->set( 'mwai_original_search', $search );
      // Set a unique search term that won't match anything - we'll handle this in the_posts filter
      $query->set( 's', 'MWAI_KEYWORDS_SEARCH_' . md5( $search ) );
      return;
    }
    
    // For Embeddings method, we need to handle this differently
    // Since we can't easily replace WordPress search with embeddings in pre_get_posts,
    // we'll modify the query to return no results and handle embeddings in template_redirect
    if ( $frontend_method === 'embeddings' ) {
      // Store the original search for later use
      $query->set( 'mwai_original_search', $search );
      // Set a unique search term that won't match anything
      $query->set( 's', 'MWAI_EMBEDDINGS_SEARCH_' . md5( $search ) );
    }
  }

  public function filter_embeddings_search_results( $posts, $query ) {
    // Only handle main search queries with our special markers
    if ( !$query->is_main_query() || !$query->is_search() || is_admin() ) {
      return $posts;
    }
    
    $search_term = $query->get( 's' );
    $original_search = $query->get( 'mwai_original_search' );
    
    // Check if this is our embeddings or keywords search
    if ( empty( $original_search ) || 
         ( strpos( $search_term, 'MWAI_EMBEDDINGS_SEARCH_' ) !== 0 && 
           strpos( $search_term, 'MWAI_KEYWORDS_SEARCH_' ) !== 0 ) ) {
      return $posts;
    }
    
    // Handle Keywords search
    if ( strpos( $search_term, 'MWAI_KEYWORDS_SEARCH_' ) === 0 ) {
      return $this->handle_frontend_keywords_search( $original_search, $query );
    }
    
    // Handle Embeddings search (existing logic below)
    if ( strpos( $search_term, 'MWAI_EMBEDDINGS_SEARCH_' ) !== 0 ) {
      return $posts;
    }
    
    // Get the frontend search method to double-check
    $frontend_method = $this->core->get_option( 'search_frontend_method', 'wordpress' );
    if ( $frontend_method !== 'embeddings' ) {
      return $posts;
    }
    
    // Get the embeddings environment ID
    $env_id = $this->core->get_option( 'search_frontend_env_id', null );
    if ( empty( $env_id ) ) {
      return $posts; // No environment selected, return empty
    }
    
    try {
      // Perform embeddings search
      $embedding_result = $this->search_with_embeddings( $original_search, $env_id );
      
      if ( isset( $embedding_result['error'] ) || empty( $embedding_result['post_ids'] ) ) {
        return []; // Return empty array if search failed or no results
      }
      
      // Get the post IDs from embeddings results
      $post_ids = array_map( function( $result ) {
        return $result['id'];
      }, $embedding_result['post_ids'] );
      
      if ( empty( $post_ids ) ) {
        return [];
      }
      
      // Get the actual post objects
      $embeddings_posts = get_posts( [
        'post__in' => $post_ids,
        'orderby' => 'post__in',
        'posts_per_page' => count( $post_ids ),
        'post_type' => 'post',
        'post_status' => 'publish'
      ] );
      
      // Update the query's found_posts count
      $query->found_posts = count( $embeddings_posts );
      $query->max_num_pages = 1;
      
      return $embeddings_posts;
      
    } catch ( Exception $e ) {
      error_log( 'AI Engine Search: Frontend embeddings search failed - ' . $e->getMessage() );
      return [];
    }
  }

  private function handle_frontend_keywords_search( $original_search, $query ) {
    // Get website context for keywords search
    $website_context = $this->core->get_option( 'search_website_context', '' );
    
    try {
      // Use the same search logic as the admin REST API
      $search_queries = $this->generate_keyword_tiers( $original_search, $website_context );
      $keyword_result = $this->search_with_keywords( $search_queries );
      
      if ( !empty( $keyword_result['results'] ) ) {
        // Extract post IDs from results
        $post_ids = array_map( function( $result ) {
          return $result['id'];
        }, $keyword_result['results'] );
        
        // Get the actual post objects
        $posts = get_posts( [
          'post__in' => $post_ids,
          'orderby' => 'post__in',
          'posts_per_page' => count( $post_ids ),
          'post_type' => 'post',
          'post_status' => 'publish'
        ] );
        
        // Update the query's found_posts count
        $query->found_posts = count( $posts );
        $query->max_num_pages = 1;
        
        return $posts;
      }
      
      // If no results with keywords, fallback to original search
      $fallback_posts = get_posts( [
        's' => $original_search,
        'posts_per_page' => 20,
        'post_type' => 'post',
        'post_status' => 'publish'
      ] );
      
      $query->found_posts = count( $fallback_posts );
      $query->max_num_pages = 1;
      
      return $fallback_posts;
      
    } catch ( Exception $e ) {
      error_log( 'AI Engine Search: Frontend keywords search failed - ' . $e->getMessage() );
      
      // Fallback to original search
      $fallback_posts = get_posts( [
        's' => $original_search,
        'posts_per_page' => 20,
        'post_type' => 'post',
        'post_status' => 'publish'
      ] );
      
      return $fallback_posts;
    }
  }

  private function get_site_context() {
    // Get all categories
    $categories = get_categories( [ 'hide_empty' => false ] );
    $category_names = array_map( function( $cat ) {
      return $cat->name;
    }, $categories );
    
    // Get all tags
    $tags = get_tags( [ 'hide_empty' => false ] );
    $tag_names = array_map( function( $tag ) {
      return $tag->name;
    }, $tags );
    
    return [
      'categories' => $category_names,
      'tags' => $tag_names
    ];
  }

  private function generate_keyword_tiers( $text, $website_context = '' ) {
    $context = $this->get_site_context();
    
    $message = "Generate 40 progressive search queries for: \"$text\"\n\n";
    
    if ( !empty( $website_context ) ) {
      $message .= "Website Context: " . $website_context . "\n\n";
    }
    
    if ( !empty( $context['categories'] ) ) {
      $message .= "Site Categories: " . implode( ', ', array_slice( $context['categories'], 0, 20 ) ) . "\n";
    }
    if ( !empty( $context['tags'] ) ) {
      $message .= "Site Tags: " . implode( ', ', array_slice( $context['tags'], 0, 20 ) ) . "\n";
    }
    
    $message .= "\nCreate 40 search queries optimized for WordPress search:\n";
    $message .= "- WordPress searches for EXACT WORDS in post content, not concepts\n";
    $message .= "- Use SIMPLE, COMMON words that authors actually write in posts\n";
    $message .= "- Avoid complex phrases, technical terms, or descriptive adjectives\n";
    $message .= "- Focus on core nouns, verbs, and basic adjectives\n";
    $message .= "- Consider the website context and categories\n";
    $message .= "- HIGH SCORES (100-70): 3 keywords that are really good matches\n";
    $message .= "- MEDIUM SCORES (69-31): 2 keywords for broader matches\n";
    $message .= "- LOW SCORES (30 and below): 1 keyword for broadest possible matches\n";
    $message .= "- Each line must be unique\n";
    $message .= "- Format exactly as: SCORE: keyword1 keyword2 keyword3\n";
    $message .= "- Do NOT add any other text, bullets, or formatting\n\n";
    
    $message .= "Example for 'funny adventure game' on a gaming website:\n";
    $message .= "100: funny adventure game\n";
    $message .= "97: adventure game comedy\n";
    $message .= "94: comedy adventure game\n";
    $message .= "91: funny game adventure\n";
    $message .= "88: adventure comedy game\n";
    $message .= "85: game adventure funny\n";
    $message .= "82: humor adventure game\n";
    $message .= "79: adventure game humor\n";
    $message .= "76: funny adventure quest\n";
    $message .= "73: comedy game adventure\n";
    $message .= "70: adventure game fun\n";
    $message .= "67: adventure game\n";
    $message .= "64: funny game\n";
    $message .= "61: comedy game\n";
    $message .= "58: adventure comedy\n";
    $message .= "55: game humor\n";
    $message .= "52: funny adventure\n";
    $message .= "49: adventure quest\n";
    $message .= "46: game comedy\n";
    $message .= "43: adventure story\n";
    $message .= "40: game fun\n";
    $message .= "37: funny story\n";
    $message .= "34: comedy quest\n";
    $message .= "31: adventure play\n";
    $message .= "30: adventure\n";
    $message .= "29: game\n";
    $message .= "28: funny\n";
    $message .= "27: comedy\n";
    $message .= "26: quest\n";
    $message .= "25: humor\n";
    $message .= "24: story\n";
    $message .= "23: play\n";
    $message .= "22: fun\n";
    $message .= "21: character\n";
    $message .= "20: world\n";
    $message .= "19: level\n";
    $message .= "18: puzzle\n";
    $message .= "17: island\n";
    $message .= "16: pirate\n";
    $message .= "15: monkey\n\n";
    
    $message .= "IMPORTANT: Generate EXACTLY 40 queries following this format. Start at 100 and decrease by 2-3 points each time.\n";
    $message .= "Now generate 40 queries for \"$text\":\n";
    
    $query = new Meow_MWAI_Query_Text( $message );
    $query->set_max_tokens( 2000 );  // Use max_tokens instead of max_results
    
    try {
      $reply = $this->core->run_query( $query );
      if ( !empty( $reply->result ) ) {
        $parsed = $this->parse_search_queries( $reply->result );
        if ( $parsed !== null ) {
          return $parsed;
        }
      }
    }
    catch ( Exception $e ) {
      error_log( 'AI Engine Search: Failed to generate search queries - ' . $e->getMessage() );
    }
    
    // Fallback
    return $this->fallback_keyword_tiers( $text );
  }

  private function parse_search_queries( $ai_response ) {
    $searches = [];
    
    
    $lines = explode( "\n", $ai_response );
    foreach ( $lines as $line ) {
      $line = trim( $line );
      if ( empty( $line ) ) continue;
      
      // Parse lines like "100: keyword1 keyword2 keyword3"
      // Also handle lines that might start with a dash or bullet
      $line = preg_replace( '/^[-•*]\s*/', '', $line );
      
      if ( preg_match( '/^(\d+)\s*:\s*(.+)$/', $line, $matches ) ) {
        $score = intval( $matches[1] );
        $keywords = trim( $matches[2] );
        
        if ( $score >= 0 && $score <= 100 && !empty( $keywords ) ) {
          $searches[] = [
            'score' => $score,
            'keywords' => $keywords
          ];
        }
      }
    }
    
    // If we got good results, return them
    if ( count( $searches ) >= 5 ) {
      // Sort by score descending
      usort( $searches, function( $a, $b ) {
        return $b['score'] <=> $a['score'];
      } );
      return $searches;
    }
    
    // Otherwise use fallback
    return null;
  }

  private function fallback_keyword_tiers( $text ) {
    // Extract meaningful words
    $words = str_word_count( strtolower( $text ), 1 );
    
    // Remove stop words
    $stop_words = [ 'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'she', 'it', 'they',
                    'want', 'need', 'like', 'love', 'to', 'a', 'an', 'the', 'with', 'is',
                    'for', 'of', 'and', 'or', 'but', 'in', 'on', 'at', 'which', 'that' ];
    
    $meaningful = array_diff( $words, $stop_words );
    $meaningful = array_values( $meaningful );
    
    // Synonyms for common terms - focused on actual search intent
    $synonyms = [
      'game' => ['games', 'gaming', 'play', 'gameplay'],
      'space' => ['galaxy', 'universe', 'cosmic', 'stellar', 'sci-fi'],
      'funny' => ['humor', 'comedy', 'fun', 'humorous'],
      'adventure' => ['quest', 'journey', 'exploration', 'story'],
      'huge' => ['large', 'big', 'massive', 'vast'],
      'world' => ['universe', 'realm', 'map', 'environment']
    ];
    
    // Create 40 search queries directly for better fallback
    $search_queries = [];
    $score = 100;
    
    // If we have no meaningful words, use the original text
    if ( empty( $meaningful ) ) {
      $meaningful = $words;
      if ( empty( $meaningful ) ) {
        // Last resort: split the original text
        $meaningful = explode( ' ', $text );
      }
    }
    
    // First batch: exact words from query (100-85)
    if ( count( $meaningful ) >= 1 ) {
      // 4-5 keywords
      for ( $i = 0; $i < 5 && $score >= 85; $i++ ) {
        $keywords = [];
        shuffle( $meaningful );
        $num_keywords = min( 4 + rand(0, 1), count( $meaningful ) );
        $keywords = array_slice( $meaningful, 0, max( 1, $num_keywords ) );
        if ( count( $keywords ) >= 1 ) {
          $search_queries[] = [
            'score' => $score,
            'keywords' => implode( ' ', $keywords )
          ];
          $score -= 3;
        }
      }
    }
    
    // Second batch: mix exact with synonyms (84-60)
    $all_related = $meaningful;
    foreach ( $meaningful as $word ) {
      if ( isset( $synonyms[$word] ) ) {
        $all_related = array_merge( $all_related, array_slice( $synonyms[$word], 0, 2 ) );
      }
    }
    $all_related = array_unique( $all_related );
    
    for ( $i = 0; $i < 15 && $score >= 60; $i++ ) {
      shuffle( $all_related );
      $num_keywords = 3 + rand( 0, 1 );
      $keywords = array_slice( $all_related, 0, min( $num_keywords, count( $all_related ) ) );
      if ( count( $keywords ) >= 2 ) {
        $search_queries[] = [
          'score' => $score,
          'keywords' => implode( ' ', $keywords )
        ];
        $score -= 2;
      }
    }
    
    // Third batch: fewer keywords (59-30)
    for ( $i = 0; $i < 20 && $score >= 30; $i++ ) {
      shuffle( $all_related );
      $keywords = array_slice( $all_related, 0, 2 );
      if ( count( $keywords ) >= 2 ) {
        $search_queries[] = [
          'score' => $score,
          'keywords' => implode( ' ', $keywords )
        ];
        $score -= 2;
      }
    }
    
    // If we couldn't generate any searches, create at least one with the original text
    if ( empty( $search_queries ) ) {
      $search_queries[] = [
        'score' => 100,
        'keywords' => $text
      ];
    }
    
    // Return search queries in same format as AI would generate
    return array_slice( $search_queries, 0, 40 );
  }

  private function create_search_combinations( $searches, $max_searches = 40 ) {
    // If we have AI-generated searches, use them directly
    if ( is_array( $searches ) && !empty( $searches ) && isset( $searches[0] ) && isset( $searches[0]['keywords'] ) ) {
      $combinations = [];
      foreach ( $searches as $search ) {
        // Skip empty keywords
        if ( !empty( trim( $search['keywords'] ) ) ) {
          $combinations[] = [
            'keywords' => $search['keywords'],
            'score' => $search['score'],
            'strategy' => 'ai_generated'
          ];
        }
        if ( count( $combinations ) >= $max_searches ) {
          break;
        }
      }
      // If we have some combinations, return them
      if ( !empty( $combinations ) ) {
        return $combinations;
      }
    }
    
    // Otherwise, this is the fallback format, generate combinations
    $tiers = $searches;
    $combinations = [];
    $exact = $tiers['exact'] ?? [];
    $contextual = $tiers['contextual'] ?? [];
    $general = $tiers['general'] ?? [];
    
    // Simple fallback algorithm
    $search_count = 0;
    
    // Mix of different combinations - start at 100
    $strategies = [
      [ 'exact' => 4, 'score' => 100 ],
      [ 'exact' => 3, 'score' => 90 ],
      [ 'exact' => 2, 'contextual' => 2, 'score' => 80 ],
      [ 'exact' => 2, 'score' => 70 ],
      [ 'exact' => 1, 'contextual' => 2, 'score' => 60 ],
      [ 'contextual' => 2, 'score' => 50 ],
      [ 'exact' => 1, 'general' => 1, 'score' => 40 ],
      [ 'general' => 2, 'score' => 35 ]
    ];
    
    foreach ( $strategies as $strategy ) {
      for ( $i = 0; $i < 5 && $search_count < $max_searches; $i++ ) {
        $keywords = [];
        
        if ( isset( $strategy['exact'] ) && count( $exact ) >= $strategy['exact'] ) {
          shuffle( $exact );
          $keywords = array_merge( $keywords, array_slice( $exact, 0, $strategy['exact'] ) );
        }
        
        if ( isset( $strategy['contextual'] ) && count( $contextual ) >= $strategy['contextual'] ) {
          shuffle( $contextual );
          $keywords = array_merge( $keywords, array_slice( $contextual, 0, $strategy['contextual'] ) );
        }
        
        if ( isset( $strategy['general'] ) && count( $general ) >= $strategy['general'] ) {
          shuffle( $general );
          $keywords = array_merge( $keywords, array_slice( $general, 0, $strategy['general'] ) );
        }
        
        if ( count( $keywords ) >= 2 ) {
          $keywords_str = implode( ' ', $keywords );
          if ( !empty( trim( $keywords_str ) ) ) {
            $combinations[] = [
              'keywords' => $keywords_str,
              'score' => $strategy['score'] + rand( -5, 5 ),
              'strategy' => 'fallback'
            ];
            $search_count++;
          }
        }
      }
    }
    
    // If we have no combinations, create at least one from whatever we have
    if ( empty( $combinations ) ) {
      // Try to create a basic search from exact keywords
      if ( !empty( $exact ) ) {
        $combinations[] = [
          'keywords' => implode( ' ', array_slice( $exact, 0, 3 ) ),
          'score' => 50,
          'strategy' => 'fallback_emergency'
        ];
      }
      // Or from the original text
      else if ( is_string( $searches ) && !empty( trim( $searches ) ) ) {
        $combinations[] = [
          'keywords' => $searches, // This will be the original text in worst case
          'score' => 30,
          'strategy' => 'fallback_original'
        ];
      }
    }
    
    return array_slice( $combinations, 0, $max_searches );
  }

  private function get_combinations( $array, $length ) {
    if ( $length == 1 ) {
      return array_map( function( $el ) { return [ $el ]; }, $array );
    }
    
    $combinations = [];
    $array_length = count( $array );
    
    for ( $i = 0; $i < $array_length - $length + 1; $i++ ) {
      $head = array_slice( $array, $i, 1 );
      $tail_combinations = $this->get_combinations( array_slice( $array, $i + 1 ), $length - 1 );
      foreach ( $tail_combinations as $tail ) {
        $combinations[] = array_merge( $head, $tail );
      }
    }
    
    return $combinations;
  }

  private function search_with_keywords( $search_queries ) {
    $all_results = [];
    $searches_performed = 0;
    $max_searches = 40;
    $min_results_needed = 3;
    
    // Create search combinations with scores
    $search_combinations = $this->create_search_combinations( $search_queries, $max_searches );
    
    $debug_searches = [];
    
    foreach ( $search_combinations as $combination ) {
      $searches_performed++;
      $keywords = $combination['keywords'];
      $score = $combination['score'];
      $strategy = $combination['strategy'];
      
      // Record what we're searching
      $debug_searches[] = [
        'attempt' => $searches_performed,
        'keywords' => $keywords,
        'score' => $score,
        'strategy' => $strategy,
        'found' => 0
      ];
      
      // Perform the search
      $posts = get_posts( [
        's' => $keywords,
        'posts_per_page' => 10,
        'post_type' => 'post',
        'post_status' => 'publish',
        'fields' => 'ids'
      ] );
      
      if ( !empty( $posts ) ) {
        // Update found count
        $debug_searches[count($debug_searches) - 1]['found'] = count( $posts );
        
        // Add to results with score
        foreach ( $posts as $post_id ) {
          if ( !isset( $all_results[$post_id] ) ) {
            $all_results[$post_id] = [
              'id' => $post_id,
              'best_score' => $score,
              'found_with' => []
            ];
          } else {
            // Keep the best (highest) score
            if ( $score > $all_results[$post_id]['best_score'] ) {
              $all_results[$post_id]['best_score'] = $score;
            }
          }
          $all_results[$post_id]['found_with'][] = [
            'keywords' => $keywords,
            'score' => $score
          ];
        }
        
        // Stop if we have enough unique results
        if ( count( $all_results ) >= $min_results_needed ) {
          break;
        }
      }
      
      // Stop if we've done too many searches
      if ( $searches_performed >= $max_searches ) {
        break;
      }
    }
    
    // Sort results by score (highest first)
    uasort( $all_results, function( $a, $b ) {
      return $b['best_score'] <=> $a['best_score'];
    } );
    
    // Get full post data for results
    $final_results = [];
    $post_ids = array_keys( $all_results );
    
    if ( !empty( $post_ids ) ) {
      // Get posts but maintain our score order
      $posts_data = [];
      $posts = get_posts( [
        'post__in' => $post_ids,
        'posts_per_page' => 20,
        'post_type' => 'post',
        'post_status' => 'publish'
      ] );
      
      // Create a map for easy access
      foreach ( $posts as $post ) {
        $posts_data[$post->ID] = $post;
      }
      
      // Build results in score order
      foreach ( $post_ids as $post_id ) {
        if ( isset( $posts_data[$post_id] ) ) {
          $post = $posts_data[$post_id];
          $result_data = $all_results[$post_id];
          
          // Get the keywords that found this post with the best score
          $best_keywords = '';
          foreach ( $result_data['found_with'] as $found ) {
            if ( $found['score'] == $result_data['best_score'] ) {
              $best_keywords = $found['keywords'];
              break;
            }
          }
          
          $final_results[] = [
            'id' => $post->ID,
            'title' => get_the_title( $post ),
            'excerpt' => wp_trim_words( $post->post_content, 30 ),
            'score' => $result_data['best_score'] / 100, // Convert 0-100 to 0-1 for frontend consistency
            'found_with' => $best_keywords
          ];
        }
      }
    }
    
    return [
      'results' => $final_results,
      'debug' => [
        'total_searches' => $searches_performed,
        'keyword_tiers' => is_array( $search_queries ) && isset( $search_queries['exact'] ) ? $search_queries : null,
        'searches' => $debug_searches
      ]
    ];
  }

  private function search_with_embeddings( $search_text, $env_id = null ) {
    if ( !class_exists( 'MeowPro_MWAI_Embeddings' ) ) {
      return [ 'error' => 'Embeddings module not available' ];
    }
    
    // Validate environment exists
    if ( !$env_id ) {
      return [ 'error' => 'No embeddings environment selected' ];
    }
    
    $env = $this->core->get_embeddings_env( $env_id );
    if ( !$env ) {
      return [ 'error' => 'Invalid embeddings environment selected. Please select a valid environment.' ];
    }
    
    try {
      // Get the embeddings instance
      $embeddings = new MeowPro_MWAI_Embeddings( $this->core );
      
      // Use the query_vectors method which handles everything internally
      // Parameters: offset, limit, filters, sort
      $filters = [
        'envId' => $env_id,
        'search' => $search_text
      ];
      $result = $embeddings->query_vectors( 0, 20, $filters );
      
      $vectors = isset( $result['rows'] ) ? $result['rows'] : [];
      
      if ( empty( $vectors ) ) {
        return [ 
          'post_ids' => [],
          'debug' => [
            'total_vectors' => 0,
            'message' => 'No matching vectors found'
          ]
        ];
      }
      
      // Extract post IDs from results
      $post_ids = [];
      $debug_info = [];
      
      foreach ( $vectors as $vector ) {
        $debug_info[] = [
          'refId' => $vector['refId'] ?? 'unknown',
          'score' => $vector['score'] ?? 0,
          'type' => $vector['type'] ?? 'unknown',
          'title' => $vector['title'] ?? 'unknown'
        ];
        
        // Check if this is a post embedding
        if ( !empty( $vector['type'] ) && $vector['type'] === 'postId' && !empty( $vector['refId'] ) ) {
          $score = isset( $vector['score'] ) ? (float)$vector['score'] : 0;
          $post_ids[] = [
            'id' => (int)$vector['refId'],
            'score' => $score
          ];
        }
      }
      
      // Sort by score descending
      usort( $post_ids, function( $a, $b ) {
        return $b['score'] <=> $a['score'];
      } );
      
      return [
        'post_ids' => $post_ids,
        'debug' => [
          'total_vectors' => count( $vectors ),
          'filtered_posts' => count( $post_ids ),
          'sample_vectors' => array_slice( $debug_info, 0, 5 )
        ]
      ];
    }
    catch ( Exception $e ) {
      error_log( 'AI Engine Search: Embeddings search failed - ' . $e->getMessage() );
      return [ 'error' => 'Embeddings search failed: ' . $e->getMessage() ];
    }
  }

  public function rest_search( $request ) {
    $params = $request->get_json_params();
    $search = isset( $params['search'] ) ? sanitize_text_field( $params['search'] ) : '';
    $method = isset( $params['method'] ) ? $params['method'] : 'wordpress';
    $env_id = isset( $params['envId'] ) ? $params['envId'] : null;
    $website_context = isset( $params['websiteContext'] ) ? sanitize_text_field( $params['websiteContext'] ) : '';

    if ( empty( $search ) ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'Empty search' ], 400 );
    }

    $results = [];
    $debug_info = [];
    
    if ( $method === 'wordpress' ) {
      // Use standard WordPress search
      $posts = get_posts( [
        's' => $search,
        'posts_per_page' => 20,
        'post_type' => 'post',
        'post_status' => 'publish'
      ] );
      
      foreach ( $posts as $post ) {
        $results[] = [
          'id' => $post->ID,
          'title' => get_the_title( $post ),
          'excerpt' => wp_trim_words( $post->post_content, 30 )
        ];
      }
      
      $debug_info = [
        'method' => 'Standard WordPress search',
        'query' => $search,
        'found' => count( $posts )
      ];
    }
    elseif ( $method === 'embeddings' ) {
      // Search using embeddings
      $embedding_result = $this->search_with_embeddings( $search, $env_id );
      
      if ( isset( $embedding_result['error'] ) ) {
        return new WP_REST_Response( [
          'success' => false,
          'message' => $embedding_result['error'],
          'debug' => $embedding_result['debug'] ?? null
        ], 200 );
      }
      
      $debug_info = $embedding_result['debug'] ?? [];
      
      if ( !empty( $embedding_result['post_ids'] ) ) {
        $post_ids = array_map( function( $result ) {
          return $result['id'];
        }, $embedding_result['post_ids'] );
        
        $posts = get_posts( [
          'post__in' => $post_ids,
          'orderby' => 'post__in',
          'posts_per_page' => count( $post_ids ),
          'post_type' => 'post',
          'post_status' => 'publish'
        ] );
        
        // Map posts with their scores
        $score_map = [];
        foreach ( $embedding_result['post_ids'] as $result ) {
          $score_map[$result['id']] = $result['score'];
        }
        
        foreach ( $posts as $post ) {
          $results[] = [
            'id' => $post->ID,
            'title' => get_the_title( $post ),
            'excerpt' => wp_trim_words( $post->post_content, 30 ),
            'score' => $score_map[$post->ID] ?? 0
          ];
        }
      }
    } else {
      // Search using AI keywords with smart algorithm
      $search_queries = $this->generate_keyword_tiers( $search, $website_context );
      $keyword_result = $this->search_with_keywords( $search_queries );
      
      $results = $keyword_result['results'];
      $debug_info = $keyword_result['debug'];
    }
    
    $response = [
      'success' => true,
      'results' => $results,
      'method' => $method,
      'debug' => $debug_info
    ];
    
    return new WP_REST_Response( $response, 200 );
  }

  public function customize_search_display( $search_query ) {
    // Only customize on frontend search pages
    if ( is_admin() || !is_search() ) {
      return $search_query;
    }
    
    // Get the frontend search method setting
    $frontend_method = $this->core->get_option( 'search_frontend_method', 'wordpress' );
    
    // If using standard WordPress search, no customization needed
    if ( $frontend_method === 'wordpress' ) {
      return $search_query;
    }
    
    // Check if this was an AI-powered search by looking for our special markers
    global $wp_query;
    $current_search = $wp_query->get( 's' );
    $original_search = $wp_query->get( 'mwai_original_search' );
    
    // Check if current search is one of our AI search markers
    $is_keywords_search = strpos( $search_query, 'MWAI_KEYWORDS_SEARCH_' ) === 0;
    $is_embeddings_search = strpos( $search_query, 'MWAI_EMBEDDINGS_SEARCH_' ) === 0;
    
    // If we have an original search stored and this is an AI search, just return the original search
    if ( !empty( $original_search ) && ( $is_keywords_search || $is_embeddings_search ) ) {
      return $original_search;
    }
    
    return $search_query;
  }
}