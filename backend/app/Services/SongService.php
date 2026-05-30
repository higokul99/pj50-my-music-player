<?php

namespace App\Services;

use App\Repositories\SongRepository;
use App\Models\Artist;
use App\Models\Album;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SongService
{
    protected $songRepository;

    public function __construct(SongRepository $songRepository)
    {
        $this->songRepository = $songRepository;
    }

    public function uploadSong(array $data, $songFile, $coverImage = null)
    {
        $artist = Artist::find($data['artist_id']);
        $album = isset($data['album_id']) ? Album::find($data['album_id']) : null;
        
        $artistSlug = Str::slug($artist->name);
        $albumSlug = $album ? Str::slug($album->title) : 'unknown-album';
        
        $songFileName = time() . '_' . $songFile->getClientOriginalName();
        $songPath = "music/{$artistSlug}/{$albumSlug}";
        $songFile->storeAs($songPath, $songFileName, 'public');
        $data['file_path'] = "/storage/{$songPath}/{$songFileName}";

        if ($coverImage) {
            $coverFileName = time() . '_' . $coverImage->getClientOriginalName();
            $coverPath = "covers/{$artistSlug}";
            $coverImage->storeAs($coverPath, $coverFileName, 'public');
            $data['cover_image'] = "/storage/{$coverPath}/{$coverFileName}";
        }

        return $this->songRepository->create($data);
    }
}
