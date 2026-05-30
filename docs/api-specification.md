# API Specification

Base URL

/api/v1

## Authentication

POST /register

POST /login

POST /logout

GET /profile

PUT /profile

---

## Songs

GET /songs

GET /songs/{id}

POST /songs

PUT /songs/{id}

DELETE /songs/{id}

---

## Streaming

GET /songs/{id}/stream

Returns audio stream.

---

## Download

GET /songs/{id}/download

Returns downloadable MP3.

---

## Search

GET /search?q=

---

## Favorites

GET /favorites

POST /favorites/{song_id}

DELETE /favorites/{song_id}

---

## Playlists

GET /playlists

POST /playlists

PUT /playlists/{id}

DELETE /playlists/{id}

POST /playlists/{id}/songs

DELETE /playlists/{id}/songs/{song_id}

---

## History

GET /history