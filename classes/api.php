<?php

class Meow_MWAI_API {

  public function simpleTextQuery( $prompt, $options = array() ) {
    global $mwai_core;
		$query = new Meow_MWAI_QueryText( $prompt );
		$query->injectParams( $options );
		$answer = $mwai_core->ai->run( $query );
		return $answer->result;
	}

	public function moderationCheck( $text ) {
		global $mwai_core;
		$openai = new Meow_MWAI_OpenAI( $mwai_core );
		$res = $openai->moderate( $text );
		if ( !empty( $res ) && !empty( $res['results'] ) ) {
			return (bool)$res['results'][0]['flagged'];
		}
	}
}