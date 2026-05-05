import { useMemo, useState } from 'react'
import { X } from 'lucide-react'
import {
  normalizeTopicSlug,
  type TopicChip,
} from '@/lib/constants'
import { insertCustomTopic } from '@/lib/supabase'
import { BrandGlyph } from '@/lib/icons'
import type { TopicKind } from '@/types'

export function AddTopicModal({
  kind,
  open,
  onClose,
  onSaved,
  existing,
}: {
  kind: TopicKind
  open: boolean
  onClose: () => void
  onSaved: (chip: TopicChip) => void
  existing: TopicChip[]
}) {
  const [label, setLabel] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const slugPreview = useMemo(() => normalizeTopicSlug(label), [label])

  if (!open) return null

  async function submit() {
    setErr(null)
    const slug = normalizeTopicSlug(label)
    if (slug.length < 2) {
      setErr('Enter a clearer name so we can build a stable slug.')
      return
    }
    if (existing.some((e) => e.slug === slug)) {
      setErr('That topic is already on your list.')
      return
    }
    setBusy(true)
    const iconSlug = slug
    const display =
      label.trim() ||
      slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    const { error } = await insertCustomTopic({
      kind,
      slug,
      label: display,
      icon_slug: iconSlug,
    })
    setBusy(false)
    if (error) {
      setErr(error.message)
      return
    }
    onSaved({
      slug,
      label: display,
      iconSlug,
      kind,
      isCustom: true,
    })
    setLabel('')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[color:var(--app-modal-scrim)] p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-topic-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-surface-1)] p-5 shadow-2xl shadow-[0_25px_50px_-12px_var(--app-shadow-strong)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id="add-topic-title"
              className="font-[family-name:var(--font-display)] text-lg font-semibold text-[color:var(--color-ink)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Add {kind === 'language' ? 'language' : 'integration'}
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-[color:var(--color-ink-muted)]">
              We&apos;ll surface matching coverage in this feed going forward.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[color:var(--color-ink-muted)] hover:bg-[color:var(--app-muted-fill-hover)] hover:text-[color:var(--color-ink)]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <label className="mt-5 block text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--color-ink-muted)]">
          Display name
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={
              kind === 'language'
                ? 'e.g. Kotlin'
                : 'e.g. Segment'
            }
            className="mt-2 w-full rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-surface-2)] px-3 py-2.5 text-sm text-[color:var(--color-ink)] outline-none ring-accent/0 transition placeholder:text-[color:var(--color-ink-muted)] focus:border-accent/45 focus:ring-2 focus:ring-accent/25"
          />
        </label>

        <div className="mt-4 flex items-center gap-3 rounded-xl border border-[color:var(--app-ring-subtle)] bg-[color:var(--app-muted-fill)] px-3 py-3">
          <BrandGlyph
            label={label || 'Preview'}
            iconSlug={slugPreview.length >= 2 ? slugPreview : null}
            size={36}
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[color:var(--color-ink)]">
              {label.trim() || 'Preview'}
            </p>
          </div>
        </div>

        {err ? (
          <p className="mt-3 text-sm text-[color:var(--app-danger)]">{err}</p>
        ) : null}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-medium text-[color:var(--color-ink-muted)] hover:bg-[color:var(--app-muted-fill-hover)] hover:text-[color:var(--color-ink)]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void submit()}
            className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-[0_12px_40px_-18px_rgba(198,167,107,0.35)] hover:brightness-110 disabled:opacity-60"
          >
            {busy ? 'Saving…' : 'Save topic'}
          </button>
        </div>
      </div>
    </div>
  )
}
