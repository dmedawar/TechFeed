import { createClient } from '@supabase/supabase-js'
import { runIngest } from '../../scripts/ingest.mjs'

async function shouldThrottle(supabase, minutes) {
  if (!minutes || minutes <= 0) return false
  const { data, error } = await supabase
    .from('feed_items')
    .select('updated_at')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error || !data?.updated_at) return false
  return (
    Date.now() - new Date(data.updated_at).getTime() < minutes * 60 * 1000
  )
}

/**
 * Background-style ingest: returns quickly, then runs the full RSS pipeline on Netlify.
 * Env (Netlify UI, not VITE_*): SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
 * optional INGEST_TRIGGER_SECRET, INGEST_THROTTLE_MINUTES (default 12), FEED_RETENTION_DAYS.
 */
export default async (request) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'POST only' }), {
      status: 405,
      headers: { 'content-type': 'application/json' },
    })
  }

  const configuredSecret = process.env.INGEST_TRIGGER_SECRET
  const hdr = request.headers.get('x-techfeed-ingest-secret')
  if (configuredSecret && hdr !== configuredSecret) {
    return new Response(JSON.stringify({ ok: false, error: 'unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    })
  }

  const url = new URL(request.url)
  const force = url.searchParams.get('force') === '1'

  const sbUrl = process.env.SUPABASE_URL
  const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!sbUrl || !sbKey) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY on Netlify',
      }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    )
  }

  const supabase = createClient(sbUrl, sbKey)
  const throttleMin = Number.parseInt(
    process.env.INGEST_THROTTLE_MINUTES ?? '12',
    10,
  )
  if (!force && (await shouldThrottle(supabase, throttleMin))) {
    return new Response(
      JSON.stringify({ ok: true, skipped: true, reason: 'throttle' }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    )
  }

  void runIngest().catch((err) => {
    console.error('[ingest-background]', err)
  })

  return new Response(
    JSON.stringify({ ok: true, started: true, note: 'runs in background' }),
    {
      status: 202,
      headers: { 'content-type': 'application/json' },
    },
  )
}
