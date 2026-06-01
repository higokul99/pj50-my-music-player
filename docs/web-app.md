# Web Application

Technology

- React
- TypeScript

Features

- Login
- Registration
- Music Streaming
- Search
- Search
- Playlists
- Favorites
- Mobile Responsive Design (Bottom Tab Nav on Mobile)
- Offline Discovery (IndexedDB Metadata)
- Offline Playback (Cache API Audio)
- Song Cloning (Add to personal collection from global)
- Infinite Scrolling (Intersection Observer)
- Dashboard & Playlist Shuffle Play (Randomized queue generation)

Admin Features

- Upload Music (Automatic metadata parsing)
- Manage Songs (Cloud Edit/Delete)
- Manage Artists & Albums

## Application Structure

### Context Providers
1. **AuthProvider**: Manages user session, persistence, and profile data.
2. **PlayerContext**: Controls audio playback, queue management, and offline detection.

### Core Services
1. **api.ts**: Centralized Axios instance with Sanctum interceptors.
2. **DownloadService.ts**: Logic for managing Cache API and IndexedDB storage.
3. **sw.js**: Service Worker for asset caching and offline reliability.

### Key Components
- **Header**: Personalized topbar with user's name and profile link.
- **Sidebar**: High-level navigation for Discovery and Library.
- **RightPanel**: Now Playing sidebar that displays cover art (or spinning vinyl record animation if no artwork is available), active state, and detailed song credits. Hides automatically when no song is active.
- **Player**: Global audio controller with progress tracking and volume control.
- **SongManagement**: Admin interface for full library control.