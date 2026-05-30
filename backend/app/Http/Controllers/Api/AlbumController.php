<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Http\Resources\AlbumResource;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AlbumController extends Controller
{
    use ApiResponse;

    public function index()
    {
        return $this->successResponse(AlbumResource::collection(Album::with('artist')->get()), 'Albums retrieved successfully');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'artist_id' => 'required|exists:artists,id',
            'release_year' => 'nullable|integer',
            'cover_image' => 'nullable|string'
        ]);

        $album = Album::create($validated);
        return $this->successResponse(new AlbumResource($album), 'Album created successfully', 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
