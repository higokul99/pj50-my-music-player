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
            'song_file' => 'required|file|mimes:mp3,wav,m4a,aac,oga,ogg,mpga,mp4,m4b|max:51200',
            'cover_image' => 'nullable|file|mimes:jpeg,png,jpg,webp|max:2048',
            'duration' => 'nullable|integer',
            'lyrics' => 'nullable|string',
            'genre' => 'nullable|string|max:255',
        ];
    }
}
