import { useEffect, useRef } from 'react'
import { isSupabaseConfigured } from '@/lib/supabase'

const DEFAULT_FN = '/.netlify/functions/ingest-background'

/**
 * Fire-and-forget POST to Netlify background ingest so the DB fills/updates on first load.
 * Requires the same secrets on Netlify as ingest (service role + optional trigger header).
 */
export function useLaunchIngest(reloadFeed: () => void) {
  const ran = useRef(false)
  const reloadRef = useRef(reloadFeed)

  useEffect(() => {
    reloadRef.current = reloadFeed
  }, [reloadFeed])

  useEffect(() => {
    if (!isSupabaseConfigured || ran.current) return
    ran.current = true

    const fnUrl =
      import.meta.env.VITE_NETLIFY_INGEST_URL?.trim() ||
      (typeof window !== 'undefined'
        ? `${window.location.origin}${DEFAULT_FN}`
        : '')

    if (!fnUrl) return

    const secret = import.meta.env.VITE_INGEST_TRIGGER_SECRET
    const headers: HeadersInit = {}
    if (secret) headers['x-techfeed-ingest-secret'] = secret

    void (async () => {
      try {
        const res = await fetch(fnUrl, { method: 'POST', headers })
        if (res.ok || res.status === 202) {
          await new Promise((r) => setTimeout(r, 3000))
          reloadRef.current()
        }
      } catch {
        /* non-fatal */
      }
    })()
  }, [])
}
