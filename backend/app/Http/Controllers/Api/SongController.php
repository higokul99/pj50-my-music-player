<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Song\StoreSongRequest;
use App\Http\Resources\SongResource;
use App\Services\SongService;
use App\Repositories\SongRepository;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class SongController extends Controller
{
    use ApiResponse;

    protected $songService;
    protected $songRepository;

    public function __construct(SongService $songService, SongRepository $songRepository)
    {
        $this->songService = $songService;
        $this->songRepository = $songRepository;
    }

    public function store(StoreSongRequest $request)
    {
        $song = $this->songService->uploadSong(
            $request->validated(),
            $request->file('song_file'),
            $request->file('cover_image')
        );

        return $this->successResponse(new SongResource($song), 'Song uploaded successfully', 201);
    }

    public function stream($id)
    {
        $song = $this->songRepository->findById($id);
        $path = str_replace('/storage/', '', $song->file_path);
        
        if (!\Illuminate\Support\Facades\Storage::disk('public')->exists($path)) {
            return $this->errorResponse('Song file not found', [], 404);
        }

        $fullPath = \Illuminate\Support\Facades\Storage::disk('public')->path($path);
        return response()->file($fullPath);
    }

    public function download($id)
    {
        $song = $this->songRepository->findById($id);
        $path = str_replace('/storage/', '', $song->file_path);
        
        if (!\Illuminate\Support\Facades\Storage::disk('public')->exists($path)) {
            return $this->errorResponse('Song file not found', [], 404);
        }

        $fullPath = \Illuminate\Support\Facades\Storage::disk('public')->path($path);
        return response()->download($fullPath);
    }
}
