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
        // Store audio file in the external songs directory
        $songFileName = time() . '_' . Str::slug(pathinfo($songFile->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $songFile->getClientOriginalExtension();
        $songFile->storeAs('', $songFileName, 'songs');
        $data['file_path'] = $songFileName;

        $coverFileName = null;
        // Store cover image in songs/covers/
        if ($coverImage) {
            $coverFileName = time() . '_' . Str::slug(pathinfo($coverImage->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $coverImage->getClientOriginalExtension();
            $coverImage->storeAs('songs/covers', $coverFileName, 'public');
            $data['cover_image'] = "/storage/songs/covers/{$coverFileName}";
        }

        try {
            return $this->songRepository->create($data);
        } catch (\Exception $e) {
            // Cleanup files if database insert fails
            if (Storage::disk('songs')->exists($songFileName)) {
                Storage::disk('songs')->delete($songFileName);
            }
            if ($coverFileName && Storage::disk('public')->exists('songs/covers/' . $coverFileName)) {
                Storage::disk('public')->delete('songs/covers/' . $coverFileName);
            }
            throw $e;
        }
    }

    public function deleteSong($id)
    {
        $song = $this->songRepository->findById($id);

        // Delete audio file
        if (Storage::disk('songs')->exists($song->file_path)) {
            Storage::disk('songs')->delete($song->file_path);
        }

        // Delete cover image if it's a local storage path
        if ($song->cover_image && str_starts_with($song->cover_image, '/storage/songs/covers/')) {
            $coverPath = str_replace('/storage/', '', $song->cover_image);
            if (Storage::disk('public')->exists($coverPath)) {
                Storage::disk('public')->delete($coverPath);
            }
        }

        return $song->delete();
    }
}
