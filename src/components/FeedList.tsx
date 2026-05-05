import { useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'
import type { FeedItemRow } from '@/types'
import { FeedCard } from '@/components/FeedCard'
import { FeedCardSkeleton } from '@/components/FeedCardSkeleton'

export function FeedList({
  items,
  loading,
  refreshing,
  loadingMore,
  hasMore,
  onLoadMore,
  emptyHint,
}: {
  items: FeedItemRow[]
  loading: boolean
  /** Background revalidation while cached articles are already visible */
  refreshing?: boolean
  loadingMore: boolean
  hasMore: boolean
  onLoadMore: () => void
  emptyHint: string
}) {
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting)
        if (hit) onLoadMore()
      },
      { rootMargin: '480px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [onLoadMore])

  if (loading && items.length === 0) {
    return (
      <div
        className="mx-auto flex max-w-6xl flex-col gap-4 px-5 pb-24 pt-6 sm:px-8"
        aria-busy="true"
        aria-label="Loading articles"
      >
        <p className="text-center text-[13px] text-[color:var(--color-ink-muted)]">
          Loading the latest articles…
        </p>
        <FeedCardSkeleton />
        <FeedCardSkeleton />
        <FeedCardSkeleton />
        <div className="flex justify-center py-4">
          <Loader2
            className="h-6 w-6 animate-spin text-accent opacity-80"
            aria-hidden
          />
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 text-center sm:px-8">
        <p className="text-sm text-[color:var(--color-ink-muted)]">{emptyHint}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 pb-24 pt-6 sm:px-8">
      {refreshing ? (
        <p className="text-center text-[12px] text-[color:var(--color-ink-muted)]">
          Checking for newer articles…
        </p>
      ) : null}
      {items.map((item) => (
        <FeedCard key={item.id} item={item} />
      ))}
      <div ref={sentinelRef} className="h-4 w-full" aria-hidden />
      {loadingMore ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
        </div>
      ) : null}
      {!hasMore && items.length > 0 ? (
        <p className="pb-10 pt-2 text-center text-[13px] text-[color:var(--color-ink-muted)]">
          You&apos;re all caught up.
        </p>
      ) : null}
    </div>
  )
}
