# The 1916 Company Tech Feed

Curated AI, tech, and engineering feed backed by Supabase, with RSS ingest (GitHub Actions) and a Vite + React + Tailwind UI.

## Setup

```bash
npm ci
cp .env.example .env
```

Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Apply migrations under `supabase/migrations/`.

```bash
npm run dev
npm run build
```

## Ingest

```bash
npm run ingest
```

Requires `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. The workflow in `.github/workflows/ingest.yml` runs on a schedule.

## Deploy to Netlify ($0)

You can run the whole stack on free tiers: **Netlify** (static hosting and builds), **Supabase** (free database for hobby projects), and **GitHub Actions** (free minutes on public repositories).

1. Push this repository to GitHub (if it is not already there).
2. In [Netlify](https://www.netlify.com/), sign up with GitHub and choose **Add new site** → **Import an existing project** → pick this repo.
3. Netlify reads `netlify.toml` automatically: build command `npm ci && npm run build`, publish directory `dist`.
4. Under **Site configuration** → **Environment variables**, add (for **Production** and **Deploy previews**):
   - `VITE_SUPABASE_URL` — your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` — your Supabase anon (public) key  
   These are baked in at build time; trigger **Deploys** → **Trigger deploy** → **Clear cache and deploy site** after changing them.
5. Deploy. Netlify gives you a URL like `https://something.netlify.app` to share with your team. Custom domains on Netlify are included on the free plan.

**Backend and ingest (still $0):** Keep using a free Supabase project. For scheduled ingest, add repository secrets `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in GitHub (**Settings** → **Secrets and variables** → **Actions**); the workflow in `.github/workflows/ingest.yml` runs on a cron without paid infrastructure.

Optional: `VITE_BRAND_LOGO_URL` and `VITE_GITHUB_ACTIONS_INGEST_URL` — see `.env.example`.
