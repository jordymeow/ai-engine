<?php

class Meow_MWAI_UI {
  private $core = null;

  public function __construct() {
    global $mwai_core;
    $this->core = $mwai_core;
  }
}