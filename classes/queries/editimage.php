<?php

class Meow_MWAI_Query_EditImage extends Meow_MWAI_Query_Image {
    public ?Meow_MWAI_Query_DroppedFile $attachedFile = null;
    public ?int $mediaId = null;

    public function set_file( Meow_MWAI_Query_DroppedFile $file ): void {
        $this->attachedFile = $file;
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
        if ( !empty( $params['mediaId'] ) ) {
            $this->set_media_id( intval( $params['mediaId'] ) );
            $path = get_attached_file( $this->mediaId );
            if ( $path ) {
                $this->set_file( Meow_MWAI_Query_DroppedFile::from_path( $path, 'vision' ) );
            }
        }
    }
}
