function decodeHtmlUrl(value: string) {
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&#0*38;/g, '&')
    .replace(/&#x0*26;/gi, '&')
    .trim()
}

function isHttpUrl(value: string) {
  return /^https?:\/\//i.test(value)
}

/** RSS sometimes stores a site icon. Those are not article previews. */
export function usableArticleImageUrl(raw: string | null | undefined): string | null {
  if (!raw) return null
  const url = decodeHtmlUrl(raw)
  if (!isHttpUrl(url)) return null
  const lower = url.toLowerCase()
  if (lower.includes('google.com/s2/favicons')) return null
  if (lower.includes('favicon')) return null
  if (/\.ico(\?|$)/i.test(url)) return null
  return url
}

export function sourceBadgeLabel(item: {
  url: string
  source_name: string | null
}): string | null {
  try {
    const host = new URL(item.url).hostname.replace(/^www\./i, '')
    if (host && !/(^|\.)news\.google\.com$/i.test(host)) return host
  } catch {
    /* use the feed name below */
  }
  const name = item.source_name?.trim()
  return name || null
}

const previewCache = new Map<string, Promise<string | null>>()
let activePreviews = 0
const previewWaiters: Array<() => void> = []
const MAX_PREVIEW_REQUESTS = 4

function runWhenPreviewSlotFree<T>(job: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const start = () => {
      activePreviews += 1
      job()
        .then(resolve, reject)
        .finally(() => {
          activePreviews -= 1
          previewWaiters.shift()?.()
        })
    }
    if (activePreviews < MAX_PREVIEW_REQUESTS) start()
    else previewWaiters.push(start)
  })
}

/** Look up an article image without blocking the feed list. */
export function requestArticlePreview(articleUrl: string): Promise<string | null> {
  const cached = previewCache.get(articleUrl)
  if (cached) return cached
  const pending = runWhenPreviewSlotFree(async () => {
    const response = await fetch(
      `/api/article-preview?url=${encodeURIComponent(articleUrl)}`,
    )
    if (!response.ok) return null
    const body = (await response.json()) as { image?: unknown }
    return typeof body.image === 'string' ? usableArticleImageUrl(body.image) : null
  }).catch(() => null)
  previewCache.set(articleUrl, pending)
  return pending
}
