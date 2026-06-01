# YouTube Playlist Import Guide

This guide explains how to import and download additional YouTube playlists or individual video links onto your local machine using the built-in importer tool.

---

## Steps to Import a New Playlist

### 1. Update the Playlist Links
1. Open the file [import/links.txt](file:///Applications/XAMPP/xamppfiles/htdocs/Github/pj50-my-music-player/import/links.txt) in your editor.
2. Delete the old links or comment them out with a `#` at the start of the line.
3. Paste your new YouTube playlist link or individual video URLs (one per line). For example:
   ```text
   # My New Favorite Playlist
   https://www.youtube.com/playlist?list=PL...
   
   # Individual Track
   https://www.youtube.com/watch?v=...
   ```
4. Save the file.

---

### 2. Run the Downloader Script
Open your local terminal shell and navigate to the `import` directory, then run the downloader script:

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/Github/pj50-my-music-player/import
node download.js
```

*Note: Since the script uses your local python3 environment to execute the downloads, it will handle the downloads sequentially and automatically ignore SSL validation certificate errors.*

---

### 3. Locate Your Music Files
Once the script logs `All downloads complete!`, your files will be ready in:
* **Directory**: [import/playlist/](file:///Applications/XAMPP/xamppfiles/htdocs/Github/pj50-my-music-player/import/playlist/)

The files are downloaded in high-quality, native `.m4a` audio format, which is fully supported for playback on the MusiqSphere web, Android, and iOS clients.

---

### 4. Uploading to MusiqSphere
Since shared hosting environments like Hostinger cannot convert YouTube videos directly, you can upload these downloaded local files using the **Library Management** / **Upload Music** admin panel in your MusiqSphere web client interface (`http://localhost:5173/admin/upload`).
