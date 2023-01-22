<?php

class Meow_MWAI_QueryImage extends Meow_MWAI_Query {

  public function __construct( $prompt = "", $model = "dall-e" ) {
    $this->prompt = $prompt;
    $this->model = $model;
    $this->mode = "generation"; // could be generation, edit, variation
  }

}
