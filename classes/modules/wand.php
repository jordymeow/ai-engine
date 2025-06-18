<?php

class Meow_MWAI_Modules_Wand
{
  private $core;

  public static $features = [
    'correctText' => [
      'label' => 'Correct Text',
      'sublabel' => 'Grammar & Spelling',
      'arguments' => ['postId', 'text'],
      'where' => 'blockContext',
      'group' => 'first'
    ],
    'enhanceText' => [
      'label' => 'Enhance Text',
      'sublabel' => 'Readibility & Quality',
      'arguments' => ['postId', 'text'],
      'where' => 'blockContext',
      'group' => 'first'
    ],
    'longerText' => [
      'label' => 'Longer Text',
      'sublabel' => 'Readibility',
      'arguments' => ['postId', 'text'],
      'where' => 'blockContext',
      'group' => 'first'
    ],
    'shorterText' => [
      'label' => 'Shorter Text',
      'sublabel' => 'Readibility',
      'arguments' => ['postId', 'text'],
      'where' => 'blockContext',
      'group' => 'first'
    ],
    'translateText' => [
      'label' => 'Translate Text',
      'sublabel' => 'To Post Language',
      'arguments' => ['postId', 'text', 'language'],
      'where' => 'blockContext',
      'group' => 'first'
    ],
    'translateSection' => [
      'label' => 'Translate Post',
      'sublabel' => 'To Post Language',
      'arguments' => ['postId', 'text', 'context'],
      'where' => 'postContext', // We should probably handle this dynamically on the front-side
      'group' => 'first' // This is random
    ],
    'suggestSynonyms' => [
      'label' => 'Suggest Synonyms',
      'sublabel' => 'For Selected Words',
      'arguments' => ['postId', 'text', 'selectedText'],
      'where' => 'blockContext',
      'group' => 'second'
    ],
    'generateImage' => [
      'label' => 'Generate Image',
      'sublabel' => 'For This Text',
      'arguments' => ['postId', 'text'],
      'where' => 'blockContext',
      'group' => 'third'
    ],
    'suggestExcerpts' => [
      'label' => 'Suggest Excerpts',
      'sublabel' => 'Generate SEO-Optimized Excerpts',
      'arguments' => ['postId'],
      'where' => 'postActions'
    ],
    'suggestTitles' => [
      'label' => 'Suggest Titles',
      'sublabel' => 'Generate SEO-Optimized Titles',
      'arguments' => ['postId'],
      'where' => 'postActions'
    ]
  ];

  public function __construct( $core )
  {
    $this->core = $core;
    $this->register_filters();
  }

  private function register_filters()
  {
    foreach ( self::$features as $action => $feature ) {
      add_filter( 'mwai_magic_wand_' . $action, [ $this, 'action_' . $action ], 10, 2 );
    }
  }

  /**
   * Common method to process text actions (e.g., correct, enhance, lengthen, shorten text).
   * 
   * @param array $arguments The arguments provided for the action.
   * @param string $messagePrefix The prefix for the message to be set in the query.
   * @return array The result of the text processing.
   */
  private function processTextAction( $arguments, $messagePrefix )
  {
    $postId = $arguments['postId'];
    $isJson = isset( $arguments['json'] ) && !empty( $arguments['json'] );
    $blockType = isset( $arguments['blockType'] ) ? $arguments['blockType'] : null;
    
    if ( $isJson ) {
      // Handle structured JSON data for complex blocks
      $jsonData = $arguments['json'];
      $text = json_encode( $jsonData, JSON_PRETTY_PRINT );
      
      // Add specific instructions for JSON handling
      $jsonInstructions = "\n\nIMPORTANT: The input is JSON data. You must return ONLY valid JSON (no markdown, no code blocks, no explanations). Return the EXACT SAME JSON structure, only modifying the text content within it.";
      
      if ( $blockType === 'core/list' ) {
        $jsonInstructions .= " This is a list with 'type' and 'items' fields. Return: {\"type\": \"list\", \"items\": [...modified items...]}";
      } elseif ( $blockType === 'core/table' ) {
        $jsonInstructions .= " This is a table with 'type' and 'rows' fields. Each row has a 'cells' array. Return: {\"type\": \"table\", \"rows\": [{\"cells\": [...modified cells...]}, ...]}";
      }
      
      $messagePrefix .= $jsonInstructions;
    } else {
      // Handle regular text
      $text = $arguments['text'];
    }
    
    $query = new Meow_MWAI_Query_Text( "", 1024 );
    $query->set_scope( 'admin-tools' );
    $language = $keepLanguage = "";
    if ( !empty( $postId ) ) {
      $language = $this->core->get_post_language( $postId );
      $keepLanguage = " Ensure the reply is in the same language as the original text ({$language}).";
    }
    $query->set_message( $messagePrefix . $keepLanguage . "\n\n" . $text );
    $reply = $this->core->run_query( $query );
    
    $result = $reply->result;
    $responseType = 'text';
    
    // If we sent JSON, we must get JSON back
    if ( $isJson ) {
      // First, try to extract JSON from markdown code blocks if present
      $jsonPattern = '/```(?:json)?\s*\n?(.+?)\n?```/s';
      if ( preg_match( $jsonPattern, $result, $matches ) ) {
        $result = trim( $matches[1] );
      }
      
      // Now parse the JSON
      $parsedJson = json_decode( $result, true );
      if ( json_last_error() === JSON_ERROR_NONE ) {
        // Validate that the JSON has the expected structure
        if ( $blockType === 'core/list' && isset( $parsedJson['type'] ) && $parsedJson['type'] === 'list' && isset( $parsedJson['items'] ) ) {
          $result = $parsedJson;
          $responseType = 'json';
        } elseif ( $blockType === 'core/table' && isset( $parsedJson['type'] ) && $parsedJson['type'] === 'table' && isset( $parsedJson['rows'] ) ) {
          $result = $parsedJson;
          $responseType = 'json';
        } else {
          // JSON is valid but doesn't match expected structure
          error_log( 'AI Engine: JSON response does not match expected structure for block type: ' . $blockType );
          throw new Exception( 'Invalid JSON structure returned by AI' );
        }
      } else {
        // JSON parsing failed
        error_log( 'AI Engine: Failed to parse AI response as JSON. Error: ' . json_last_error_msg() );
        error_log( 'AI Engine: Raw response: ' . $result );
        throw new Exception( 'AI did not return valid JSON' );
      }
    }

    return [
      'mode' => 'replace',
      'type' => $responseType,
      'result' => $result,
      'results' => $reply->results
    ];
  }

  /**
   * Handles the correction of text by checking and correcting grammatical errors.
   */
  public function action_correctText( $value, $arguments )
  {
    $prompt = apply_filters( 'mwai_prompt_correctText', "Correct the typos and grammar mistakes in this text without altering its content. Ensure the reply is in the same language as the original text.\n\n", $arguments );
    return $this->processTextAction( $arguments, $prompt );
  }

  /**
   * Enhances the text's readability and quality.
   */
  public function action_enhanceText( $value, $arguments )
  {
    $prompt = apply_filters( 'mwai_prompt_enhanceText', "Enhance this text by improving readability and quality, using a more suitable vocabulary, and refining its structure.\n\n", $arguments );
    return $this->processTextAction( $arguments, $prompt );
  }

  /**
   * Lengthens the text to improve readability.
   */
  public function action_longerText( $value, $arguments ) {
    $prompt = apply_filters( 'mwai_prompt_longerText', "Expand the subsequent text to a minimum of three times its original length, integrating relevant and accurate information to enrich its content. If the text is a story, amplify its charm by elaborating on essential aspects, enhancing readability, and creating a sense of engagement for the reader. Maintain consistency in tone and vocabulary throughout the expansion process.\n\n", $arguments );
    return $this->processTextAction( $arguments, $prompt );
  }

  /**
   * Shortens the text to improve readability.
   */
  public function action_shorterText( $value, $arguments ) {
    $prompt = apply_filters( 'mwai_prompt_shorterText', "Condense the following text by reducing its length to half, while retaining the core elements of the original narrative. Focus on maintaining the essence of the story and its key details.\n\n", $arguments );
    return $this->processTextAction( $arguments, $prompt );
  }

  /**
   * Suggests synonyms for selected words in the text.
   */
  public function action_suggestSynonyms( $value, $arguments ) {
    $postId = $arguments['postId'];
    $selectedText = $arguments['selectedText'];
    $query = new Meow_MWAI_Query_Text( "", 1024 );
    $query->set_scope( 'admin-tools' );
    $language = $keepLanguage = "";
    if ( !empty( $postId ) ) {
      $language = $this->core->get_post_language( $postId );
      $keepLanguage = " Ensure the reply is in the same language as the original text ({$language}).";
    }
    $prompt = apply_filters( 'mwai_prompt_suggestSynonyms', "Provide 5 synonyms or 5 ways of rephrasing the given word or sentence while retaining the original meaning and preserving the initial and final punctuation and spacing if any. Offer only the resulting word or expression, without additional context. If a suitable synonym or alternative cannot be identified, ensure that a creative response is still provided. Separate every suggestion with a new line, and that's it." . $keepLanguage . "\n\n", $arguments );
    $query->set_message( $prompt . $selectedText );
    $query->set_temperature( 1 );
    $reply = $this->core->run_query( $query );
    $lines = explode( "\n", $reply->result );
    $results = [];
    foreach ( $lines as $line ) {
      if ( !empty( $line ) ) {
        $results[] = $line;
      }
    }
    return [
      'mode' => 'suggest',
      'type' => $reply->type,
      'result' => $results[0] ?? '',
      'results' => $results
    ];
  }

  /**
   * Generates an image relevant to the text.
   */
  public function action_generateImage( $value, $arguments ) {
    global $mwai;
    $postId = $arguments['postId'];
    $text = $arguments['text'];
    $prompt = apply_filters( 'mwai_prompt_generateImage', "Generate an image that is relevant to the following text:\n\n", $arguments );
    $message = $prompt . $text;
    $media = $mwai->imageQueryForMediaLibrary( $message, $params = [], $postId );
    return [
      'mode' => 'insertMedia',
      'type' => 'image',
      'media' => $media
    ];
  }

  /**
   * Translates the specified text of text to the target language.
   *
   * @param mixed $value Unused parameter
   * @param array $arguments Contains postId, text, and context
   * @return array Translation result
   */
  public function action_translateSection( $value, $arguments ) {
    $postId = $arguments['postId'];
    $text = $arguments['text'];

    if (empty($text)) {
      return [
        'mode' => 'replace',
        'type' => 'text',
        'result' => '',
        'results' => []
      ];
    }

    $context = $arguments['context'];
    $targetLanguage = $this->core->get_post_language($postId);
    $query = new Meow_MWAI_Query_Text("", 1024);
    $query->set_scope('admin-tools');
    $prompt = "Translate the following section into {$targetLanguage}:\n\n" .
      "[SECTION TO TRANSLATE]\n{$text}\n[END SECTION TO TRANSLATE]\n\n" .
      "Translation guidelines:\n" .
      "1. Maintain the original tone, mood, and nuance.\n" .
      "2. Preserve the intended meaning as accurately as possible.\n" .
      "3. Ensure the translation fits seamlessly within the broader context.\n" .
      "4. Use appropriate idiomatic expressions in the target language when applicable.\n" .
      "5. Maintain any formatting or special characters present in the original text.\n\n" .
      "Broader context (for reference only, do not translate):\n\n" .
      "[CONTEXT]\n{$context}\n[END CONTEXT]\n\n" .
      "Provide only the translated section, between the markers [TRANSLATED SECTION] and [END TRANSLATED SECTION], without any additional content. Do not include the markers [TRANSLATED SECTION] and [END TRANSLATED SECTION] in your reply!\n\n";
    $prompt = apply_filters('mwai_prompt_translateSection', $prompt, $arguments);
    $query->set_message($prompt);
    $reply = $this->core->run_query($query);

    // Clean up the result, just in case...
    $result = $reply->result;
    $result = str_replace('[TRANSLATED SECTION]', '', $result);
    $result = str_replace('[END TRANSLATED SECTION]', '', $result);
    $result = trim($result);
    $results = [];
    foreach ($reply->results as $r) {
      $r = str_replace('[TRANSLATED SECTION]', '', $r);
      $r = str_replace('[END TRANSLATED SECTION]', '', $r);
      $r = trim($r);
      $results[] = $r;
    }

    return [
      'mode' => 'replace',
      'type' => $reply->type,
      'result' => $result,
      'results' => $results
    ];
  }

  /**
   * Translates the text to the specified language.
   */
  public function action_translateText( $value, $arguments ) {
    $postId = $arguments['postId'];
    $text = $arguments['text'];
    $language = $this->core->get_post_language( $postId );
    $query = new Meow_MWAI_Query_Text( "", 1024 );
    $query->set_scope( 'admin-tools' );
    $prompt = apply_filters( 'mwai_prompt_translateText', "Translate the text into {$language}, preserving the tone, mood, and nuance, while staying as true as possible to the original meaning. Provide only the translated text, without any additional content.\n\n", $arguments );
    $query->set_message( $prompt . $text );
    $reply = $this->core->run_query( $query );
    return [
      'mode' => 'replace',
      'type' => $reply->type,
      'result' => $reply->result,
      'results' => $reply->results
    ];
  }

  /**
   * Suggests SEO-optimized excerpts for the text.
   */
  public function action_suggestExcerpts( $value, $arguments ) {
    $postId = $arguments['postId'];
    $text = $this->core->get_post_content( $postId );
    $query = new Meow_MWAI_Query_Text( "", 1024 );
    $query->set_scope( 'admin-tools' );
    $prompt = apply_filters( 'mwai_prompt_suggestExcerpts', "Craft a clear, SEO-optimized introduction for the following text, using 120 to 170 characters. Ensure the introduction is concise and relevant, without including any URLs.\n\n", $arguments );
    $query->set_message( $prompt . $text );
    $query->set_max_results( 5 );
    $reply = $this->core->run_query( $query );
    return [
      'mode' => 'suggest',
      'type' => $reply->type,
      'result' => $reply->result,
      'results' => $reply->results
    ];
  }

  /**
   * Suggests SEO-optimized titles for the text.
   */
  public function action_suggestTitles( $value, $arguments ) {
    $postId = $arguments['postId'];
    $text = $this->core->get_post_content( $postId );
    $query = new Meow_MWAI_Query_Text( "", 1024 );
    $query->set_scope( 'admin-tools' );
    $prompt = apply_filters( 'mwai_prompt_suggestTitles', "Generate a concise, SEO-optimized title for the following text, without using quotes or any other formatting. Focus on clarity and relevance to the content.\n\n", $arguments );
    $query->set_message( $prompt . $text );
    $query->set_max_results( 5 );
    $reply = $this->core->run_query( $query );
    return [
      'mode' => 'suggest',
      'type' => $reply->type,
      'result' => $reply->result,
      'results' => $reply->results
    ];
  }
}
