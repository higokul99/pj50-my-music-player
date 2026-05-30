<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SongController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\ArtistController;
use App\Http\Controllers\Api\AlbumController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('artists', ArtistController::class);
    Route::apiResource('albums', AlbumController::class);

    Route::get('/songs', [SongController::class, 'index']);
    Route::post('/songs', [SongController::class, 'store']);
});

Route::get('/songs/{id}/stream', [SongController::class, 'stream']);
Route::get('/songs/{id}/download', [SongController::class, 'download']);
