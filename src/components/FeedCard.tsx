import { formatDistanceToNow } from 'date-fns'
import clsx from 'clsx'
import { ExternalLink } from 'lucide-react'
import { ArticleThumbnail } from '@/components/ArticleThumbnail'
import { useArticleRead } from '@/hooks/useArticleRead'
import type { FeedItemRow } from '@/types'

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function preview(text: string | null, max = 220) {
  if (!text) return 'Follow the link for the full story.'
  const plain = stripHtml(text)
  if (plain.length <= max) return plain
  return `${plain.slice(0, max).trim()}…`
}

export function FeedCard({ item }: { item: FeedItemRow }) {
  const { isUnread, markOpened } = useArticleRead(item.id)

  return (
    <article
      className={clsx(
        'group relative overflow-hidden rounded-2xl border shadow-[0_16px_48px_-28px_var(--app-card-drop)] transition-[border-color,background-color,box-shadow] duration-200 hover:border-accent/30',
        isUnread
          ? 'border border-[color:var(--color-line)] border-l-[3px] border-l-[color:var(--color-accent)] bg-[color-mix(in_srgb,var(--color-accent)_7%,var(--color-surface-2))] hover:bg-[color-mix(in_srgb,var(--color-accent)_10%,var(--color-surface-2))]'
          : 'border border-[color:var(--color-line)] bg-[color:var(--color-surface-2)]/55 hover:bg-[color:var(--color-surface-2)]/90',
      )}
    >
      <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer noopener"
          onClick={markOpened}
          className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[color:var(--color-surface-3)] via-[color:var(--color-surface-2)] to-[color:var(--color-surface-1)] ring-1 ring-[color:var(--app-ring-subtle)] sm:h-[100px] sm:w-[100px]"
          aria-hidden
        >
          <ArticleThumbnail
            key={`${item.id}:${item.thumbnail_url ?? ''}`}
            item={item}
          />
        </a>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[color:var(--color-ink-muted)]">
            {item.source_name ? (
              <span className="rounded-full bg-[color:var(--app-muted-fill)] px-2 py-0.5 font-medium text-[color:var(--color-ink)]">
                {item.source_name}
              </span>
            ) : null}
            {isUnread ? (
              <span className="rounded-full bg-[color-mix(in_srgb,var(--color-accent)_22%,transparent)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-bright">
                New
              </span>
            ) : null}
            <time dateTime={item.published_at}>
              {formatDistanceToNow(new Date(item.published_at), {
                addSuffix: true,
              })}
            </time>
          </div>
          <h2
            className={clsx(
              'mt-2 font-[family-name:var(--font-display)] text-lg leading-snug tracking-tight sm:text-xl',
              isUnread
                ? 'font-semibold text-[color:var(--color-ink)]'
                : 'font-medium text-[color:var(--color-ink-muted)]',
            )}
          >
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer noopener"
              onClick={markOpened}
              className="inline-flex items-start gap-2 text-inherit underline-offset-4 hover:text-accent-bright hover:underline"
            >
              <span className="min-w-0">{item.title}</span>
              <ExternalLink
                className="mt-1 h-4 w-4 shrink-0 text-accent opacity-0 transition-opacity group-hover:opacity-100"
                strokeWidth={2}
                aria-hidden
              />
            </a>
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ink-muted)]">
            {preview(item.summary)}
          </p>
          {item.tags?.length ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.tags.slice(0, 6).map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-[color:var(--app-muted-fill)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent-bright/90 ring-1 ring-[color:var(--app-ring-subtle)]"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  )
}
