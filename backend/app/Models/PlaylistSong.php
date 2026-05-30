<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlaylistSong extends Model
{
    protected $fillable = ['playlist_id', 'song_id'];

    public function playlist()
    {
        return $this->belongsTo(Playlist::class);
    }

    public function song()
    {
        return $this->belongsTo(Song::class);
    }
}
