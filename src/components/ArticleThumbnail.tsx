import { useEffect, useState } from 'react'
import {
  requestArticlePreview,
  usableArticleImageUrl,
} from '@/lib/articleThumbnail'
import type { FeedItemRow } from '@/types'

function Placeholder({ pending }: { pending: boolean }) {
  return (
    <div
      className={`h-full w-full bg-gradient-to-br from-[color:var(--color-surface-3)] via-[color:var(--color-surface-2)] to-[color:var(--color-surface-1)] ${pending ? 'animate-pulse' : ''}`}
      aria-hidden
    />
  )
}

export function ArticleThumbnail({
  item,
}: {
  item: Pick<FeedItemRow, 'url' | 'thumbnail_url'>
}) {
  const stored = usableArticleImageUrl(item.thumbnail_url)
  const [remote, setRemote] = useState<string | null>(null)
  const [storedFailed, setStoredFailed] = useState(false)
  const [remoteFailed, setRemoteFailed] = useState(false)
  const [lookupDone, setLookupDone] = useState(false)

  const needsLookup = !stored || storedFailed

  useEffect(() => {
    if (!needsLookup) return
    let cancelled = false
    void requestArticlePreview(item.url).then((image) => {
      if (cancelled) return
      if (image && image !== stored) setRemote(image)
      setLookupDone(true)
    })
    return () => {
      cancelled = true
    }
  }, [item.url, needsLookup, stored])

  const showStored = Boolean(stored) && !storedFailed
  const showRemote = Boolean(remote) && !remoteFailed
  const src = showStored ? stored : showRemote ? remote : null

  if (!src) {
    return <Placeholder pending={needsLookup && !lookupDone} />
  }

  return (
    <img
      src={src}
      alt=""
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      loading="lazy"
      decoding="async"
      onError={() => {
        if (showStored) setStoredFailed(true)
        else setRemoteFailed(true)
      }}
    />
  )
}
