<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Artist;
use App\Http\Resources\ArtistResource;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class ArtistController extends Controller
{
    use ApiResponse;

    public function index()
    {
        return $this->successResponse(ArtistResource::collection(Artist::all()), 'Artists retrieved successfully');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'cover_image' => 'nullable|string'
        ]);

        $artist = Artist::create($validated);
        return $this->successResponse(new ArtistResource($artist), 'Artist created successfully', 201);
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
