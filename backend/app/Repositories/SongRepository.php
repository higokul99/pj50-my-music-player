<?php

namespace App\Repositories;

use App\Models\Song;

class SongRepository
{
    public function create(array $data)
    {
        return Song::create($data);
    }

    public function findById($id)
    {
        return Song::with(['artist', 'album'])->findOrFail($id);
    }

    public function search($query)
    {
        return Song::with(['artist', 'album'])
            ->where('title', 'like', "%{$query}%")
            ->orWhereHas('artist', function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%");
            })
            ->orWhereHas('album', function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%");
            })
            ->paginate(20);
    }
}
