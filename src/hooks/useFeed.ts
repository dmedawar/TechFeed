import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  getSeedItemsForGlobalSearch,
  getSeedItemsForView,
} from '@/data/seedArticles'
import { PAGE_SIZE } from '@/lib/constants'
import {
  filterItemsByPublishedBounds,
  type PublishedBounds,
} from '@/lib/dateRangeFilter'
import { feedDebug } from '@/lib/feedDebug'
import {
  feedLaneKey,
  invalidateFeedLane,
  readFeedLane,
  reconcileFeedPage,
  writeFeedLane,
} from '@/lib/feedCache'
import { mergeDedupeSort } from '@/lib/feedMerge'
import {
  fetchFeedPage,
  fetchFeedSearchPage,
  isSupabaseConfigured,
} from '@/lib/supabase'
import {
  GLOBAL_SEARCH_MIN_CHARS,
  normalizeGlobalSearchQuery,
} from '@/lib/searchQuery'
import type { FeedItemRow, FeedSection } from '@/types'

const SEARCH_DEBOUNCE_MS = 300

export function useFeed(params: {
  section: FeedSection
  tagFilter: string[] | null
  dateBounds: PublishedBounds
  /** Raw search input; trimmed length ≥2 triggers global search (all sections). */
  globalSearch: string
}) {
  const [effectiveSearch, setEffectiveSearch] = useState('')
  const prevTrimRef = useRef('')

  useEffect(() => {
    const q = normalizeGlobalSearchQuery(params.globalSearch)
    if (q.length < GLOBAL_SEARCH_MIN_CHARS) {
      prevTrimRef.current = q
      const clearId = window.setTimeout(() => setEffectiveSearch(''), 0)
      return () => window.clearTimeout(clearId)
    }
    const prev = prevTrimRef.current
    prevTrimRef.current = q
    if (prev.length < GLOBAL_SEARCH_MIN_CHARS) {
      const id = window.setTimeout(() => setEffectiveSearch(q), 0)
      return () => window.clearTimeout(id)
    }
    const id = window.setTimeout(() => setEffectiveSearch(q), SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(id)
  }, [params.globalSearch])

  const inputNormalized = useMemo(
    () => normalizeGlobalSearchQuery(params.globalSearch),
    [params.globalSearch],
  )

  const isGlobalSearch = effectiveSearch.length >= GLOBAL_SEARCH_MIN_CHARS
  const searchPending =
    inputNormalized.length >= GLOBAL_SEARCH_MIN_CHARS &&
    inputNormalized !== effectiveSearch
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
    if (isGlobalSearch) {
      return getSeedItemsForGlobalSearch(effectiveSearch, params.dateBounds)
    }
    const raw = getSeedItemsForView(params.section, params.tagFilter)
    return filterItemsByPublishedBounds(raw, params.dateBounds)
  }, [
    effectiveSearch,
    isGlobalSearch,
    params.dateBounds,
    params.section,
    params.tagFilter,
  ])

  const laneKey = useMemo(() => {
    if (isGlobalSearch) {
      return `search|${effectiveSearch}|${params.dateBounds.publishedAfter ?? ''}|${params.dateBounds.publishedBefore ?? ''}`
    }
    return feedLaneKey(params.section, params.tagFilter, {
      publishedAfter: params.dateBounds.publishedAfter,
      publishedBefore: params.dateBounds.publishedBefore,
    })
  }, [
    effectiveSearch,
    isGlobalSearch,
    params.dateBounds.publishedAfter,
    params.dateBounds.publishedBefore,
    params.section,
    params.tagFilter,
  ])

  const applyMerged = useCallback(
    (dbData: FeedItemRow[]) => {
      /** Never blend static demo rows when a real backend is configured — it hid empty/stale DBs. */
      const seed = isSupabaseConfigured ? [] : seedForView
      const merged = mergeDedupeSort(dbData, seed)
      const first = merged.slice(0, PAGE_SIZE)
      mergedTailRef.current = merged.slice(PAGE_SIZE)
      feedDebug('applyMerged', {
        dbRowCount: dbData.length,
        seedRowCount: seed.length,
        mergedTotal: merged.length,
        topPublishedAt: first[0]?.published_at ?? null,
        supabaseConfigured: isSupabaseConfigured,
      })
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
        feedDebug('resetAndLoad cache hit', {
          laneKey,
          cachedRows: cached.dbFirstPage.length,
          cacheAgeMs: Date.now() - cached.savedAt,
          cacheSavedAt: new Date(cached.savedAt).toISOString(),
        })
        applyMerged(cached.dbFirstPage)
        setLoading(false)
      } else {
        feedDebug('resetAndLoad no cache', { laneKey, skipCache })
        setLoading(true)
      }

      if (skipCache) {
        invalidateFeedLane(laneKey)
      }

      const hadCache = Boolean(cached?.dbFirstPage?.length)
      if (hadCache) setRefreshing(true)
      try {
        const { data: dbData, error: err } = isGlobalSearch
          ? await fetchFeedSearchPage({
              search: effectiveSearch,
              publishedAfter: params.dateBounds.publishedAfter,
              publishedBefore: params.dateBounds.publishedBefore,
              from: 0,
              to: PAGE_SIZE - 1,
            })
          : await fetchFeedPage({
              section: params.section,
              tagFilter: params.tagFilter,
              publishedAfter: params.dateBounds.publishedAfter,
              publishedBefore: params.dateBounds.publishedBefore,
              from: 0,
              to: PAGE_SIZE - 1,
            })

        if (err) {
          feedDebug('resetAndLoad fetch error', {
            message: err.message,
            laneKey,
          })
          invalidateFeedLane(laneKey)
          applyMerged([])
          return
        }

        feedDebug('resetAndLoad fetch ok', {
          laneKey,
          dbFirstPageRows: dbData.length,
          hadCache,
        })

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
    [
      applyMerged,
      effectiveSearch,
      isGlobalSearch,
      laneKey,
      params.dateBounds,
      params.section,
      params.tagFilter,
    ],
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
    const { data, error: err } = isGlobalSearch
      ? await fetchFeedSearchPage({
          search: effectiveSearch,
          publishedAfter: params.dateBounds.publishedAfter,
          publishedBefore: params.dateBounds.publishedBefore,
          from,
          to,
        })
      : await fetchFeedPage({
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
    feedDebug('loadMore page', {
      from,
      to,
      batchSize: data.length,
      batchNewest: data[0]?.published_at,
    })
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
    effectiveSearch,
    hasMore,
    isGlobalSearch,
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
    refreshing: refreshing || searchPending,
    loadingMore,
    hasMore,
    reload,
    loadMore,
    isGlobalSearch,
    effectiveSearch,
  }
}
