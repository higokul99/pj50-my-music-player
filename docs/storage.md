# Storage Strategy

Provider

Hostinger Premium Web Hosting

Directory Structure

/storage/music/
/storage/covers/
/storage/temp/

Music Storage Example

/storage/music/artist-name/album-name/song.mp3

Album Covers

/storage/covers/artist-name/album-cover.jpg

Database stores only file paths.

Example

file_path:

/storage/music/artist/album/song.mp3

## Client-Side Storage (Web)

To support offline listening and fast loading, the web application utilizes:

1. **Cache API (`musiqsphere-audio-cache`)**:
   - Stores full binary audio files (`.mp3`, `.wav`, `.m4a`).
   - Managed via the `DownloadService`.
   - Allows instant playback without data consumption.

2. **Cache API (`musiqsphere-image-cache`)**:
   - Dynamically stores album covers as the user browses the app.
   - Managed via the `Service Worker`.

3. **IndexedDB (`musiqsphere-db`)**:
   - Stores a `songs` object store with complete metadata for downloaded tracks.
   - Allows the "Downloads" page to render its list even when the backend API is unreachable.

4. **LocalStorage**:
   - Stores the `auth_token` for session persistence.
   - Stores user preferences (Volume level, last played song).