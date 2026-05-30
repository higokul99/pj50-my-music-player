<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AlbumResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'title'        => $this->title,
            'artist_id'    => $this->artist_id,
            'release_year' => $this->release_year,
            'cover_image'  => $this->cover_image,
            'artist'       => $this->whenLoaded('artist', fn() => [
                'id'   => $this->artist->id,
                'name' => $this->artist->name,
            ]),
        ];
    }
}
