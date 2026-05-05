/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_GITHUB_ACTIONS_INGEST_URL?: string
  /** Optional absolute URL to official wordmark (light version for dark UI) */
  readonly VITE_BRAND_LOGO_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
