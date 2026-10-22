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

## Deploy with Vercel, Render, Neon, and Cloudinary

The frontend can be hosted on Vercel's free static hosting. This project also needs a Go API, PostgreSQL, and durable image storage. The included Render blueprint targets a hobby deployment; Render documents that its free web services sleep when idle and lose local files on restart/redeploy, and does not recommend them for production workloads. Neon Free also scales to zero and has usage limits. Check the providers' current terms before launch.

### 1. Deploy the frontend to Vercel

1. Push the `portfolio-web` repository to Git and import it into Vercel.
2. Set **Root Directory** to the repository root (`./`), build command to `npm run build`, and output directory to `dist`.
3. Deploy once to obtain the production URL, such as `https://your-project.vercel.app`. `vercel.json` supplies SPA deep links (including `/admin`) and response security headers.

### 2. Set up Neon and Cloudinary

1. Create a PostgreSQL database in Neon. Copy its pooled connection string for the Render `DATABASE_URL` secret.
2. Create a Cloudinary account and copy its cloud name, API key, and API secret. The API signs uploads server-side; never put these values in Vercel or in a `VITE_*` variable.
3. Existing local `/uploads/...` files are not migrated automatically. Re-upload those images through admin after deployment, or migrate them to Cloudinary before switching production traffic.

### 3. Deploy the Go API to Render

The API directory includes a `Dockerfile`, `.dockerignore`, and `render.yaml`. Render needs the API files in a Git repository; the API currently lives outside the frontend Git root, so push that directory as a separate repository (or move it into a tracked monorepo before connecting the Blueprint).

1. In Render, create a Blueprint from the API repository. It will create the `portfolio-api` Docker web service on the Free plan.
2. Set the Blueprint's unsynchronized environment values:
   - `DATABASE_URL`: Neon connection string.
   - `ADMIN_USERNAME` and `ADMIN_PASSWORD`: unique admin credentials; do not use development values.
   - `SESSION_SECRET`: generate a random secret of at least 32 characters (for example, `openssl rand -base64 48`).
   - `FRONTEND_ORIGINS`: exact production origin from the Vercel deployment, with no trailing slash.
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Cloudinary credentials.
3. Keep the Blueprint's production settings: `APP_ENV=production`, `DB_SSLMODE=require`, `COOKIE_SECURE=true`, and `COOKIE_SAME_SITE=None`. The API refuses production startup if TLS, the exact frontend origin, or Cloudinary storage is missing.
4. Wait for Render to deploy and note the API origin, such as `https://portfolio-api.onrender.com`.

### 4. Connect Vercel and verify

1. Add `VITE_API_URL` to Vercel's Production environment, set to the API origin only (no `/api` suffix), then redeploy the frontend.
2. Confirm the public projects/content load and sign in at `/admin`; test saving content and uploading an image. Confirm the new image URL is hosted by Cloudinary.
3. Use a custom domain for both services under the same parent domain (for example, `portfolio.example.com` and `api.example.com`) when possible. The included Render configuration uses `SameSite=None` for the default cross-site `vercel.app`/`onrender.com` setup, but browsers may block third-party cookies; a shared custom domain is more reliable for admin sessions.
4. Do not commit either `.env` file. Rotate local development credentials before deployment and enter fresh secrets directly in the hosting dashboards.

`VITE_API_URL` is public configuration and is embedded in browser assets. Never store database credentials, the admin password, session secret, or Cloudinary API secret in Vercel's `VITE_*` variables.

## Admin features

- Login uses the `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment values in the Go API's `.env`.
- Create, update, and delete portfolio projects.
- Upload JPEG, PNG, or WebP project images up to 12 MB. The browser crops them to 16:9 and compresses them to WebP before upload.
- Replace the About profile photo from the protected admin dashboard; public visitors cannot upload a profile image.
- Convert previously uploaded JPEG project photos to WebP from the projects dashboard.
- Edit History milestones, About technologies, and social profile links from the admin sidebar.
- Project data is persisted in PostgreSQL. Admin sessions use signed, HTTP-only cookies that expire after eight hours.

Do not commit either `.env` file. Set the API environment variables in the hosting provider in production. For a single-origin host, build the frontend and run the API as separate processes behind a reverse proxy that routes `/api` and `/uploads` to the Go API:

```sh
npm run build
cd ..\portfolio-api
go run .
```

Persist `portfolio-api/public/uploads/` on the host or mount it to durable storage; the database stores the public image path. The API retains its existing `GET /api/projects` response envelope and now also provides admin login, CRUD, and upload endpoints.
