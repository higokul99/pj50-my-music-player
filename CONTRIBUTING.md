# Contributing to MusiqSphere

Thank you for contributing to MusiqSphere.

Please follow these guidelines to maintain code quality and consistency across the project.

---

# Development Principles

* Follow SOLID principles.
* Keep code simple and maintainable.
* Avoid code duplication.
* Write readable and self-documenting code.
* Prioritize security and performance.

---

# Branch Strategy

## Main Branches

* main
* develop

## Feature Branches

Format:

feature/<feature-name>

Examples:

feature/authentication
feature/music-streaming
feature/playlists

## Bug Fix Branches

Format:

fix/<issue-name>

Examples:

fix/login-validation
fix/song-download

---

# Commit Message Convention

Format:

type: description

Examples:

feat: add song streaming api

feat: implement playlist creation

fix: resolve login validation issue

docs: update api specification

refactor: optimize song repository

---

# Backend Standards

Use:

* Laravel Form Requests
* Service Classes
* Repository Pattern
* Resource Classes

Avoid:

* Business logic in controllers
* Raw SQL unless necessary
* Duplicate validation rules

---

# Database Guidelines

* Use migrations for schema changes.
* Use foreign keys.
* Create indexes when appropriate.
* Never modify production database manually.

---

# API Guidelines

* Use REST conventions.
* Return consistent JSON responses.
* Validate all inputs.
* Use proper HTTP status codes.

Example Success Response:

{
"success": true,
"message": "Operation completed",
"data": {}
}

Example Error Response:

{
"success": false,
"message": "Validation failed",
"errors": {}
}

---

# Flutter Guidelines

* Use BLoC pattern.
* Use dependency injection.
* Keep UI and business logic separated.
* Use reusable widgets.

---

# React Guidelines

* Use TypeScript.
* Create reusable components.
* Avoid large components.
* Use React Query for API communication.

---

# Testing

Before submitting code:

Backend:

* Run PHPUnit tests

Frontend:

* Run component tests

Mobile:

* Run widget tests

---

# Pull Request Checklist

Before creating a pull request:

* Code compiles successfully
* Tests pass
* No hardcoded credentials
* Documentation updated
* No duplicated logic
* Feature verified manually

---

# Security Rules

Never commit:

* Passwords
* API Keys
* Database Credentials
* Access Tokens

Always use environment variables.

---

# Documentation

Whenever a new feature is added:

Update:

* requirements.md
* api-specification.md
* roadmap.md

if applicable.
