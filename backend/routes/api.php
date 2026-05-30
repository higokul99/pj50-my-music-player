<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SongController;
use App\Http\Controllers\Api\SearchController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/songs', [SongController::class, 'store']);
    Route::get('/songs/{id}/stream', [SongController::class, 'stream']);
    Route::get('/songs/{id}/download', [SongController::class, 'download']);
    Route::get('/search', [SearchController::class, 'index']);
});
