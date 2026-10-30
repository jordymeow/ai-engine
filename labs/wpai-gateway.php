<?php
/**
 * WP AI Client Gateway — replaces the native provider classes in WP's
 * `AiClient::defaultRegistry()` with AI Engine-backed adapters, so every
 * `wp_ai_client_prompt()->using_provider(...)` call dispatches through
 * `Meow_MWAI_Core::run_query()` and lands in AI Engine's Insights.
 *
 * @package MeowApps
 */

class Meow_MWAI_Labs_WPAI_Gateway {

  /** Shared reference to AI Engine core (read-only for the model classes). */
  public static $core = null;

  public function __construct( $core ) {
    self::$core = $core;

    if ( ! class_exists( '\\WordPress\\AiClient\\AiClient' ) ) {
      return;
    }

    // Register after the native providers (init 20) and after WP's
    // `_wp_connectors_pass_default_keys_to_ai_client`, so our replacements
    // land last and stick.
    add_action( 'init', [ $this, 'register' ], 25 );

  }

  /** Mapping from AiClient provider id → AI Engine adapter class. */
  const ADAPTERS = [
    'anthropic'  => Meow_MWAI_Labs_WPAI_Gateway_Provider_Anthropic::class,
    'openai'     => Meow_MWAI_Labs_WPAI_Gateway_Provider_OpenAI::class,
    'google'     => Meow_MWAI_Labs_WPAI_Gateway_Provider_Google::class,
    'mistral'    => Meow_MWAI_Labs_WPAI_Gateway_Provider_Mistral::class,
    'openrouter' => Meow_MWAI_Labs_WPAI_Gateway_Provider_OpenRouter::class,
    'perplexity' => Meow_MWAI_Labs_WPAI_Gateway_Provider_Perplexity::class,
    'replicate'  => Meow_MWAI_Labs_WPAI_Gateway_Provider_Replicate::class,
    'ollama'     => Meow_MWAI_Labs_WPAI_Gateway_Provider_Ollama::class,
    'azure'      => Meow_MWAI_Labs_WPAI_Gateway_Provider_Azure::class,
  ];

  public function register(): void {
    try {
      require_once __DIR__ . '/wpai-gateway-availability.php';
      require_once __DIR__ . '/wpai-gateway-directory.php';
      require_once __DIR__ . '/wpai-gateway-model.php';
      require_once __DIR__ . '/wpai-gateway-image-model.php';
      require_once __DIR__ . '/wpai-gateway-providers.php';

      $registry = \WordPress\AiClient\AiClient::defaultRegistry();

      // Only fully take over when the Connectors takeover is in managed mode.
      // Otherwise, native provider plugins keep handling their own calls.
      $managed = get_option( Meow_MWAI_Labs_WPAI_Connectors::OPTION_MODE, 'observe' ) === 'managed';
      if ( ! $managed ) {
        return;
      }

      foreach ( self::ADAPTERS as $id => $adapter_class ) {
        $this->force_replace_provider( $registry, $id, $adapter_class );
      }
    }
    catch ( \Throwable $e ) {
      error_log( '[MWAI_WPAI_GATEWAY] registration failed: ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine() );
    }
  }

  /**
   * Replace a provider registration in AiClient, even if the id is already
   * taken by a native plugin. AiClient exposes no unregister method, so we
   * reach into the private registry state via reflection.
   */
  private function force_replace_provider( $registry, string $id, string $adapter_class ): void {
    try {
      $ref = new \ReflectionObject( $registry );

      // Scrub existing registration for this id (if any).
      if ( $registry->hasProvider( $id ) ) {
        foreach ( [ 'registeredIdsToClassNames', 'registeredClassNamesToIds', 'providerAuthenticationInstances' ] as $prop_name ) {
          if ( ! $ref->hasProperty( $prop_name ) ) {
            continue;
          }
          $prop = $ref->getProperty( $prop_name );
          $prop->setAccessible( true );
          $value = $prop->getValue( $registry );
          if ( $prop_name === 'registeredIdsToClassNames' ) {
            $old_class = $value[ $id ] ?? null;
            unset( $value[ $id ] );
            $prop->setValue( $registry, $value );
            if ( $old_class ) {
              // Also drop reverse map entries for the old class.
              foreach ( [ 'registeredClassNamesToIds', 'providerAuthenticationInstances' ] as $rev ) {
                if ( ! $ref->hasProperty( $rev ) ) {
                  continue;
                }
                $rp = $ref->getProperty( $rev );
                $rp->setAccessible( true );
                $rv = $rp->getValue( $registry );
                unset( $rv[ $old_class ] );
                $rp->setValue( $registry, $rv );
              }
            }
            break;
          }
        }
      }

      $registry->registerProvider( $adapter_class );
    }
    catch ( \Throwable $e ) {
      error_log( "[MWAI_WPAI_GATEWAY] replace $id failed: " . $e->getMessage() );
    }
  }
}
