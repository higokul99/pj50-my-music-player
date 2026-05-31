# MusiqSphere Deployment Guide

This guide is tailored for your production environment on Hostinger.

**Frontend Domain**: `https://musiqsphere.metora.in`
**Backend Domain**: `https://musiqsphere.metora.in` (API accessible via `/api`)
**Production Path**: `/home/u784516105/domains/metora.in/public_html/waas/musiqsphere/prod`
**Music Storage Path**: `/home/u784516105/domains/metora.in/public_html/waas/musiqsphere/production_storage/musiqsphere_storage`

---

## 1. Domain Setup (Hostinger hPanel)

Set your domain `musiqsphere.metora.in` to point to the **production root folder**:
- **Document Root**: `public_html/waas/musiqsphere/prod`

### Root .htaccess (CRITICAL)
I have created a `.htaccess` file in the root of the project. Ensure this file is present in your `prod/` directory. It handles routing between the React frontend and Laravel backend:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On

    # 1. Route API requests to Laravel Backend
    RewriteRule ^api/(.*)$ backend/public/index.php [L]

    # 2. Serve Static Files from React Build
    RewriteCond %{DOCUMENT_ROOT}/web/dist/$1 -f
    RewriteRule ^(.*)$ web/dist/$1 [L]

    # 3. React SPA Routing
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} !^/api
    RewriteRule ^(.*)$ web/dist/index.html [L]
</IfModule>
```

---

## 2. Backend Configuration (`prod/backend`)

### Environment Setup (`.env`)
1. Navigate to `prod/backend` via SSH or File Manager.
2. I have created a **`.env.production.example`** with your specific production values.
3. Copy it to `.env`: `cp .env.production.example .env`
4. Update the **`DB_DATABASE`**, **`DB_USERNAME`**, and **`DB_PASSWORD`** in the `.env` file.
5. Update **`MAIL_PASSWORD`** for email notifications.

### Command Execution (via SSH)
```bash
cd /home/u784516105/domains/metora.in/public_html/waas/musiqsphere/prod/backend
composer install --optimize-autoloader --no-dev
php artisan key:generate
php artisan migrate --force
php artisan storage:link
```

---

## 3. Frontend Configuration (`prod/web`)

**IMPORTANT**: The Hostinger Premium Web Hosting plan **does not support Node.js or NPM**. You cannot run build commands on the server.

### Build & Upload (LOCAL ONLY)
1.  **Local Build**: On your local development machine (where Node.js is installed), run:
    ```bash
    cd web
    npm install
    npm run build
    ```
2.  **Automatic Production URL**: The code in `web/src/services/api.ts` uses `window.location.origin` to automatically detect the API URL in production.
3.  **Upload**: Use FTP or Git to upload the **`web/dist`** folder contents to your production `prod/web/dist/` directory.

---

## 4. Troubleshooting & Permissions

- **Permissions**:
  ```bash
  chmod -R 755 storage bootstrap/cache
  chmod -R 755 /home/u784516105/domains/metora.in/public_html/waas/musiqsphere/production_storage/musiqsphere_storage
  ```
- **Clear Cache**:
  ```bash
  php artisan config:cache
  php artisan route:cache
  php artisan view:cache
  ```
- **Verification**: Use `php artisan tinker` and run `env('APP_URL')` to verify values.
