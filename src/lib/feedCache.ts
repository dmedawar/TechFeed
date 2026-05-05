import type { PublishedBounds } from '@/lib/dateRangeFilter'
import type { FeedItemRow } from '@/types'

const STORAGE_ROOT = 'techfeed-feed-cache'
const SCHEMA_VERSION = 1
const MAX_LANES = 8

type LaneCache = {
  /** Raw first-page rows from Supabase (range 0..PAGE_SIZE-1), before merge with seed. */
  dbFirstPage: FeedItemRow[]
  savedAt: number
}

type FeedCacheBlob = {
  schemaVersion: number
  lanes: Record<string, LaneCache>
  laneOrder: string[]
}

function emptyBlob(): FeedCacheBlob {
  return { schemaVersion: SCHEMA_VERSION, lanes: {}, laneOrder: [] }
}

function readBlob(): FeedCacheBlob {
  try {
    const raw = localStorage.getItem(STORAGE_ROOT)
    if (!raw) return emptyBlob()
    const p = JSON.parse(raw) as Partial<FeedCacheBlob>
    if (p.schemaVersion !== SCHEMA_VERSION || typeof p.lanes !== 'object' || !p.lanes) {
      return emptyBlob()
    }
    return {
      schemaVersion: SCHEMA_VERSION,
      lanes: p.lanes,
      laneOrder: Array.isArray(p.laneOrder)
        ? p.laneOrder
        : Object.keys(p.lanes),
    }
  } catch {
    return emptyBlob()
  }
}

function writeBlob(blob: FeedCacheBlob) {
  try {
    localStorage.setItem(STORAGE_ROOT, JSON.stringify(blob))
  } catch {
    /* quota / private mode */
  }
}

export function feedLaneKey(
  section: string,
  tagFilter: string[] | null,
  bounds: Pick<PublishedBounds, 'publishedAfter' | 'publishedBefore'>,
): string {
  const tags = tagFilter?.length ? [...tagFilter].sort().join('\0') : ''
  return `${section}|${tags}|${bounds.publishedAfter ?? ''}|${bounds.publishedBefore ?? ''}`
}

export function readFeedLane(laneKey: string): LaneCache | null {
  const b = readBlob()
  const lane = b.lanes[laneKey]
  if (!lane?.dbFirstPage?.length) return null
  return lane
}

export function writeFeedLane(laneKey: string, dbFirstPage: FeedItemRow[]) {
  if (!dbFirstPage.length) return
  const b = readBlob()
  const order = b.laneOrder.filter((k) => k !== laneKey)
  order.push(laneKey)
  while (order.length > MAX_LANES) {
    const drop = order.shift()
    if (drop) delete b.lanes[drop]
  }
  b.lanes[laneKey] = {
    dbFirstPage: dbFirstPage.map((r) => ({ ...r })),
    savedAt: Date.now(),
  }
  b.laneOrder = order
  writeBlob(b)
}

export function invalidateFeedLane(laneKey: string) {
  const b = readBlob()
  if (!b.lanes[laneKey]) return
  delete b.lanes[laneKey]
  b.laneOrder = b.laneOrder.filter((k) => k !== laneKey)
  writeBlob(b)
}

function rowVersionKey(row: FeedItemRow): string {
  return row.updated_at ?? row.created_at
}

/**
 * Reuse previous row objects when the server reports the same content version
 * (`updated_at`), so unchanged articles stay on cached references after a refresh.
 */
export function reconcileFeedPage(
  previous: FeedItemRow[] | undefined,
  incoming: FeedItemRow[],
): FeedItemRow[] {
  if (!previous?.length) return incoming
  const byId = new Map(previous.map((r) => [r.id, r]))
  return incoming.map((row) => {
    const prev = byId.get(row.id)
    if (!prev) return row
    if (rowVersionKey(row) === rowVersionKey(prev)) return prev
    return row
  })
}
