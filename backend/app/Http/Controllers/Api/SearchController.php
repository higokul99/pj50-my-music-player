<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\SongRepository;
use App\Http\Resources\SongResource;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    use ApiResponse;

    protected $songRepository;

    public function __construct(SongRepository $songRepository)
    {
        $this->songRepository = $songRepository;
    }

    public function index(Request $request)
    {
        $query = $request->input('q', '');
        $songs = $this->songRepository->search($query);

        return $this->successResponse(
            SongResource::collection($songs)->response()->getData(true),
            'Search results retrieved successfully'
        );
    }
}
