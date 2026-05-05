import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getSeedItemsForView } from '@/data/seedArticles'
import { PAGE_SIZE } from '@/lib/constants'
import {
  filterItemsByPublishedBounds,
  type PublishedBounds,
} from '@/lib/dateRangeFilter'
import {
  feedLaneKey,
  invalidateFeedLane,
  readFeedLane,
  reconcileFeedPage,
  writeFeedLane,
} from '@/lib/feedCache'
import { mergeDedupeSort } from '@/lib/feedMerge'
import { fetchFeedPage } from '@/lib/supabase'
import type { FeedItemRow, FeedSection } from '@/types'

export function useFeed(params: {
  section: FeedSection
  tagFilter: string[] | null
  dateBounds: PublishedBounds
}) {
  const [items, setItems] = useState<FeedItemRow[]>([])
  const [loading, setLoading] = useState(true)
  /** True while revalidating in the background after showing a cached first page. */
  const [refreshing, setRefreshing] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const pageRef = useRef(0)
  const mergedTailRef = useRef<FeedItemRow[]>([])
  const dbExhaustedRef = useRef(false)

  const seedForView = useMemo(() => {
    const raw = getSeedItemsForView(params.section, params.tagFilter)
    return filterItemsByPublishedBounds(raw, params.dateBounds)
  }, [params.section, params.tagFilter, params.dateBounds])

  const laneKey = useMemo(
    () =>
      feedLaneKey(params.section, params.tagFilter, {
        publishedAfter: params.dateBounds.publishedAfter,
        publishedBefore: params.dateBounds.publishedBefore,
      }),
    [
      params.section,
      params.tagFilter,
      params.dateBounds.publishedAfter,
      params.dateBounds.publishedBefore,
    ],
  )

  const applyMerged = useCallback(
    (dbData: FeedItemRow[]) => {
      const merged = mergeDedupeSort(dbData, seedForView)
      const first = merged.slice(0, PAGE_SIZE)
      mergedTailRef.current = merged.slice(PAGE_SIZE)
      setItems(first)
      const moreFromMerge = mergedTailRef.current.length > 0
      const moreFromDb = dbData.length === PAGE_SIZE
      setHasMore(moreFromMerge || moreFromDb)
      if (!moreFromDb) {
        dbExhaustedRef.current = true
      } else {
        pageRef.current = 1
      }
    },
    [seedForView],
  )

  const resetAndLoad = useCallback(
    async (options?: { skipCache?: boolean }) => {
      const skipCache = options?.skipCache === true
      const cached = skipCache ? null : readFeedLane(laneKey)

      pageRef.current = 0
      mergedTailRef.current = []
      dbExhaustedRef.current = false
      setHasMore(true)

      if (cached?.dbFirstPage?.length) {
        applyMerged(cached.dbFirstPage)
        setLoading(false)
      } else {
        setLoading(true)
      }

      if (skipCache) {
        invalidateFeedLane(laneKey)
      }

      const hadCache = Boolean(cached?.dbFirstPage?.length)
      if (hadCache) setRefreshing(true)
      try {
        const { data: dbData, error: err } = await fetchFeedPage({
          section: params.section,
          tagFilter: params.tagFilter,
          publishedAfter: params.dateBounds.publishedAfter,
          publishedBefore: params.dateBounds.publishedBefore,
          from: 0,
          to: PAGE_SIZE - 1,
        })

        if (err) {
          if (!cached?.dbFirstPage?.length) {
            applyMerged([])
          }
          return
        }

        const reconciled = reconcileFeedPage(cached?.dbFirstPage, dbData)
        applyMerged(reconciled)
        if (dbData.length > 0) {
          writeFeedLane(laneKey, dbData)
        }
      } finally {
        if (hadCache) setRefreshing(false)
        setLoading(false)
      }
    },
    [applyMerged, laneKey, params.dateBounds, params.section, params.tagFilter],
  )

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore || loading) return

    if (mergedTailRef.current.length > 0) {
      setLoadingMore(true)
      const chunk = mergedTailRef.current.slice(0, PAGE_SIZE)
      mergedTailRef.current = mergedTailRef.current.slice(PAGE_SIZE)
      setItems((prev) => {
        const seen = new Set(prev.map((p) => p.url))
        const out = [...prev]
        for (const row of chunk) {
          if (!seen.has(row.url)) {
            seen.add(row.url)
            out.push(row)
          }
        }
        return out
      })
      const stillTail = mergedTailRef.current.length > 0
      const dbMore = !dbExhaustedRef.current
      setHasMore(stillTail || dbMore)
      setLoadingMore(false)
      return
    }

    if (dbExhaustedRef.current) {
      setHasMore(false)
      return
    }

    setLoadingMore(true)
    const from = pageRef.current * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    const { data, error: err } = await fetchFeedPage({
      section: params.section,
      tagFilter: params.tagFilter,
      publishedAfter: params.dateBounds.publishedAfter,
      publishedBefore: params.dateBounds.publishedBefore,
      from,
      to,
    })
    if (err) {
      setHasMore(false)
      setLoadingMore(false)
      return
    }
    if (data.length < PAGE_SIZE) {
      dbExhaustedRef.current = true
    }
    if (data.length === 0) {
      dbExhaustedRef.current = true
      setHasMore(false)
      setLoadingMore(false)
      return
    }
    setItems((prev) => {
      const seen = new Set(prev.map((p) => p.url))
      const out = [...prev]
      for (const row of data) {
        if (!seen.has(row.url)) {
          seen.add(row.url)
          out.push(row)
        }
      }
      return out
    })
    pageRef.current += 1
    setHasMore(data.length === PAGE_SIZE)
    setLoadingMore(false)
  }, [
    hasMore,
    loading,
    loadingMore,
    params.dateBounds,
    params.section,
    params.tagFilter,
  ])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch updates list state for new query key
    void resetAndLoad()
  }, [resetAndLoad])

  const reload = useCallback(() => {
    void resetAndLoad({ skipCache: true })
  }, [resetAndLoad])

  return {
    items,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    reload,
    loadMore,
  }
}
