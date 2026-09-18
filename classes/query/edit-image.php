<?php

class Meow_MWAI_Query_EditImage extends Meow_MWAI_Query_Image {
  public ?Meow_MWAI_Query_DroppedFile $mask = null;
  public ?int $mediaId = null;

  public function set_mask( Meow_MWAI_Query_DroppedFile $mask ): void {
    $this->mask = $mask;
  }

  public function set_media_id( int $mediaId ) {
    $this->mediaId = $mediaId;
  }

  #[\ReturnTypeWillChange]
  public function jsonSerialize(): array {
    $json = parent::jsonSerialize();
    if ( !empty( $this->mediaId ) ) {
      $json['mediaId'] = $this->mediaId;
    }
    return $json;
  }

  public function inject_params( array $params ): void {
    parent::inject_params( $params );
    $params = $this->convert_keys( $params );
    // Check both camelCase and snake_case
    $mediaId = $params['mediaId'] ?? $params['media_id'] ?? null;
    if ( !empty( $mediaId ) ) {
      $this->set_media_id( intval( $mediaId ) );
      // The id comes from the client, and this is the line that turns it into a file on disk and
      // hands the contents to the AI provider. Resolving it through the helper keeps the read
      // inside what the current user is allowed to see, so a private file or one attached to an
      // unpublished post cannot be pulled out by guessing an id. The REST route checks the same
      // thing before building this query; doing it here as well covers every other way in.
      try {
        $path = Meow_MWAI_Core::get_readable_attachment_path( $this->mediaId );
        $this->add_file( Meow_MWAI_Query_DroppedFile::from_path( $path, 'analysis' ) );
      }
      catch ( Exception $e ) {
        error_log( 'EditImage: mediaId ' . $this->mediaId . ' was not used: ' . $e->getMessage() );
      }
    }
    else {
      error_log( 'EditImage: No mediaId provided in params: ' . json_encode( $params ) );
    }
  }
}
