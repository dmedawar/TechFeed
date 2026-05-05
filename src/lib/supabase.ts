import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { feedDebug } from '@/lib/feedDebug'
import {
  GLOBAL_SEARCH_MIN_CHARS,
  normalizeGlobalSearchQuery,
} from '@/lib/searchQuery'
import type { CustomTopicRow, FeedItemRow } from '@/types'

const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anon)

export const supabase: SupabaseClient | null =
  url && anon ? createClient(url, anon) : null

/** Escape `%`, `_`, and `\` for Postgres `ILIKE` patterns. */
function escapeIlikePattern(fragment: string): string {
  return fragment
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_')
}

export async function fetchFeedSearchPage(params: {
  search: string
  publishedAfter: string | null
  publishedBefore: string | null
  from: number
  to: number
}) {
  if (!supabase) {
    feedDebug('fetchFeedSearchPage', {
      result: 'NOT_CONFIGURED',
      params,
    })
    return {
      data: [] as FeedItemRow[],
      error: new Error('NOT_CONFIGURED'),
    }
  }

  const normalized = normalizeGlobalSearchQuery(params.search)
  if (normalized.length < GLOBAL_SEARCH_MIN_CHARS) {
    feedDebug('fetchFeedSearchPage', {
      result: 'query_too_short',
      params,
    })
    return { data: [] as FeedItemRow[], error: null }
  }

  const pattern = `%${escapeIlikePattern(normalized)}%`

  let q = supabase
    .from('feed_items')
    .select('*')
    .or(
      `title.ilike.${pattern},summary.ilike.${pattern},source_name.ilike.${pattern}`,
    )

  if (params.publishedAfter) {
    q = q.gte('published_at', params.publishedAfter)
  }
  if (params.publishedBefore) {
    q = q.lte('published_at', params.publishedBefore)
  }

  q = q
    .order('published_at', { ascending: false })
    .order('id', { ascending: false })
    .range(params.from, params.to)

  const { data, error } = await q
  const rows = (data ?? []) as FeedItemRow[]
  if (error) {
    feedDebug('fetchFeedSearchPage', {
      result: 'error',
      message: error.message,
      params,
    })
    return { data: [], error: new Error(error.message) }
  }
  feedDebug('fetchFeedSearchPage', {
    result: 'ok',
    rowCount: rows.length,
    range: [params.from, params.to],
    queryLen: normalized.length,
  })
  return { data: rows, error: null }
}

export async function fetchFeedPage(params: {
  section: FeedItemRow['section']
  tagFilter: string[] | null
  publishedAfter: string | null
  publishedBefore: string | null
  from: number
  to: number
}) {
  if (!supabase) {
    feedDebug('fetchFeedPage', {
      result: 'NOT_CONFIGURED',
      params,
    })
    return {
      data: [] as FeedItemRow[],
      error: new Error('NOT_CONFIGURED'),
    }
  }

  let q = supabase
    .from('feed_items')
    .select('*')
    .eq('section', params.section)

  if (params.publishedAfter) {
    q = q.gte('published_at', params.publishedAfter)
  }
  if (params.publishedBefore) {
    q = q.lte('published_at', params.publishedBefore)
  }

  if (params.section === 'programming' || params.section === 'integrations') {
    if (!params.tagFilter?.length) {
      feedDebug('fetchFeedPage', {
        result: 'empty (no tags for section)',
        section: params.section,
      })
      return { data: [], error: null }
    }
    q = q.overlaps('tags', params.tagFilter)
  }

  q = q
    .order('published_at', { ascending: false })
    .order('id', { ascending: false })
    .range(params.from, params.to)

  const { data, error } = await q
  const rows = (data ?? []) as FeedItemRow[]
  if (error) {
    feedDebug('fetchFeedPage', {
      result: 'error',
      message: error.message,
      params,
    })
    return { data: [], error: new Error(error.message) }
  }
  feedDebug('fetchFeedPage', {
    result: 'ok',
    rowCount: rows.length,
    range: [params.from, params.to],
    newestPublishedAt: rows[0]?.published_at ?? null,
    oldestOnPage: rows[rows.length - 1]?.published_at ?? null,
    params: {
      section: params.section,
      publishedAfter: params.publishedAfter,
      publishedBefore: params.publishedBefore,
      tagFilter: params.tagFilter,
    },
  })
  return { data: rows, error: null }
}

export async function fetchCustomTopics() {
  if (!supabase) return { data: [] as CustomTopicRow[], error: null as Error | null }
  const { data, error } = await supabase
    .from('custom_topics')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) return { data: [], error: new Error(error.message) }
  return { data: (data ?? []) as CustomTopicRow[], error: null }
}

export async function insertCustomTopic(row: {
  kind: CustomTopicRow['kind']
  slug: string
  label: string
  icon_slug: string | null
}) {
  if (!supabase) return { error: new Error('Supabase is not configured') }
  const { error } = await supabase.from('custom_topics').insert(row)
  return { error: error ? new Error(error.message) : null }
}
