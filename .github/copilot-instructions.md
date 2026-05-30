# MusiqSphere Copilot Instructions

You are assisting with development of MusiqSphere.

Follow these instructions for every code generation task.

---

# Project Overview

MusiqSphere is a music streaming platform supporting:

* Android
* iOS
* Web

Features:

* Authentication
* Music Streaming
* Offline Downloads
* Playlists
* Favorites
* Search

Backend:

* Laravel 12
* PHP 8.3
* MySQL

Mobile:

* Flutter

Web:

* React + TypeScript

Infrastructure:

* Hostinger VPS
* Local Music Storage

---

# Development Rules

Always:

* Follow SOLID principles
* Write clean code
* Use meaningful names
* Create reusable components
* Follow project structure

Never:

* Hardcode credentials
* Duplicate business logic
* Place business logic in controllers
* Store files in database blobs

---

# Laravel Rules

Use:

* Controllers
* Services
* Repositories
* Form Requests
* Resources

Architecture:

Controller
→ Service
→ Repository
→ Model

Controllers must remain thin.

---

# Database Rules

Use:

* Eloquent ORM
* Foreign Keys
* Database Indexes

Avoid:

* N+1 Queries
* Unnecessary raw SQL

Always eager load relationships when appropriate.

---

# API Rules

Use REST APIs.

Return:

{
"success": true,
"message": "",
"data": {}
}

Use proper HTTP status codes.

---

# Flutter Rules

Use:

* flutter_bloc
* dio
* get_it
* sqflite
* just_audio

Architecture:

Presentation
→ Domain
→ Data

Keep UI code separate from business logic.

---

# React Rules

Use:

* TypeScript
* React Query
* Axios

Create small reusable components.

---

# Storage Rules

Music files are stored on Hostinger VPS.

Example:

/storage/music/
/storage/covers/

Database stores only metadata and file paths.

---

# Security Rules

Always:

* Validate inputs
* Validate uploads
* Use HTTPS
* Protect authenticated routes

Never:

* Trust client-side validation
* Expose sensitive data

---

# Testing Rules

Generate tests whenever creating:

* Services
* Repositories
* Controllers
* Business Logic

Prefer testable code.

---

# Documentation Rules

When creating new features:

Update related documentation under:

docs/

if the feature changes requirements, APIs, database schema, or architecture.

---

# Goal

Generate production-ready, secure, maintainable code that follows MusiqSphere architecture and coding standards.
