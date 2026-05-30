<?php

namespace App\Services;

use App\Repositories\SongRepository;
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
        // Store audio file in songs/audio/
        $songFileName = time() . '_' . Str::slug(pathinfo($songFile->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $songFile->getClientOriginalExtension();
        $songFile->storeAs('songs/audio', $songFileName, 'public');
        $data['file_path'] = "/storage/songs/audio/{$songFileName}";

        // Store cover image in songs/covers/
        if ($coverImage) {
            $coverFileName = time() . '_' . Str::slug(pathinfo($coverImage->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $coverImage->getClientOriginalExtension();
            $coverImage->storeAs('songs/covers', $coverFileName, 'public');
            $data['cover_image'] = "/storage/songs/covers/{$coverFileName}";
        }

        return $this->songRepository->create($data);
    }
}
