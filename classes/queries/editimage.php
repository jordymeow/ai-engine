<?php

class Meow_MWAI_Query_EditImage extends Meow_MWAI_Query_Image {
    public ?Meow_MWAI_Query_DroppedFile $attachedFile = null;
    public ?Meow_MWAI_Query_DroppedFile $mask = null;
    public ?int $mediaId = null;

    public function set_file( Meow_MWAI_Query_DroppedFile $file ): void {
        $this->attachedFile = $file;
    }

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
            $path = get_attached_file( $this->mediaId );
            if ( $path ) {
                $this->set_file( Meow_MWAI_Query_DroppedFile::from_path( $path, 'vision' ) );
            } else {
                error_log( "EditImage: Could not find file for mediaId: " . $this->mediaId );
            }
        } else {
            error_log( "EditImage: No mediaId provided in params: " . json_encode( $params ) );
        }
    }
}
