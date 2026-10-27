<?php

// Automatic snapshots of AI Engine's settings, chatbots and themes, so a bad save, a reset or
// anything else that wipes them can be undone from Settings → Others → Maintenance.
//
// A snapshot is taken at most once a day: before the first settings change of the day, and when
// an administrator opens wp-admin. Old ones are thinned into a ladder (today, yesterday, two
// days, about a week, two weeks, a month, two months, three months), so about eight are kept.
// Each snapshot is its own option with autoload off: they never weigh on normal page loads.
class Meow_MWAI_Services_SettingsBackups {
  public const INDEX = 'mwai_settings_backups';
  public const PREFIX = 'mwai_settings_backup_';
  public const OPTIONS = [ 'mwai_options', 'mwai_chatbots', 'mwai_themes' ];
  public const MIN_GAP = 20 * HOUR_IN_SECONDS;
  // Upper bound of each age bucket, in days. One snapshot, the oldest, is kept per bucket.
  public const BUCKETS = [ 1, 2, 3, 10, 20, 45, 75, 120 ];

  public function __construct() {
    add_action( 'admin_init', [ $this, 'daily' ] );
  }

  public function daily() {
    if ( !current_user_can( 'manage_options' ) || wp_doing_ajax() ) {
      return;
    }
    $this->maybe_snapshot( 'daily' );
  }

  public function list(): array {
    $index = get_option( self::INDEX, [] );
    $index = is_array( $index ) ? $index : [];
    krsort( $index );
    $out = [];
    foreach ( $index as $time => $meta ) {
      $out[] = [ 'id' => (int) $time, 'time' => (int) $time, 'reason' => $meta['reason'] ?? '', 'size' => (int) ( $meta['size'] ?? 0 ) ];
    }
    return $out;
  }

  public function maybe_snapshot( string $reason ) {
    $index = get_option( self::INDEX, [] );
    $latest = is_array( $index ) && $index ? max( array_keys( $index ) ) : 0;
    if ( time() - $latest < self::MIN_GAP ) {
      return false;
    }
    return $this->snapshot( $reason );
  }

  public function snapshot( string $reason ) {
    $data = [];
    foreach ( self::OPTIONS as $name ) {
      wp_cache_delete( $name, 'options' );
      $data[ $name ] = get_option( $name, null );
    }
    // Nothing to keep on a fresh install, and an empty snapshot would only push a real one out.
    if ( empty( $data['mwai_options'] ) ) {
      return false;
    }
    $time = time();
    $index = get_option( self::INDEX, [] );
    $index = is_array( $index ) ? $index : [];
    while ( isset( $index[ $time ] ) ) {
      $time++;
    }
    // Stored as is (WordPress serializes it), not as JSON: a JSON round trip can change types
    // (a float, an object) and a restore must give back exactly what was saved.
    add_option( self::PREFIX . $time, $data, '', false );
    $index[ $time ] = [ 'reason' => $reason, 'size' => strlen( maybe_serialize( $data ) ) ];
    $index = $this->prune( $index );
    update_option( self::INDEX, $index, false );
    return $time;
  }

  public function restore( int $id ): bool {
    $data = get_option( self::PREFIX . $id, null );
    // Snapshots from the first builds were JSON strings.
    if ( is_string( $data ) ) {
      $data = json_decode( $data, true );
    }
    if ( !is_array( $data ) || empty( $data['mwai_options'] ) || !is_array( $data['mwai_options'] ) ) {
      return false;
    }
    // The state being replaced is itself kept, so a restore can be undone.
    $this->snapshot( 'before-restore' );
    foreach ( self::OPTIONS as $name ) {
      if ( array_key_exists( $name, $data ) && $data[ $name ] !== null ) {
        update_option( $name, $data[ $name ], $name !== 'mwai_options' );
        wp_cache_delete( $name, 'options' );
      }
    }
    return true;
  }

  private function prune( array $index ): array {
    krsort( $index );
    $now = time();
    $keep = [];
    $taken = [];
    // Newest first, so the first one seen in a bucket is the newest: keep the oldest instead,
    // by overwriting as we go. Before-restore snapshots are always kept for a week.
    foreach ( $index as $time => $meta ) {
      $age = ( $now - $time ) / DAY_IN_SECONDS;
      if ( ( $meta['reason'] ?? '' ) === 'before-restore' && $age < 7 ) {
        $keep[ $time ] = true;
        continue;
      }
      $bucket = null;
      foreach ( self::BUCKETS as $i => $max ) {
        if ( $age < $max ) {
          $bucket = $i;
          break;
        }
      }
      if ( $bucket === null ) {
        continue;
      }
      if ( isset( $taken[ $bucket ] ) ) {
        unset( $keep[ $taken[ $bucket ] ] );
      }
      $taken[ $bucket ] = $time;
      $keep[ $time ] = true;
    }
    foreach ( array_keys( $index ) as $time ) {
      if ( empty( $keep[ $time ] ) ) {
        delete_option( self::PREFIX . $time );
        unset( $index[ $time ] );
      }
    }
    return $index;
  }
}
