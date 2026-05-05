/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_GITHUB_ACTIONS_INGEST_URL?: string
  /** Optional absolute URL to official wordmark (light version for dark UI) */
  readonly VITE_BRAND_LOGO_URL?: string
  /** Same value as Netlify `INGEST_TRIGGER_SECRET` when set; sent as `x-techfeed-ingest-secret`. */
  readonly VITE_INGEST_TRIGGER_SECRET?: string
  /** Override ingest function URL (default: origin + `/.netlify/functions/ingest-background`). */
  readonly VITE_NETLIFY_INGEST_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
