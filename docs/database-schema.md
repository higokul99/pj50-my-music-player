# Database Schema

## users

| Column | Type |
|----------|----------|
| id | bigint |
| name | varchar |
| email | varchar |
| password | varchar |
| created_at | timestamp |

---

## artists

| Column | Type |
|----------|----------|
| id | bigint |
| name | varchar |
| image | varchar |
| bio | text |

---

## albums

| Column | Type |
|----------|----------|
| id | bigint |
| title | varchar |
| artist_id | bigint |
| cover_image | varchar |
| release_date | date |

---

## songs

| Column | Type |
|----------|----------|
| id | bigint |
| title | varchar |
| artist_id | bigint |
| album_id | bigint |
| file_path | varchar |
| duration | integer |
| file_size | bigint |
| cover_image | varchar |

---

## playlists

| Column | Type |
|----------|----------|
| id | bigint |
| user_id | bigint |
| name | varchar |

---

## playlist_songs

| Column | Type |
|----------|----------|
| playlist_id | bigint |
| song_id | bigint |

---

## favorites

| Column | Type |
|----------|----------|
| user_id | bigint |
| song_id | bigint |

---

## listening_history

| Column | Type |
|----------|----------|
| id | bigint |
| user_id | bigint |
| song_id | bigint |
| played_at | timestamp |