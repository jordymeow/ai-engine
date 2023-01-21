<?php

class Meow_MWAI_QueryImage extends Meow_MWAI_Query {

  public function __construct( $prompt = "", $model = "dall-e-davinci" ) {
    $this->prompt = $prompt;
    $this->model = $model;
    $this->type = "generation"; // could be edit, variation, or generatio
  }

}
