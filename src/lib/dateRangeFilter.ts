import type { FeedItemRow } from '@/types'

export type DatePresetId = 'all' | '7d' | '30d' | '90d' | 'custom'

export type PublishedBounds = {
  publishedAfter: string | null
  publishedBefore: string | null
}

function startOfUtcDayIso(ymd: string): string {
  const [y, m, d] = ymd.split('-').map(Number)
  if (!y || !m || !d) return ''
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0)).toISOString()
}

function endOfUtcDayIso(ymd: string): string {
  const [y, m, d] = ymd.split('-').map(Number)
  if (!y || !m || !d) return ''
  return new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999)).toISOString()
}

/** Maps UI preset + optional custom YYYY-MM-DD fields to Supabase filter bounds. */
export function toPublishedBounds(
  preset: DatePresetId,
  customFromYmd: string,
  customToYmd: string,
): PublishedBounds {
  const now = new Date()
  if (preset === 'all') {
    return { publishedAfter: null, publishedBefore: null }
  }
  if (preset === '7d' || preset === '30d' || preset === '90d') {
    const days = preset === '7d' ? 7 : preset === '30d' ? 30 : 90
    const after = new Date(now.getTime() - days * 86400000)
    return { publishedAfter: after.toISOString(), publishedBefore: null }
  }
  const from = customFromYmd?.trim()
  const to = customToYmd?.trim()
  if (!from || !to) {
    return { publishedAfter: null, publishedBefore: null }
  }
  const startIso = startOfUtcDayIso(from)
  const endIso = endOfUtcDayIso(to)
  if (!startIso || !endIso) {
    return { publishedAfter: null, publishedBefore: null }
  }
  if (new Date(startIso).getTime() > new Date(endIso).getTime()) {
    return { publishedAfter: null, publishedBefore: null }
  }
  return { publishedAfter: startIso, publishedBefore: endIso }
}

export function hasActiveDateFilter(bounds: PublishedBounds): boolean {
  return bounds.publishedAfter !== null || bounds.publishedBefore !== null
}

export function filterItemsByPublishedBounds(
  items: FeedItemRow[],
  bounds: PublishedBounds,
): FeedItemRow[] {
  if (!hasActiveDateFilter(bounds)) return items
  const { publishedAfter, publishedBefore } = bounds
  const tAfter = publishedAfter ? new Date(publishedAfter).getTime() : null
  const tBefore = publishedBefore ? new Date(publishedBefore).getTime() : null
  return items.filter((item) => {
    const t = new Date(item.published_at).getTime()
    if (tAfter !== null && t < tAfter) return false
    if (tBefore !== null && t > tBefore) return false
    return true
  })
}
