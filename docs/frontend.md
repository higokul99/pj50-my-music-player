# Frontend (Vite) Build and Deployment Guide

## Overview
The web UI for **MusiqSphere** is built with **Vite** and **React + TypeScript** located in the `web/` directory. The Laravel backend serves API endpoints, while the Vite app provides the music player UI.

## Local Development (requires Node.js/NPM)
1. **Install dependencies**
   ```bash
   cd web
   npm install
   ```
2. **Start the Vite dev server**
   ```bash
   npm run dev
   ```
   This will launch the UI at `http://localhost:5173`. The API calls are proxied to the Laravel server (`http://localhost:8000`).

## Production Build (no Node on the server)
Because the hosting environment does **not** support Node.js/NPM, you must build the frontend **locally** and copy the static assets to the server.
1. **Build the app locally**
   ```bash
   cd web
   npm run build
   ```
   The output is placed in `web/dist/`.
2. **Deploy the build**
   - Copy the entire `web/dist/` folder to the Laravel public directory on the server, e.g.:
     ```bash
     cp -R web/dist/* /Applications/XAMPP/xamppfiles/htdocs/Github/pj50-my-music-player/public/
     ```
   - Ensure the Laravel server is running (`php artisan serve`).
   - Access the player at `http://0.0.0.0:8000/` (or your domain). The static `index.html` will load the React music player.

## Alternative: Simple Python Static Server (quick test)
If you only need to preview the built UI without a full Node environment, you can serve the `web/dist` folder with Python:
```bash
cd web/dist
python3 -m http.server 8080
```
Then open `http://localhost:8080` in a browser.

## Important Notes
- The server **cannot** run `npm` or `vite` directly; all build steps must be performed on a machine with Node installed.
- Keep the `docs/frontend.md` file updated whenever the build process changes.
- After deploying a new build, clear any browser cache to avoid loading stale assets.
