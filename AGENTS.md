# AGENTS.md

# MusiqSphere - AI Agent Instructions

## Project Overview

MusiqSphere is a personal music streaming platform that supports:

* Android Application
* iOS Application
* Web Application

# For More details refer docs folder

Users can:

* Register and Login
* Stream Music Online
* Download Music for Offline Listening
* Create and Manage Playlists
* Favorite Songs
* Search Music
* View Albums and Artists

---

# Technology Stack

## Backend

* PHP 8.3
* Laravel 12
* MySQL

## Mobile

* Flutter
* Dart

## Web

* React
* TypeScript

## Infrastructure

* Hostinger Premium Web Hosting

## Authentication

* Laravel Sanctum

---

# Architecture Principles

Use Clean Architecture whenever practical.

Layers:

1. Controllers
2. Services
3. Repositories
4. Models
5. Database

Controllers must remain thin.

Business logic must never be placed directly inside controllers.

---

# Backend Standards

## Laravel Guidelines

Use:

* Form Requests
* Resource Classes
* Service Classes
* Repository Pattern
* Eloquent ORM

Avoid:

* Raw SQL unless required
* Business logic in controllers
* Duplicate code

---

# API Standards

Use REST APIs only.

Response Format:

Success

{
"success": true,
"message": "Operation completed",
"data": {}
}

Error

{
"success": false,
"message": "Validation failed",
"errors": {}
}

Use proper HTTP status codes.

200 OK

201 Created

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

422 Validation Error

500 Internal Server Error

---

# Database Standards

Use MySQL.

Every table must contain:

* id
* created_at
* updated_at

Use foreign keys.

Create indexes for:

* email
* artist_id
* album_id
* song_id
* user_id

Avoid N+1 queries.

Always eager load relationships where appropriate.

---

# Authentication Rules

Use Laravel Sanctum.

Protected endpoints require authentication.

Do not expose user passwords.

Passwords must be hashed using Laravel defaults.

---

# Music Storage Rules

Music files are stored on Premium Web Hosting storage.

Directory Structure:

/storage/music/
/storage/covers/
/storage/temp/

Database stores file paths only.

Never store binary music files inside the database.

Example:

/storage/music/artist-name/album-name/song.mp3

---

# Song Requirements

A song must contain:

* title
* artist
* album
* duration
* file path

Optional:

* cover image
* lyrics
* genre

Supported Formats:

* mp3
* m4a
* wav

---

# Streaming Requirements

Provide streaming endpoint:

GET /api/v1/songs/{id}/stream

Support:

* Play
* Pause
* Resume
* Seek

Streaming should not require full file download.

---

# Download Requirements

Provide download endpoint:

GET /api/v1/songs/{id}/download

Users can:

* Download songs
* Delete downloaded songs
* Listen offline

---

# Playlist Requirements

Users can:

* Create playlist
* Rename playlist
* Delete playlist
* Add songs
* Remove songs

---

# Favorites Requirements

Users can:

* Like songs
* Unlike songs
* View favorites

---

# Search Requirements

Search should support:

* Song title
* Artist
* Album

Search should be optimized using database indexes.

---

# Flutter Standards

Use:

* Clean Architecture
* Repository Pattern
* Dependency Injection

Recommended Packages:

* dio
* flutter_bloc
* get_it
* just_audio
* sqflite
* go_router

Avoid tightly coupled UI and API code.

---

# Offline Playback Requirements

Downloaded music must be stored locally.

Metadata stored in SQLite.

Required Metadata:

* song id
* title
* artist
* local file path

Application must work without internet for downloaded songs.

---

# React Standards

Use:

* React
* TypeScript
* Axios
* React Query

Keep components small and reusable.

Avoid duplicated logic.

---

# Security Requirements

Validate all uploads.

Validate file types.

Validate image types.

Use:

* HTTPS
* Rate Limiting
* Authentication Middleware

Never trust client input.

Always validate server-side.

---

# Logging

Log:

* Errors
* Failed Uploads
* Authentication Failures

Do not log passwords.

Do not log tokens.

---

# Testing Requirements

Backend

* PHPUnit Feature Tests
* PHPUnit Unit Tests

Frontend

* Component Tests

Mobile

* Widget Tests

Critical business logic must be tested.

---

# Performance Requirements

Optimize:

* Database Queries
* File Streaming
* API Responses

Use pagination for large datasets.

Default page size:

20

Maximum page size:

100

---

# Coding Rules

Always:

* Follow SOLID principles
* Write readable code
* Use descriptive names
* Add meaningful comments where necessary

Never:

* Duplicate logic
* Hardcode secrets
* Commit credentials
* Mix business logic with controllers

---

# MVP Scope

Phase 1

* Authentication
* Song Upload
* Song Streaming
* Search

Phase 2

* Playlists
* Favorites
* History

Phase 3

* Offline Downloads
* Push Notifications
* Background Playback

Future Features

* Lyrics
* AI Recommendations
* Podcasts
* Audiobooks
* Collaborative Playlists

---

# Primary Objective

Build a stable, scalable, secure music streaming platform called MusiqSphere that supports Android, iOS, and Web clients using a Laravel API backend and Hostinger Premium Web Hosting music storage.
