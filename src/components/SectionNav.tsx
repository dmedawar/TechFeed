import clsx from 'clsx'
import { SECTION_META, SECTION_ORDER } from '@/lib/constants'
import { SectionGlyph } from '@/lib/icons'
import type { FeedSection } from '@/types'

export function SectionNav({
  active,
  onChange,
}: {
  active: FeedSection
  onChange: (s: FeedSection) => void
}) {
  return (
    <nav
      className="scrollbar-none mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 pb-4 pt-6 sm:px-8"
      aria-label="Feed sections"
    >
      {SECTION_ORDER.map((id) => {
        const meta = SECTION_META[id]
        const isActive = active === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={clsx(
              'group flex min-w-[7.75rem] flex-1 flex-col items-start rounded-2xl border px-3 py-3 text-left transition-all sm:min-w-[8.5rem] sm:flex-none sm:px-4',
              isActive
                ? 'border-accent/40 bg-accent/10 shadow-[0_0_0_1px_rgba(198,167,107,0.18)]'
                : 'border-[color:var(--color-line)] bg-[color:var(--color-surface-2)]/60 hover:border-accent/25 hover:bg-[color:var(--color-surface-2)]',
            )}
          >
            <span className="flex items-center gap-2">
              <span
                className={clsx(
                  'rounded-lg p-1.5 ring-1 ring-[color:var(--app-ring-subtle)]',
                  isActive
                    ? 'bg-accent/15 text-accent-bright'
                    : 'bg-[color:var(--app-muted-fill)] text-[color:var(--color-ink-muted)]',
                )}
              >
                <SectionGlyph section={id} className="h-5 w-5" />
              </span>
              <span
                className={clsx(
                  'text-sm font-semibold tracking-tight',
                  isActive ? 'text-accent-bright' : 'text-[color:var(--color-ink)]',
                )}
              >
                {meta.label}
              </span>
            </span>
            <span className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-[color:var(--color-ink-muted)]">
              {meta.description}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
