# MusiqSphere Deployment Guide

This guide provides step-by-step instructions for deploying the MusiqSphere application (Backend and Web) to Hostinger Premium Web Hosting or VPS.

## Prerequisites

- **Hostinger Account**: Access to hPanel or SSH.
- **Domain/Subdomain**: Configured and pointing to your host.
- **PHP 8.3+**: Required for Laravel 12.
- **MySQL Database**: Created via hPanel.
- **Node.js & NPM**: Required for building the React frontend.

---

## Method 1: Deployment via GitHub & CLI (Recommended)

This method is faster and allows for easy updates using `git pull`.

### 1. SSH Access
Connect to your Hostinger server via Terminal:
```bash
ssh username@your-server-ip
```

### 2. Clone the Repository
Navigate to your desired directory (usually `domains/yourdomain.com/`) and clone:
```bash
git clone https://github.com/your-username/musiqsphere.git .
```

### 3. Backend Setup (Laravel)
Navigate to the `backend/` directory:
```bash
cd backend
composer install --optimize-autoloader --no-dev
cp .env.example .env
```
Edit the `.env` file with your production database credentials:
```bash
nano .env
```
Generate key and migrate:
```bash
php artisan key:generate
php artisan migrate --force
php artisan storage:link
```

### 4. Frontend Setup (React)
Navigate to the `web/` directory:
```bash
cd ../web
npm install
npm run build
```
The build files will be in `web/dist`. You need to move or point your web server to this directory.

---

## Method 2: Manual Upload (FTP / File Manager)

Use this method if you do not have SSH access or prefer a GUI.

### 1. Local Preparation
- **Web**: Run `npm run build` in the `web/` folder.
- **Backend**: Run `composer install --no-dev` in the `backend/` folder.
- **Zip**: Create a zip file of the `backend` folder and a separate zip of the `web/dist` folder content.

### 2. Upload via Hostinger File Manager
1. Log in to **hPanel** > **File Manager**.
2. Create a folder named `api` (or similar) for the backend and upload/extract the `backend` zip there.
3. Upload the content of the `web/dist` zip directly into the `public_html` folder (or your subdomain folder).

### 3. Environment Config
Rename `.env.example` to `.env` in the backend folder using the File Manager and update the database/app details.

---

## Hostinger Specific Configurations

### 1. .htaccess for React (SPA)
If using `public_html` for the React app, ensure you have a `.htaccess` file to handle routing:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-y
  RewriteRule . /index.html [L]
</IfModule>
```

### 2. Symlink for Storage
Hostinger shared hosting doesn't always allow `php artisan storage:link`. You may need to create a PHP script to run it:
```php
<?php
symlink('/home/u123/domains/domain.com/backend/storage/app/public', '/home/u123/domains/domain.com/public_html/storage');
```

### 3. PHP Version
Go to **hPanel** > **Advanced** > **PHP Configuration** and ensure **PHP 8.3** is selected.

---

## Deployment Checklist
- [ ] Database credentials updated in `.env`.
- [ ] `APP_DEBUG` set to `false` in `.env`.
- [ ] `APP_URL` matches your production domain.
- [ ] Storage directory has write permissions (`chmod -R 775 storage bootstrap/cache`).
- [ ] React `api.ts` base URL points to your production API.
- [ ] SSL certificate (HTTPS) is active.
