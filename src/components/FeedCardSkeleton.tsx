export function FeedCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-surface-2)]/40 p-4 sm:p-5"
      aria-hidden
    >
      <div className="flex gap-4 sm:gap-5">
        <div className="h-[88px] w-[88px] shrink-0 animate-pulse rounded-xl bg-[color:var(--color-surface-3)] sm:h-[100px] sm:w-[100px]" />
        <div className="min-w-0 flex-1 space-y-3 pt-0.5">
          <div className="flex gap-2">
            <div className="h-5 w-24 animate-pulse rounded-full bg-[color:var(--color-surface-3)]" />
            <div className="h-5 w-20 animate-pulse rounded-full bg-[color:var(--color-surface-3)]" />
          </div>
          <div className="h-5 w-[92%] max-w-xl animate-pulse rounded-md bg-[color:var(--color-surface-3)]" />
          <div className="h-5 w-[70%] max-w-md animate-pulse rounded-md bg-[color:var(--color-surface-3)]" />
          <div className="space-y-2 pt-1">
            <div className="h-3 w-full animate-pulse rounded bg-[color:var(--color-surface-3)]" />
            <div className="h-3 w-full animate-pulse rounded bg-[color:var(--color-surface-3)]" />
            <div className="h-3 w-[80%] animate-pulse rounded bg-[color:var(--color-surface-3)]" />
          </div>
        </div>
      </div>
    </div>
  )
}
