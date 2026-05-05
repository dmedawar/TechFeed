import type { FeedItemRow } from '@/types'

/** Prefer database rows over seed when URLs match. */
export function mergeDedupeSort(
  dbRows: FeedItemRow[],
  seedRows: FeedItemRow[],
): FeedItemRow[] {
  const byUrl = new Map<string, FeedItemRow>()
  for (const s of seedRows) {
    byUrl.set(s.url, s)
  }
  for (const d of dbRows) {
    byUrl.set(d.url, d)
  }
  return [...byUrl.values()].sort((a, b) => {
    const tb = new Date(b.published_at).getTime()
    const ta = new Date(a.published_at).getTime()
    if (tb !== ta) return tb - ta
    return b.id.localeCompare(a.id)
  })
}
