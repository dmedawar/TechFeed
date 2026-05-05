import { useState, useEffect, useCallback } from 'react'
import { fetchHackerNews, fetchDevTo, fetchLobsters } from '../utils/api'

const CACHE = {}
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

async function fetchSource(source) {
  const now = Date.now()
  if (CACHE[source] && now - CACHE[source].ts < CACHE_TTL) {
    return CACHE[source].data
  }
  let data
  if (source === 'hackernews') data = await fetchHackerNews(30)
  else if (source === 'devto') data = await fetchDevTo(30)
  else if (source === 'lobsters') data = await fetchLobsters(30)
  else data = []
  CACHE[source] = { data, ts: now }
  return data
}

/** Fisher-Yates shuffle — unbiased, in-place */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function useFeed(activeSource) {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      let data
      if (activeSource === 'all') {
        const results = await Promise.allSettled([
          fetchSource('hackernews'),
          fetchSource('devto'),
          fetchSource('lobsters'),
        ])
        data = shuffle(
          results
            .filter((r) => r.status === 'fulfilled')
            .flatMap((r) => r.value),
        )
      } else {
        data = await fetchSource(activeSource)
      }
      setArticles(data)
    } catch (err) {
      setError(err.message ?? 'Failed to load articles')
    } finally {
      setLoading(false)
    }
  }, [activeSource])

  useEffect(() => {
    load()
  }, [load])

  return { articles, loading, error, reload: load }
}
