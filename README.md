# The 1916 Company Tech Feed

Curated AI, tech, and engineering feed backed by Supabase, with RSS ingest (Netlify background function on site load + optional GitHub Actions schedule) and a Vite + React + Tailwind UI.

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

Requires `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Each run **upserts** by `url` (new or updated rows overwrite older data for the same link). After upsert, rows older than **`FEED_RETENTION_DAYS`** (default **60**) are **deleted** so the table stays a bounded cache.

The workflow in `.github/workflows/ingest.yml` runs every four hours (plus manual dispatch). The **live site** also `POST`s `/.netlify/functions/ingest-background` once on load (throttled, see Netlify env below) so the team does not depend only on GitHub.

Ingest includes the [Anthropic newsroom](https://www.anthropic.com/news) (HTML list; no public RSS), Google News 24h slices for major AI brands (in the **AI** section), and RSS sources. The **General** lane is limited to platform newsrooms and technology-scoped aggregators (no broad “top stories” or world-politics feeds).

## Deploy to Netlify ($0)

You can run the whole stack on free tiers: **Netlify** (static hosting and builds), **Supabase** (free database for hobby projects), and **GitHub Actions** (free minutes on public repositories).

1. Push this repository to GitHub (if it is not already there).
2. In [Netlify](https://www.netlify.com/), sign up with GitHub and choose **Add new site** → **Import an existing project** → pick this repo.
3. Netlify reads `netlify.toml` automatically: build command `npm ci && npm run build`, publish directory `dist`.
4. Under **Site configuration** → **Environment variables**, add (for **Production** and **Deploy previews**):

   **Build-time (Vite — safe to expose in the client bundle):**
   - `VITE_SUPABASE_URL` — Supabase project URL (`https://….supabase.co`)
   - `VITE_SUPABASE_ANON_KEY` — publishable / anon key  
   - Optional: `VITE_INGEST_TRIGGER_SECRET` — if you set `INGEST_TRIGGER_SECRET` below, use the **same** value so the browser can call the ingest function
   - Optional: `VITE_NETLIFY_INGEST_URL` — full URL to the function if not same-origin

   **Runtime (Netlify Functions only — never `VITE_*`):**
   - `SUPABASE_URL` — same project URL
   - `SUPABASE_SERVICE_ROLE_KEY` — service role key (ingest writes/prunes the table)
   - Optional: `INGEST_TRIGGER_SECRET` — if set, requests must send header `x-techfeed-ingest-secret` (and the matching `VITE_INGEST_TRIGGER_SECRET` in the client)
   - Optional: `INGEST_THROTTLE_MINUTES` — default `12`; skip starting a new ingest if `feed_items` was updated more recently (use `?force=1` on the function URL to bypass when testing)
   - Optional: `FEED_RETENTION_DAYS` — default `60` (prune `published_at` older than this many days)

   After changing `VITE_*`, trigger **Deploys** → **Clear cache and deploy site**.

5. Deploy. Netlify serves the static app and bundles `netlify/functions/ingest-background.mjs` (see `netlify.toml` `included_files` for `scripts/**`).

**Scheduled ingest (optional):** Add GitHub secrets `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`; `.github/workflows/ingest.yml` still runs on a cron.

Other optional Vite vars: `VITE_BRAND_LOGO_URL`, `VITE_GITHUB_ACTIONS_INGEST_URL` — see `.env.example`.

## Debug (local only)

- **Ingest:** Run `npm run ingest` on your machine (not GitHub Actions). With `CI` / `GITHUB_ACTIONS` unset, the script prints `[TechFeed ingest:debug]` lines: per-feed newest `published_at`, lane totals, and the top rows before upsert. To mute: `TECHFEED_SILENCE_DEBUG=1 npm run ingest`.
- **Browser / API:** Run `npm run dev` and open DevTools → **Console**. Filter for `[TechFeed feed:debug]` to see each Supabase query (`publishedAfter` / `publishedBefore`, row counts, newest row on the page) and cache hits. Production (`npm run build`) strips these calls.

## If articles look weeks old

The UI reads **only** from Supabase when `VITE_*` keys are set; it does not crawl RSS in the browser. Stale dates almost always mean **ingest is not updating the database** (missing or wrong GitHub Action secrets, workflow failures, or migrations not applied). After fixing ingest, use **Reload from database** in the app (or widen the date filter to **All time**). If `VITE_SUPABASE_*` is missing on Netlify, the yellow banner appears and you only see static sample rows — add those env vars and redeploy.