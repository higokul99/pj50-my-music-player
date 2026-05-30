# MusiqSphere Local Installation Guide

Follow these steps to set up MusiqSphere on your local machine for development.

## Prerequisites

Before you begin, ensure you have the following installed:
- **PHP 8.3+**
- **Composer**
- **Node.js & NPM**
- **MySQL** (e.g., via WAMP, XAMPP, or Docker)
- **Git**

---

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/musiqsphere.git
cd musiqsphere
```

---

## 2. Backend Setup (Laravel)

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install PHP dependencies**:
   ```bash
   composer install
   ```

3. **Configure Environment**:
   Copy the example environment file and update it:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and set your local database credentials:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=musiqsphere
   DB_USERNAME=root
   DB_PASSWORD=
   ```

4. **Generate Application Key**:
   ```bash
   php artisan key:generate
   ```

5. **Create Database**:
   Create a database named `musiqsphere` in your MySQL server.

6. **Run Migrations & Seeders**:
   ```bash
   php artisan migrate
   ```

7. **Link Storage**:
   ```bash
   php artisan storage:link
   ```

8. **Start the Backend Server**:
   ```bash
   php artisan serve
   ```
   The API will be available at `http://localhost:8000`.

---

## 3. Frontend Setup (React)

1. **Navigate to the web directory**:
   ```bash
   cd ../web
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The web app will be available at `http://localhost:5173`.

---

## 4. Verification

1. Open your browser and go to `http://localhost:5173`.
2. Register a new account.
3. Try uploading a song via the **Manage Library** (Admin) section.
4. Verify that the song appears in your **Dashboard**.

## Troubleshooting

- **CORS Issues**: Ensure `SANCTUM_STATEFUL_DOMAINS` in your backend `.env` matches your frontend URL (`localhost:5173`).
- **Database Connection**: Double-check your MySQL port and credentials in `.env`.
- **Storage Permissions**: If covers aren't loading, ensure the `storage/` and `bootstrap/cache` folders are writable.
