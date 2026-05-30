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
Returns current user's songs (Library). Supports `?q=` search and pagination.

GET /explorer
Returns all songs in the system (Global). Supports `?q=` search and pagination.

GET /songs/{id}
Returns specific song details.

POST /songs
Upload new song.

PUT /songs/{id}
Update song metadata (Title, Artist, Album, Genre).

DELETE /songs/{id}
Delete song from cloud (Removes DB record and physical storage).

POST /songs/{id}/clone
Clones a global song into the current user's personal collection (Duplicate record, shared storage).

---

## Streaming

GET /songs/{id}/stream
Returns audio stream. Automatically supports range requests for seeking.

---

## Download 

GET /songs/{id}/download
Returns downloadable MP3 file.

---

## Search

GET /search?q=
General search across songs, artists, and albums. (Considered deprecated in favor of `GET /songs?q=` and `GET /explorer?q=`)

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