<?php

class Meow_MWAI_API {

  public function simpleTextQuery( $prompt, $options = array() ) {
    global $mwai_core;
		$query = new Meow_MWAI_QueryText( $prompt );
		$query->injectParams( $options );
		$answer = $mwai_core->ai->run( $query );
		return $answer->result;
	}
}