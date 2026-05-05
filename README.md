# The 1916 Company Tech Feed

Curated AI, tech, and engineering feed backed by Supabase, with RSS ingest on a **GitHub Actions** schedule and a Vite + React + Tailwind UI that **only reads** the database.

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

**Schedule:** `.github/workflows/ingest.yml` runs **every 4 hours** UTC on **weekdays** (`0 */4 * * 1-5`), **every 8 hours** on **weekends** (`0 */8 * * 0,6`; Sat–Sun in UTC), plus **workflow_dispatch** for manual runs. Add repository secrets `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` under **Settings → Secrets and variables → Actions**.

**GitHub Actions minutes (private repo):** Free accounts include **2,000 minutes/month**. That schedule is about **36 runs/week** (~**156/month**), still typically **well under** the cap if each run is a few minutes.

Ingest includes the [Anthropic newsroom](https://www.anthropic.com/news) (HTML list; no public RSS), Google News 24h slices for major AI brands (in the **AI** section), and RSS sources. The **General** lane is limited to platform newsrooms and technology-scoped aggregators (no broad “top stories” or world-politics feeds).

## Deploy to Netlify ($0)

**Netlify** hosts the static app; **ingest does not run on Netlify** (only in GitHub Actions or locally).

1. Import the repo in [Netlify](https://www.netlify.com/).
2. Build: `npm ci && npm run build`, publish `dist` (from `netlify.toml`).
3. **Environment variables** (Production / previews): **`VITE_SUPABASE_URL`** and **`VITE_SUPABASE_ANON_KEY`** only. Redeploy after changes (clear cache if needed).

You can **remove** `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` from Netlify if you added them earlier—they are not used by the static build.

Optional: `VITE_GITHUB_ACTIONS_INGEST_URL` (link to **Run workflow** for ingest), `VITE_BRAND_LOGO_URL` — see `.env.example`.

## Debug (local only)

- **Ingest:** Run `npm run ingest` on your machine (not GitHub Actions). With `CI` / `GITHUB_ACTIONS` unset, the script prints `[TechFeed ingest:debug]` lines. To mute: `TECHFEED_SILENCE_DEBUG=1 npm run ingest`.
- **Browser / API:** Run `npm run dev` and open DevTools → **Console**. Filter for `[TechFeed feed:debug]` for Supabase query diagnostics. Production strips these calls.

## If articles look weeks old

The UI only reads Supabase; it does not crawl RSS. Stale data usually means the **Action failed**, **secrets are wrong**, or the schedule hasn’t run yet—use **workflow_dispatch** or widen the date filter to **All time**, then **Reload from database**.
