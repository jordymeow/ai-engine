<?php

class Meow_MWAI_Modules_ContentAware {

  function __construct() {
    add_filter( 'mwai_chatbot_params_before', array( $this, 'chatbot_params' ) );
  }

  function chatbot_params( $params ) {
    if ( !isset( $params['content_aware'] ) ) {
      return $params;
    }
    $post = get_post();
    if ( !empty( $post ) ) {
      // Before adding the content in the context, we should absolutely remove the HTML tags,
      // the shortcodes, and the empty lines. Then lines should be replaced by a textual "\n".
      $content = strip_tags( $post->post_content );
      $content = preg_replace( '/\[[^\]]+\]/', '', $content );
      $content = preg_replace( '/^\h*\v+/m', '', $content );
      $content = preg_replace( '/\v+/', "\\n", $content );
      $params['context'] = "Article:\\n\\n{***}\\n{$content}\\n{***}.\\n\\nDebate:\\n\\n";
      $params['start_sentence'] = "Is there anything you would like to discuss about this article?";
    }
    return $params;
  }
}
