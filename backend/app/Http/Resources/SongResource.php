<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SongResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'duration'    => $this->duration,
            'file_path'   => $this->file_path,
            'cover_image' => $this->cover_image,
            'genre'       => $this->genre,
            'lyrics'      => $this->lyrics,
            'artist'      => $this->whenLoaded('artist', fn() => $this->artist ? [
                'id'   => $this->artist->id,
                'name' => $this->artist->name,
            ] : null),
            'album'       => $this->whenLoaded('album', fn() => $this->album ? [
                'id'    => $this->album->id,
                'title' => $this->album->title,
            ] : null),
            'artist_id'   => $this->artist_id,
            'album_id'    => $this->album_id,
            'user_id'     => $this->user_id,
            'is_favorite' => $this->isFavoritedBy(auth()->user()),
            'created_at'  => $this->created_at,
        ];
    }
}
