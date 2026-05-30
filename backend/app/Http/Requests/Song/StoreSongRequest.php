<?php

namespace App\Http\Requests\Song;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreSongRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'artist_id' => 'required|exists:artists,id',
            'album_id' => 'nullable|exists:albums,id',
            'song_file' => 'required|file|mimetypes:audio/mpeg,audio/mp4,audio/wav,audio/x-wav,audio/aac,audio/ogg|max:51200',
            'cover_image' => 'nullable|file|mimetypes:image/jpeg,image/png,image/jpg,image/webp|max:2048',
            'duration' => 'nullable|integer',
            'lyrics' => 'nullable|string',
            'genre' => 'nullable|string|max:255',
        ];
    }
}
