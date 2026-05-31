<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SongController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\ArtistController;
use App\Http\Controllers\Api\AlbumController;
use App\Http\Controllers\Api\PlaylistController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/test-log', function () {
    \Illuminate\Support\Facades\Log::info('Test log entry triggered at ' . now());
    return response()->json(['success' => true, 'message' => 'Log entry created!']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('artists', ArtistController::class);
    Route::apiResource('albums', AlbumController::class);

    Route::get('/songs', [SongController::class, 'index']);
    Route::get('/explorer', [SongController::class, 'explorer']);
    Route::post('/songs', [SongController::class, 'store']);
    Route::put('/songs/{id}', [SongController::class, 'update']);
    Route::delete('/songs/{id}', [SongController::class, 'destroy']);
    Route::post('/songs/{id}/favorite', [SongController::class, 'toggleFavorite']);
    Route::post('/songs/{id}/clone', [SongController::class, 'cloneToCollection']);
    Route::get('/favorites', [SongController::class, 'favorites']);

    // Playlist Routes
    Route::get('/playlists', [PlaylistController::class, 'index']);
    Route::post('/playlists', [PlaylistController::class, 'store']);
    Route::get('/playlists/{id}', [PlaylistController::class, 'show']);
    Route::put('/playlists/{id}', [PlaylistController::class, 'update']);
    Route::delete('/playlists/{id}', [PlaylistController::class, 'destroy']);
    Route::post('/playlists/{id}/songs', [PlaylistController::class, 'addSong']);
    Route::delete('/playlists/{id}/songs', [PlaylistController::class, 'removeSong']);
    Route::get('/songs/{songId}/playlists', [PlaylistController::class, 'getSongPlaylists']);
});

Route::get('/songs/{id}/stream', [SongController::class, 'stream']);
Route::get('/songs/{id}/download', [SongController::class, 'download']);
