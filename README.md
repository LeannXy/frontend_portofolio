# Billean portfolio

React + Vite portfolio with a Go/Fiber/PostgreSQL API and a protected project admin dashboard.

## Requirements

- Node.js 20.19+ (or Node.js 22.12+)
- Go 1.26+
- PostgreSQL 14+

## Local setup

1. Create a PostgreSQL database using the database settings in `C:\Portofolio\portfolio-api\.env`.
2. In `C:\Portofolio\portfolio-api\.env`, configure `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and a unique `SESSION_SECRET` with at least 32 random characters. Set `COOKIE_SECURE=true` when serving over HTTPS.
3. Copy this project's `.env.example` to `.env` only if the Go API uses a port other than 3000; set `API_PORT` to the API's `PORT`.
4. Install packages with `npm install`.
5. Start the Vite frontend and Go API with `npm run dev`.
6. Open `http://localhost:5173/admin` to sign in to the dashboard.

The Go API runs from the sibling `portfolio-api` folder, applies its SQL migrations on startup, and seeds sample records only if the projects table is empty. Existing project records are retained; the new migration adds the portfolio fields. New project images are center-cropped to 16:9 in the browser, converted to WebP, and stored under `portfolio-api/public/uploads/`.

## Admin features

- Login uses the `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment values in the Go API's `.env`.
- Create, update, and delete portfolio projects.
- Upload JPEG, PNG, or WebP project images up to 12 MB. The browser crops them to 16:9 and compresses them to WebP before upload.
- Replace the About profile photo from the protected admin dashboard; public visitors cannot upload a profile image.
- Convert previously uploaded JPEG project photos to WebP from the projects dashboard.
- Edit History milestones, About technologies, and social profile links from the admin sidebar.
- Project data is persisted in PostgreSQL. Admin sessions use signed, HTTP-only cookies that expire after eight hours.

Do not commit either `.env` file. Set the API environment variables in the hosting provider in production. Build the frontend and run the API as separate processes behind a reverse proxy that routes `/api` and `/uploads` to the Go API:

```sh
npm run build
cd ..\portfolio-api
go run .
```

Persist `portfolio-api/public/uploads/` on the host or mount it to durable storage; the database stores the public image path. The API retains its existing `GET /api/projects` response envelope and now also provides admin login, CRUD, and upload endpoints.
