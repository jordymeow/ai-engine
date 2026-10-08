<?php
/**
 * Model coverage audit for the dynamic-model engines (Google, OpenRouter, …).
 *
 * Those engines build their model list at "Refresh Models" time from the provider's own
 * API, then guess each model's nice name, features, tags and tools with a pile of
 * regexes. When a provider ships a new naming shape those regexes quietly miss, and the
 * model either vanishes from the dropdown or shows up without the capabilities it has.
 * That is invisible until a user complains, so this audits it.
 *
 * Run it from the WordPress root:
 *   wp eval-file labs/model-audit.php            # every dynamic engine
 *   wp eval-file labs/model-audit.php google     # one engine type
 *
 * Findings are heuristics, not verdicts. Read them, then check the provider's docs
 * before touching the regexes in classes/engines/<engine>.php.
 */

global $mwai;
$core = $mwai->core;
$only = $args[0] ?? null;

// Engines whose models come from the provider API rather than constants/models.php.
$dynamic_types = [ 'google', 'openrouter' ];

// Engines where WE build the display name from the raw id. OpenRouter hands us a curated
// name ("Google: Gemini 3 Flash Preview") and we pass it straight through, so the name
// heuristics below would flag every one of its models forever.
$formats_own_names = [ 'google' ];

$issues_total = 0;

foreach ( (array) $core->get_option( 'ai_envs' ) as $env ) {
  $type = $env['type'] ?? '';
  if ( !in_array( $type, $dynamic_types, true ) ) {
    continue;
  }
  if ( $only && $type !== $only ) {
    continue;
  }
  if ( empty( $env['apikey'] ) ) {
    echo "SKIP {$type} ({$env['name']}): no API key\n";
    continue;
  }

  echo "\n=== {$type} / {$env['name']} ===\n";

  try {
    $engine = Meow_MWAI_Engines_Factory::get( $core, $env['id'] );
    $models = $engine->retrieve_models();
  }
  catch ( Exception $e ) {
    echo "  ERROR: " . $e->getMessage() . "\n";
    continue;
  }

  echo "  models classified: " . count( $models ) . "\n";
  $issues = [];

  // 1. Duplicate display names. Google ships preview and GA variants of the same model
  // and the name formatter strips the suffix from both, which makes the dropdown
  // ambiguous. Anything still colliding here needs disambiguating.
  $by_name = [];
  foreach ( $models as $m ) {
    $by_name[$m['name']][] = $m['model'];
  }
  foreach ( $by_name as $name => $ids ) {
    if ( count( $ids ) > 1 ) {
      $issues[] = "duplicate name \"{$name}\" for: " . implode( ', ', $ids );
    }
  }

  // 2. Names that clearly fell through the formatter: still carrying a raw id, or a
  // lowercased fragment that should have become a proper word. Only meaningful for the
  // engines that format their own names.
  if ( in_array( $type, $formats_own_names, true ) ) {
    foreach ( $models as $m ) {
      if ( $m['name'] === $m['model'] ) {
        $issues[] = "unformatted name for {$m['model']} (name === id)";
      }
      else if ( preg_match( '/(preview|latest|exp|[0-9]{4}-[0-9]{2}|customtools|nano-banana)/i', $m['name'] )
        && !preg_match( '/\(/', $m['name'] ) ) {
        $issues[] = "raw id fragment left in name \"{$m['name']}\" ({$m['model']})";
      }
    }
  }

  // 3. Capability mismatches: the id advertises something the features do not.
  // These are the exact shapes that were silently wrong before 2026-07-26. Each engine
  // names its features in its own vocabulary (Google says 'image-generation', OpenRouter
  // says 'text-to-image'), so any one of the listed synonyms satisfies the expectation.
  $expectations = [
    // id pattern                => any one of these features is enough
    '/-image(-preview)?$|nano-banana/' => [ 'image-generation', 'text-to-image' ],
    '/embedding/'                      => [ 'embedding', 'embeddings' ],
    '/(native-audio|-live-)/'          => [ 'realtime' ],
    '/(veo|video)/'                    => [ 'video-generation', 'text-to-video' ],
  ];
  foreach ( $models as $m ) {
    $features = (array) ( $m['features'] ?? [] );
    foreach ( $expectations as $pattern => $accepted ) {
      if ( preg_match( $pattern, $m['model'] ) && !array_intersect( $accepted, $features ) ) {
        $issues[] = "{$m['model']} looks like '{$accepted[0]}' but features are: "
          . ( implode( ',', $features ) ?: '(none)' );
      }
    }
  }

  // 4. Models with no usable feature at all: they will render in the dropdown and then
  // fail at query time.
  foreach ( $models as $m ) {
    if ( empty( $m['features'] ) ) {
      $issues[] = "{$m['model']} has no features";
    }
  }

  // 5. Anything the provider exposes that never made it into the list. Only the engine
  // knows the raw payload, so this compares against the provider call where possible.
  if ( $type === 'google' ) {
    $res = wp_remote_get(
      'https://generativelanguage.googleapis.com/v1beta/models?pageSize=200&key=' . $env['apikey'],
      [ 'timeout' => 30 ]
    );
    if ( !is_wp_error( $res ) ) {
      $body = json_decode( wp_remote_retrieve_body( $res ), true );
      $classified = array_column( $models, 'model' );
      foreach ( (array) ( $body['models'] ?? [] ) as $raw ) {
        $id = str_replace( 'models/', '', $raw['name'] );
        $methods = (array) ( $raw['supportedGenerationMethods'] ?? [] );
        // Only care about ids we would plausibly want to offer.
        $wanted = preg_match( '/^(gemini|nano-banana|imagen|veo)/', $id )
          && ( in_array( 'generateContent', $methods, true ) || in_array( 'embedContent', $methods, true ) );
        // Deliberate exclusions: dated snapshots, TTS, robotics.
        $excluded = preg_match( '/-(tts|robotics)|(preview|exp)-\d{2}-\d{2,4}$|-\d{8}$/', $id );
        if ( $wanted && !$excluded && !in_array( $id, $classified, true ) ) {
          $issues[] = "provider exposes {$id} (" . implode( ',', $methods ) . ") but it was dropped";
        }
      }
    }
  }

  if ( empty( $issues ) ) {
    echo "  no issues found\n";
  }
  else {
    $issues = array_values( array_unique( $issues ) );
    $issues_total += count( $issues );
    foreach ( $issues as $i ) {
      echo "  ISSUE: {$i}\n";
    }
  }
}

// Static engines (OpenAI, Anthropic): their models are hardcoded in constants/models.php, so a
// new flagship stays invisible until someone adds it. GPT-6 Sol/Luna and Claude Opus/Sonnet 5.5
// went 8 to 11 days unlisted in 2026-09 until users noticed. Compare against the live lists.
$static = [
  'openai' => [ 'list' => MWAI_OPENAI_MODELS, 'url' => 'https://api.openai.com/v1/models' ],
  'anthropic' => [ 'list' => MWAI_ANTHROPIC_MODELS, 'url' => 'https://api.anthropic.com/v1/models?limit=100' ],
];
foreach ( $static as $type => $cfg ) {
  if ( $only && $type !== $only ) {
    continue;
  }
  $env = null;
  foreach ( (array) $core->get_option( 'ai_envs' ) as $e ) {
    if ( ( $e['type'] ?? '' ) === $type && !empty( $e['apikey'] ) ) {
      $env = $e;
      break;
    }
  }
  echo "\n== {$type} (static list vs live API)\n";
  if ( !$env ) {
    echo "  skipped: no {$type} environment with an API key\n";
    continue;
  }
  $headers = $type === 'openai'
    ? [ 'Authorization' => 'Bearer ' . $env['apikey'] ]
    : [ 'x-api-key' => $env['apikey'], 'anthropic-version' => '2023-06-01' ];
  $res = wp_remote_get( $cfg['url'], [ 'headers' => $headers, 'timeout' => 30 ] );
  if ( is_wp_error( $res ) || wp_remote_retrieve_response_code( $res ) !== 200 ) {
    echo "  unavailable: could not read the live model list (not a zero)\n";
    continue;
  }
  $listed = array_column( $cfg['list'], 'model' );
  $missing = [];
  foreach ( (array) ( json_decode( wp_remote_retrieve_body( $res ), true )['data'] ?? [] ) as $raw ) {
    $id = $raw['id'] ?? '';
    // Dated snapshots of a model we list by alias are not new models.
    $undated = preg_replace( '/-\d{8}$|-\d{4}-\d{2}-\d{2}$/', '', $id );
    if ( in_array( $id, $listed, true ) || ( $undated !== $id && in_array( $undated, $listed, true ) ) ) {
      continue;
    }
    // New releases only: the lists also carry every legacy model we chose not to offer
    // (gpt-3.5, gpt-4, o1, codex, dated snapshots), and a check full of known noise gets ignored.
    $created = isset( $raw['created'] ) ? (int) $raw['created'] : strtotime( $raw['created_at'] ?? '' );
    if ( !$created || $created < time() - 60 * DAY_IN_SECONDS || preg_match( '/-\d{4}-\d{2}-\d{2}$|-\d{8}$/', $id ) ) {
      continue;
    }
    if ( $type === 'openai' ) {
      // Chat models only: no audio, realtime, TTS, transcription, search, embeddings, images, codex.
      if ( !preg_match( '/^(gpt-\d|o\d)/', $id ) || preg_match( '/audio|realtime|tts|transcribe|search|image|embedding|instruct|codex/', $id ) ) {
        continue;
      }
    }
    $missing[] = $id;
  }
  if ( empty( $missing ) ) {
    echo "  no issues found\n";
    continue;
  }
  sort( $missing );
  $issues_total += count( $missing );
  foreach ( $missing as $id ) {
    echo "  ISSUE: provider offers {$id}, not in constants/models.php\n";
  }
}

echo "\nTOTAL ISSUES: {$issues_total}\n";
