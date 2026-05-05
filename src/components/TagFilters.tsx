import clsx from 'clsx'
import { Plus, RotateCcw } from 'lucide-react'
import type { TopicChip } from '@/lib/constants'
import { BrandGlyph } from '@/lib/icons'

export function TagFilters({
  chips,
  selected,
  showAddTopic = true,
  onToggle,
  onAddClick,
  onSelectAll,
  onClear,
  onResetDefaults,
}: {
  chips: TopicChip[]
  selected: Set<string>
  showAddTopic?: boolean
  onToggle: (slug: string) => void
  onAddClick: () => void
  onSelectAll: () => void
  onClear: () => void
  onResetDefaults: () => void
}) {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <div className="flex flex-wrap items-center gap-2 border-b border-[color:var(--color-line)] pb-5">
        <span className="mr-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--color-ink-muted)]">
          Show
        </span>
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => {
            const on = selected.has(chip.slug)
            return (
              <button
                key={chip.slug}
                type="button"
                onClick={() => onToggle(chip.slug)}
                className={clsx(
                  'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                  on
                    ? 'border-accent/45 bg-accent/12 text-accent-bright'
                    : 'border-[color:var(--color-line)] bg-[color:var(--color-surface-2)]/80 text-[color:var(--color-ink-muted)] hover:border-[color:var(--app-border-emphasis)] hover:text-[color:var(--color-ink)]',
                )}
              >
                <BrandGlyph
                  label={chip.label}
                  iconSlug={chip.iconSlug}
                  size={18}
                />
                <span>{chip.label}</span>
              </button>
            )
          })}
          {showAddTopic ? (
            <button
              type="button"
              onClick={onAddClick}
              className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-accent/40 bg-transparent px-3 py-1.5 text-xs font-medium text-accent-bright/95 hover:bg-accent/10"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
              Add topic
            </button>
          ) : null}
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onSelectAll}
            className="rounded-lg px-2 py-1 text-[11px] font-medium text-[color:var(--color-ink-muted)] underline-offset-4 hover:text-[color:var(--color-ink)] hover:underline"
          >
            Select all
          </button>
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg px-2 py-1 text-[11px] font-medium text-[color:var(--color-ink-muted)] underline-offset-4 hover:text-[color:var(--color-ink)] hover:underline"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onResetDefaults}
            className="inline-flex items-center gap-1 rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-surface-2)] px-2.5 py-1 text-[11px] font-medium text-[color:var(--color-ink-muted)] hover:border-accent/30 hover:text-accent-bright"
          >
            <RotateCcw className="h-3 w-3" strokeWidth={2} />
            Defaults
          </button>
        </div>
      </div>
    </div>
  )
}
