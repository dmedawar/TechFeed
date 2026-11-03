import {
  GLOBAL_SEARCH_MIN_CHARS,
  normalizeGlobalSearchQuery,
} from '@/lib/searchQuery'
import type { FeedItemRow } from '@/types'

type FeedSnapshotFile = {
  generated_at?: string
  items?: FeedItemRow[]
}

let snapshotPromise: Promise<FeedItemRow[]> | null = null

/** Articles written by ingest into `public/feed-snapshot.json`. */
export function loadFeedSnapshot(): Promise<FeedItemRow[]> {
  if (!snapshotPromise) {
    snapshotPromise = fetch('/feed-snapshot.json')
      .then(async (response) => {
        if (!response.ok) return []
        const body = (await response.json()) as FeedSnapshotFile
        return Array.isArray(body.items) ? body.items : []
      })
      .catch(() => [])
  }
  return snapshotPromise
}

function inPublishedWindow(
  row: FeedItemRow,
  publishedAfter: string | null,
  publishedBefore: string | null,
): boolean {
  const t = new Date(row.published_at).getTime()
  if (!Number.isFinite(t)) return false
  if (publishedAfter && t < new Date(publishedAfter).getTime()) return false
  if (publishedBefore && t > new Date(publishedBefore).getTime()) return false
  return true
}

function sortNewest(rows: FeedItemRow[]): FeedItemRow[] {
  return [...rows].sort((a, b) => {
    const byDate =
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    if (byDate !== 0) return byDate
    return b.id.localeCompare(a.id)
  })
}

export async function snapshotFeedPage(params: {
  section: FeedItemRow['section']
  tagFilter: string[] | null
  publishedAfter: string | null
  publishedBefore: string | null
  from: number
  to: number
}): Promise<FeedItemRow[]> {
  if (
    (params.section === 'programming' || params.section === 'integrations') &&
    !params.tagFilter?.length
  ) {
    return []
  }

  const tags = new Set(params.tagFilter ?? [])
  const rows = (await loadFeedSnapshot()).filter((row) => {
    if (row.section !== params.section) return false
    if (!inPublishedWindow(row, params.publishedAfter, params.publishedBefore)) {
      return false
    }
    if (tags.size > 0 && !row.tags.some((tag) => tags.has(tag))) return false
    return true
  })
  return sortNewest(rows).slice(params.from, params.to + 1)
}

export async function snapshotSearchPage(params: {
  search: string
  publishedAfter: string | null
  publishedBefore: string | null
  from: number
  to: number
}): Promise<FeedItemRow[]> {
  const normalized = normalizeGlobalSearchQuery(params.search).toLowerCase()
  if (normalized.length < GLOBAL_SEARCH_MIN_CHARS) return []

  const rows = (await loadFeedSnapshot()).filter((row) => {
    if (!inPublishedWindow(row, params.publishedAfter, params.publishedBefore)) {
      return false
    }
    const haystack = `${row.title} ${row.summary ?? ''} ${row.source_name ?? ''}`.toLowerCase()
    return haystack.includes(normalized)
  })
  return sortNewest(rows).slice(params.from, params.to + 1)
}
