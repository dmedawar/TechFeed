import clsx from 'clsx'
import { Search, X } from 'lucide-react'

export function GlobalSearchBar({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="border-b border-[color:var(--color-line)] bg-[color:var(--color-surface-0)]/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-8">
        <label
          htmlFor="techfeed-global-search"
          className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-surface-2)] px-3 py-2.5 ring-accent/0 transition-[border-color,box-shadow] focus-within:border-accent/45 focus-within:ring-2 focus-within:ring-accent/20"
        >
          <Search
            className="h-4 w-4 shrink-0 text-accent opacity-90"
            strokeWidth={2}
            aria-hidden
          />
          <input
            id="techfeed-global-search"
            type="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Search all sections (title, summary, source)…"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm text-[color:var(--color-ink)] placeholder:text-[color:var(--color-ink-muted)] outline-none"
          />
          {value ? (
            <button
              type="button"
              onClick={() => onChange('')}
              className={clsx(
                'shrink-0 rounded-lg p-1 text-[color:var(--color-ink-muted)]',
                'hover:bg-[color:var(--app-muted-fill)] hover:text-[color:var(--color-ink)]',
              )}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          ) : null}
        </label>
        <p className="text-[11px] leading-snug text-[color:var(--color-ink-muted)] sm:max-w-[14rem] sm:shrink-0">
          Two or more characters query Supabase across every tab. Date range still applies.
        </p>
      </div>
    </div>
  )
}
