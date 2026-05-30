<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Playlist;
use App\Models\PlaylistSong;
use App\Http\Resources\SongResource;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class PlaylistController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $playlists = Playlist::where('user_id', auth()->id())
            ->withCount('songs')
            ->get();
        return $this->successResponse($playlists, 'Playlists retrieved successfully');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $playlist = Playlist::create([
            'user_id' => auth()->id(),
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        return $this->successResponse($playlist, 'Playlist created successfully', 201);
    }

    public function show($id)
    {
        $playlist = Playlist::where('user_id', auth()->id())
            ->with(['songs.artist', 'songs.album'])
            ->findOrFail($id);
        
        return $this->successResponse([
            'playlist' => $playlist,
            'songs' => SongResource::collection($playlist->songs)
        ], 'Playlist retrieved successfully');
    }

    public function update(Request $request, $id)
    {
        $playlist = Playlist::where('user_id', auth()->id())->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $playlist->update($validated);

        return $this->successResponse($playlist, 'Playlist updated successfully');
    }

    public function destroy($id)
    {
        $playlist = Playlist::where('user_id', auth()->id())->findOrFail($id);
        $playlist->delete();

        return $this->successResponse(null, 'Playlist deleted successfully');
    }

    public function addSong(Request $request, $id)
    {
        $playlist = Playlist::where('user_id', auth()->id())->findOrFail($id);
        
        $validated = $request->validate([
            'song_id' => 'required|exists:songs,id',
        ]);

        $exists = PlaylistSong::where('playlist_id', $playlist->id)
            ->where('song_id', $validated['song_id'])
            ->exists();

        if ($exists) {
            return $this->errorResponse('Song already in playlist', [], 422);
        }

        PlaylistSong::create([
            'playlist_id' => $playlist->id,
            'song_id' => $validated['song_id'],
        ]);

        return $this->successResponse(null, 'Song added to playlist');
    }

    public function removeSong(Request $request, $id)
    {
        $playlist = Playlist::where('user_id', auth()->id())->findOrFail($id);
        
        $validated = $request->validate([
            'song_id' => 'required|exists:songs,id',
        ]);

        PlaylistSong::where('playlist_id', $playlist->id)
            ->where('song_id', $validated['song_id'])
            ->delete();

        return $this->successResponse(null, 'Song removed from playlist');
    }

    public function getSongPlaylists($songId)
    {
        $playlistIds = PlaylistSong::whereHas('playlist', function($q) {
                $q->where('user_id', auth()->id());
            })
            ->where('song_id', $songId)
            ->pluck('playlist_id');

        return $this->successResponse($playlistIds, 'Song playlists retrieved successfully');
    }
}
