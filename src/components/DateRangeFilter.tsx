import clsx from 'clsx'
import { CalendarRange } from 'lucide-react'
import type { DatePresetId } from '@/lib/dateRangeFilter'

const PRESET_OPTIONS: { id: DatePresetId; label: string }[] = [
  { id: 'all', label: 'All time' },
  { id: '7d', label: 'Last week' },
  { id: '30d', label: 'Last 30 days' },
  { id: '90d', label: 'Last 90 days' },
  { id: 'custom', label: 'Custom range…' },
]

export function DateRangeFilter({
  preset,
  customFrom,
  customTo,
  onPresetChange,
  onCustomFromChange,
  onCustomToChange,
}: {
  preset: DatePresetId
  customFrom: string
  customTo: string
  onPresetChange: (p: DatePresetId) => void
  onCustomFromChange: (v: string) => void
  onCustomToChange: (v: string) => void
}) {
  return (
    <div className="border-b border-[color:var(--color-line)] bg-[color:var(--color-surface-0)]/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 sm:px-8">
        <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--color-ink-muted)]">
          <CalendarRange className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
          Date range
        </span>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <label className="sr-only" htmlFor="feed-date-preset">
            Time period
          </label>
          <select
            id="feed-date-preset"
            value={preset}
            onChange={(e) => onPresetChange(e.target.value as DatePresetId)}
            className={clsx(
              'min-w-[10.5rem] cursor-pointer rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-surface-2)] px-3 py-2 text-sm text-[color:var(--color-ink)]',
              'outline-none ring-accent/0 focus:border-accent/45 focus:ring-2 focus:ring-accent/20',
            )}
          >
            {PRESET_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>

          {preset === 'custom' ? (
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 text-xs text-[color:var(--color-ink-muted)]">
                <span className="whitespace-nowrap">From</span>
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => onCustomFromChange(e.target.value)}
                  className={clsx(
                    'rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-surface-2)] px-2.5 py-2 text-sm text-[color:var(--color-ink)]',
                    'outline-none focus:border-accent/45 focus:ring-2 focus:ring-accent/20',
                  )}
                />
              </label>
              <label className="flex items-center gap-2 text-xs text-[color:var(--color-ink-muted)]">
                <span className="whitespace-nowrap">To</span>
                <input
                  type="date"
                  value={customTo}
                  onChange={(e) => onCustomToChange(e.target.value)}
                  className={clsx(
                    'rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-surface-2)] px-2.5 py-2 text-sm text-[color:var(--color-ink)]',
                    'outline-none focus:border-accent/45 focus:ring-2 focus:ring-accent/20',
                  )}
                />
              </label>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
