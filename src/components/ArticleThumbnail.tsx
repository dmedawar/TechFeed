import { useState } from 'react'
import { preferredThumbnailSrc } from '@/lib/articleThumbnail'
import type { FeedItemRow } from '@/types'

function Placeholder() {
  return (
    <div
      className="h-full w-full bg-gradient-to-br from-[color:var(--color-surface-3)] via-[color:var(--color-surface-2)] to-[color:var(--color-surface-1)]"
      aria-hidden
    />
  )
}

export function ArticleThumbnail({
  item,
}: {
  item: Pick<FeedItemRow, 'url' | 'thumbnail_url'>
}) {
  const { primary, fallback } = preferredThumbnailSrc(item)
  const [failedPrimary, setFailedPrimary] = useState(false)
  const [failedFallback, setFailedFallback] = useState(false)

  const src =
    primary && !failedPrimary
      ? primary
      : fallback && !failedFallback
        ? fallback
        : null

  if (!src) {
    return <Placeholder />
  }

  return (
    <img
      src={src}
      alt=""
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      loading="lazy"
      decoding="async"
      onError={() => {
        if (primary && !failedPrimary) setFailedPrimary(true)
        else setFailedFallback(true)
      }}
    />
  )
}
