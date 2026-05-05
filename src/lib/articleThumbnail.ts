/** High-res favicon via Google (works in plain `<img>` tags). */
export function faviconUrlForArticleUrl(articleUrl: string): string | null {
  try {
    const { hostname } = new URL(articleUrl)
    if (!hostname) return null
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=128`
  } catch {
    return null
  }
}

function isHttpUrl(s: string) {
  return /^https?:\/\//i.test(s.trim())
}

/**
 * Prefer RSS/stored image; otherwise domain favicon so cards always have a mark.
 */
export function preferredThumbnailSrc(item: {
  url: string
  thumbnail_url: string | null
}): { primary: string | null; fallback: string | null } {
  const t = item.thumbnail_url?.trim()
  const primary = t && isHttpUrl(t) ? t : null
  const fallback = faviconUrlForArticleUrl(item.url)
  return { primary, fallback }
}
