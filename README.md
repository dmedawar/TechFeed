# Tech Feed

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

## Deploy

Netlify config lives in `netlify.toml`. Set the same Supabase env vars for production builds.
