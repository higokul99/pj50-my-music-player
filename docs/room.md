# MusiqSphere Rooms Feature Specification

This document details the architectural plan, database schema, API design, and sync strategy for the **Group Listening Rooms** (similar to Spotify Jam).

---

## Architecture & Real-Time Sync Strategy
Since MusiqSphere runs on web hosting environments without simple WebSocket/Node daemon support, we use a **Throttled Poll-and-Push model**:
1. **Host Client**: Pushes playback state updates (current song, play/pause state, current seek time) to the backend. This is throttled (e.g., sent only on song change, play, pause, seek, or every 5 seconds of active playback).
2. **Guest Clients**: Poll the room state endpoint once every 3 seconds. If the guest's player state differs significantly from the host's synced state (e.g., wrong song, play state mismatch, or duration drift > 3 seconds), the guest's player dynamically forces a resync.

---

## 1. Database Schema

### `rooms` Table
Tracks active sync sessions:
```sql
CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(6) UNIQUE NOT NULL,            -- Alphanumeric room code (e.g., AJ39D8)
    host_id INT NOT NULL,                       -- Host user id
    current_song_id INT NULL,                   -- Currently playing song ID
    is_playing BOOLEAN DEFAULT FALSE,           -- Active playback state
    current_progress FLOAT DEFAULT 0.0,         -- Song play progress in seconds
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (host_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (current_song_id) REFERENCES songs(id) ON DELETE SET NULL
);
```

---

## 2. API Specifications

### Create Room
* **Endpoint**: `POST /api/v1/rooms`
* **Auth**: Required (Sanctum)
* **Response**:
```json
{
  "success": true,
  "message": "Room created successfully",
  "data": {
    "id": 12,
    "code": "A3B9Y2",
    "host_id": 1,
    "current_song_id": null,
    "is_playing": false,
    "current_progress": 0.0
  }
}
```

### Join Room
* **Endpoint**: `POST /api/v1/rooms/join`
* **Auth**: Required
* **Body**:
```json
{
  "code": "A3B9Y2"
}
```
* **Response**: Returns room state and updates active listener membership.

### Sync Playback State (Host Only)
* **Endpoint**: `POST /api/v1/rooms/{id}/sync`
* **Auth**: Required
* **Body**:
```json
{
  "current_song_id": 5,
  "is_playing": true,
  "current_progress": 42.5
}
```

### Get Room Status (Guest Poll)
* **Endpoint**: `GET /api/v1/rooms/{id}`
* **Auth**: Required
* **Response**: Returns current room playback details for synchronization.

---

## 3. Frontend Implementation Plan

1. **Sidebar Navigation**: Add a `Rooms` tab in the main sidebar with a `Users` icon.
2. **Room Management Page (`Room.tsx`)**:
   * Form to join an existing session via room code.
   * "Create Room" action generating a new host code.
3. **Player Sync Integration (`PlayerContext.tsx`)**:
   * Integrate check: If `roomState.role === 'host'`, trigger updates to the backend API on change.
   * If `roomState.role === 'guest'`, execute background `setInterval` polling to pull updates and force local player state sync.
