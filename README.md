# MusiqSphere

> Your Music Universe

MusiqSphere is a cross-platform music streaming platform that allows users to stream music online, download songs for offline playback, create playlists, manage favorites, and access their music library across Android, iOS, and Web applications.

---

## Features

### Authentication

* User Registration
* User Login
* User Logout
* Profile Management

### Music Streaming

* Online Music Playback
* Background Playback
* Seek, Pause, Resume
* Fast Streaming

### Offline Downloads

* Download Songs
* Offline Listening
* Local Device Storage

### Music Library

* Artists
* Albums
* Songs
* Genres

### Search

* Search Songs
* Search Artists
* Search Albums

### Playlist Management

* Create Playlists
* Edit Playlists
* Delete Playlists
* Add/Remove Songs

### Favorites

* Like Songs
* Unlike Songs
* Favorite Collections

---

## Supported Platforms

### Mobile

* Android
* iOS

### Web

* Modern Web Browsers

---

## Technology Stack

### Backend

* PHP 8.3
* Laravel 12
* MySQL
* Laravel Sanctum

### Mobile

* Flutter
* Dart

### Web

* React
* TypeScript

### Infrastructure

* Hostinger Premium Web Hosting

---

## Architecture

```text
Flutter Mobile App (Android/iOS)
            |
            |
      Laravel REST API
            |
    ------------------
    |                |
  MySQL        Music Storage
 Database    Hostinger Premium Web Hosting
            |
            |
      React Web App
```

---

## Project Structure

```text
musiqsphere/
│
├── AGENTS.md
├── README.md
├── CONTRIBUTING.md
├── LICENSE
│
├── .github/
│   └── copilot-instructions.md
│
├── docs/
│   ├── project-overview.md
│   ├── requirements.md
│   ├── architecture.md
│   ├── database-schema.md
│   ├── api-specification.md
│   ├── mobile-app.md
│   ├── web-app.md
│   ├── storage.md
│   ├── deployment.md
│   ├── security.md
│   ├── user-stories.md
│   └── roadmap.md
│
├── backend/
├── mobile/
└── web/
```

---

## Documentation

Refer to the `/docs` directory for detailed project documentation.

| File                 | Description               |
| -------------------- | ------------------------- |
| project-overview.md  | Project summary           |
| requirements.md      | Functional requirements   |
| architecture.md      | System architecture       |
| database-schema.md   | Database design           |
| api-specification.md | API contracts             |
| mobile-app.md        | Mobile application design |
| web-app.md           | Web application design    |
| storage.md           | File storage strategy     |
| deployment.md        | Deployment instructions   |
| security.md          | Security requirements     |
| user-stories.md      | User stories              |
| roadmap.md           | Project roadmap           |

---

## Backend Setup

### Clone Repository

```bash
git clone https://github.com/your-username/musiqsphere.git
cd musiqsphere
```

### Install Dependencies

```bash
composer install
```

### Configure Environment

```bash
cp .env.example .env
php artisan key:generate
```

Update database settings in `.env`.

### Run Migrations

```bash
php artisan migrate
```

### Start Server

```bash
php artisan serve
```

---

## Mobile Setup

Navigate to the Flutter application:

```bash
cd mobile/flutter-app
```

Install dependencies:

```bash
flutter pub get
```

Run application:

```bash
flutter run
```

---

## Web Setup

Navigate to the React application:

```bash
cd web/react-app
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

---

## Storage

Music files are stored on the Premium Web Hosting platform.

Example structure:

```text
/storage/music/
/storage/covers/
/storage/temp/
```

Example song path:

```text
/storage/music/artist-name/album-name/song.mp3
```

Database stores only file paths and metadata.

---

## Security

* Laravel Sanctum Authentication
* Password Hashing
* File Upload Validation
* HTTPS Enforcement
* API Rate Limiting
* Input Validation
* Secure File Access

---

## Development Guidelines

* Follow SOLID principles
* Keep controllers thin
* Use service classes
* Use repository pattern
* Write automated tests
* Avoid duplicated code
* Use meaningful naming conventions

See `AGENTS.md` for complete AI development guidelines.

---

## MVP Scope

### Phase 1

* Authentication
* Song Upload
* Music Streaming
* Search

### Phase 2

* Playlists
* Favorites
* Playback History

### Phase 3

* Offline Downloads
* Notifications
* Background Playback

---

## Future Enhancements

* Lyrics Support
* AI Recommendations
* Smart Playlists
* Podcasts
* Audiobooks
* Collaborative Playlists
* Social Sharing

---

## License

Private Project

Copyright © MusiqSphere

All Rights Reserved.
