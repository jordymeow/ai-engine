<?php

class Meow_MWAI_Modules_Statistics {
  private $core = null;
  private $namespace = 'ai-engine/v1';

  public function __construct() {
    global $mwai_core;
    $this->core = $mwai_core;
  }
}