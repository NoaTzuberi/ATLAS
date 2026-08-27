ATLAS — Deployment Guide

Version 1.0

⸻

1. Stack

* Frontend: Vercel (Vite/React static build)
* Backend: Render (Node/Express, free tier)
* Database: MongoDB Atlas (already in use — `DATABASE_URL` in `server/.env` already points to a cloud cluster, nothing to migrate)

⸻

2. Backend — Render

Render reads `render.yaml` at the repo root automatically when you connect the repo ("Blueprint" deploy), so most settings are pre-filled:

* Root directory: `server`
* Build command: `npm install && npm run build`
* Start command: `npm start`
* Health check: `/api/health`

Steps:

1. Push this repo to GitHub (already done) and sign in to Render with GitHub.
2. New → Blueprint → select the ATLAS repo. Render should detect `render.yaml` and propose the `atlas-api` service.
3. Fill in the environment variables Render will prompt for (marked `sync: false` in `render.yaml`, so they're not stored in git):
   - `DATABASE_URL` — same value as `server/.env`
   - `JWT_SECRET` — do **not** reuse the local dev value. Use a strong generated one, e.g.:
     ```
     UiqIuNl2ktMi3LMIYfuf+vOaZR4d5nSs5fdqctXZReNPX70WWf2t/1myFpVIvnhF
     ```
     (generated once for this guide — treat it as sensitive, don't commit it anywhere)
   - `GEMINI_API_KEY` — same value as `server/.env`
   - `VOYAGE_API_KEY` — same value as `server/.env`
   - `RESEND_API_KEY` — same value as `server/.env` (powers password-reset emails)
   - `EMAIL_FROM` — optional; only set it if you're using a custom "from" address instead of Resend's default sandbox sender
   - `CLIENT_ORIGIN` — leave blank for now; come back and set it once the Vercel URL exists (step 3.5) — this is the CORS allow-list
   - `CLIENT_URL` — leave blank for now too; come back and set it alongside `CLIENT_ORIGIN` (step 3.5) — this is the URL baked into password-reset email links, **not** the same variable as `CLIENT_ORIGIN` even though they'll end up holding the same value
4. Deploy. Once live, note the service URL (e.g. `https://atlas-api.onrender.com`).

Note: the app now refuses to start in production if `JWT_SECRET` isn't set to something other than the dev default — this is intentional (see `server/src/config/env.ts`).

Render's free tier spins the service down after ~15 minutes idle; the first request after a quiet period takes 30-60s to wake up. Fine for a demo, worth knowing before a live presentation.

⸻

3. Frontend — Vercel

1. Sign in to Vercel with GitHub, import the ATLAS repo.
2. Set **Root Directory** to `client` in the project's settings. Framework preset (Vite) is auto-detected.
3. Add environment variable:
   - `VITE_API_URL` = `https://<your-render-service>.onrender.com/api`
4. Deploy. Note the resulting URL (e.g. `https://atlas.vercel.app`).
5. Go back to Render → the `atlas-api` service → environment → set **both** `CLIENT_ORIGIN` and `CLIENT_URL` to this exact Vercel URL, then redeploy the backend. `CLIENT_ORIGIN` unlocks CORS for the frontend; `CLIENT_URL` is what gets embedded in password-reset email links — skipping either one leaves that piece broken even though the rest of the app works.

`client/vercel.json` already handles SPA routing (rewrites every path to `index.html` so direct links like `/exercises/bench-press` or a page refresh on `/dashboard` don't 404).

⸻

4. Known gap — RepDB exercise media

`server/data/repdb-preview/images` (53MB, CC BY-NC 4.0, gitignored) is not in git, so it won't exist on Render. RepDB-enhanced exercises will fall back to their placeholder instead of a real image/GIF until this is addressed — deliberately deferred, not a bug. Revisit later: either upload the folder directly onto a Render persistent disk, or move the images to object storage (e.g. Cloudflare R2) and update `ExerciseMedia`'s URLs.

⸻

5. Post-deploy checklist

* `GET https://<render-url>/api/health` returns 200
* Vercel URL loads, Landing page renders
* Register/Login works end-to-end against the deployed API
* Exercise Library loads and filters
* Start + complete a workout, confirm it saves
* Coach widget sends a message and gets a real reply (confirms `GEMINI_API_KEY`/`VOYAGE_API_KEY` made it to Render correctly)
* "Forgot password" sends a real email with a link pointing at the **Vercel** URL, not localhost (confirms `RESEND_API_KEY` and `CLIENT_URL` are both set correctly)
