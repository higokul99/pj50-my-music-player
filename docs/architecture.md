# System Architecture

                +-------------------+
                | Flutter Mobile App|
                | Android + iOS     |
                +---------+---------+
                          |
                          |
                +---------v---------+
                | Laravel REST API  |
                +---------+---------+
                          |
          +---------------+---------------+
          |                               |
    +-----v------+                 +------v------+
    | MySQL      |                 | Hostinger   |
    | Database   |                 | File Storage|
    +------------+                 +-------------+

                          ^
                          |
                +---------+---------+
                | React Web App     |
                +-------------------+

## Components

1. Mobile Application
2. Web Application
3. Laravel Backend API
4. MySQL Database
5. Hostinger File Storage

## Communication

- REST APIs
- JSON Requests/Responses
- Sanctum Authentication

## File Storage

Music files stored locally on Hostinger VPS.

Examples:

/storage/music/
/storage/covers/
/storage/temp/

## Web Application (Offline-First)

The web app is designed as a Progressive Web App (PWA) with the following offline capabilities:

1. **Service Worker**: Caches the application shell (HTML, CSS, JS) and dynamically caches album covers.
2. **Cache API**: Stores binary audio files for instant offline playback.
3. **IndexedDB**: Stores song metadata locally, allowing the library to be browsed without a server connection.
4. **Smart Player**: Detects local cached files before attempting to stream from the network.