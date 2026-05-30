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