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

    public function index()
    {
        $user = auth()->user();
        $songs = \App\Models\Song::where('user_id', $user->id)
            ->with(['artist', 'album'])
            ->orderBy('title', 'asc')
            ->paginate(20);

        return $this->successResponse(SongResource::collection($songs)->response()->getData(true), 'Songs retrieved successfully');
    }

    public function explorer()
    {
        $songs = \App\Models\Song::with(['artist', 'album'])
            ->orderBy('title', 'asc')
            ->paginate(20);
            
        return $this->successResponse(SongResource::collection($songs)->response()->getData(true), 'Explorer songs retrieved successfully');
    }

    public function store(StoreSongRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();

        $song = $this->songService->uploadSong(
            $data,
            $request->file('song_file'),
            $request->file('cover_image')
        );

        return $this->successResponse(new SongResource($song), 'Song uploaded successfully', 201);
    }

    public function stream($id)
    {
        $song = $this->songRepository->findById($id);
        
        if (!\Illuminate\Support\Facades\Storage::disk('songs')->exists($song->file_path)) {
            return $this->errorResponse('Song file not found', [], 404);
        }

        $fullPath = \Illuminate\Support\Facades\Storage::disk('songs')->path($song->file_path);
        return response()->file($fullPath);
    }

    public function download($id)
    {
        $song = $this->songRepository->findById($id);
        
        if (!\Illuminate\Support\Facades\Storage::disk('songs')->exists($song->file_path)) {
            return $this->errorResponse('Song file not found', [], 404);
        }

        $fullPath = \Illuminate\Support\Facades\Storage::disk('songs')->path($song->file_path);
        return response()->download($fullPath);
    }

    public function toggleFavorite($id)
    {
        $user = auth()->user();
        $song = $this->songRepository->findById($id);

        $favorite = \App\Models\Favorite::where('user_id', $user->id)
            ->where('song_id', $song->id)
            ->first();

        if ($favorite) {
            $favorite->delete();
            return $this->successResponse(null, 'Song removed from favorites');
        }

        \App\Models\Favorite::create([
            'user_id' => $user->id,
            'song_id' => $song->id
        ]);

        return $this->successResponse(null, 'Song added to favorites');
    }

    public function favorites()
    {
        $user = auth()->user();
        $songs = \App\Models\Song::whereHas('favorites', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->with(['artist', 'album'])->get();

        return $this->successResponse(SongResource::collection($songs), 'Favorite songs retrieved successfully');
    }
}
