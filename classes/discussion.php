<?php

/**
 * Class Meow_MWAI_Discussion
 *
 * Represents a single discussion's data that can be passed to 
 * Meow_MWAI_Modules_Discussions::commit_discussion().
 */
class Meow_MWAI_Discussion {

  /**
   * Unique chat ID (required). If found, the discussion is updated; otherwise created.
   * @var string|null
   */
  public $chatId = null;

  /**
   * ID of the bot or UI. 
   * @var string|null
   */
  public $botId = null;

  /**
   * Array of messages (each message is typically [ 'role' => 'user'|'assistant', 'content' => '...' ]).
   * @var array
   */
  public $messages = [];

  /**
   * Additional arbitrary data (e.g., model, temperature, etc.).
   * @var array
   */
  public $extra = [];

  /**
   * (Optional) User ID of the discussion's owner.
   * @var int|null
   */
  public $userId = null;

  /**
   * (Optional) IP address if you track guests or sessions by IP.
   * @var string|null
   */
  public $ip = null;

  /**
   * (Optional) Title of the discussion.
   * @var string|null
   */
  public $title = null;

  /**
   * Constructor if you want to initialize some defaults.
   */
  public function __construct() {
    // No defaults by default. Fill them in as needed.
  }
}
