<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Song extends Model
{
    protected $fillable = [
        'title',
        'artist_id',
        'album_id',
        'user_id',
        'duration',
        'file_path',
        'cover_image',
        'lyrics',
        'genre',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function artist()
    {
        return $this->belongsTo(Artist::class);
    }

    public function album()
    {
        return $this->belongsTo(Album::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function isFavoritedBy($user)
    {
        if (!$user) return false;
        return $this->favorites()->where('user_id', $user->id)->exists();
    }
}
