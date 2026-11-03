const PREVIEW_USER_AGENT =
  'Mozilla/5.0 (compatible; TechFeedPreview/1.0; +https://github.com/dmedawar/TechFeed)'

const MAX_HTML_CHARS = 120_000

function decodeHtmlUrl(value) {
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&#0*38;/g, '&')
    .replace(/&#x0*26;/gi, '&')
    .trim()
}

function isBlockedHostname(hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '')
  if (
    host === 'localhost' ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    host === '0.0.0.0' ||
    host === '::1'
  ) {
    return true
  }
  const parts = host.split('.').map((part) => Number(part))
  if (parts.length === 4 && parts.every((n) => Number.isInteger(n) && n >= 0 && n <= 255)) {
    const [a, b] = parts
    if (a === 10 || a === 127 || a === 0) return true
    if (a === 169 && b === 254) return true
    if (a === 172 && b >= 16 && b <= 31) return true
    if (a === 192 && b === 168) return true
    if (a === 100 && b >= 64 && b <= 127) return true
  }
  return false
}

export function isPublicHttpUrl(raw) {
  try {
    const url = new URL(raw)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false
    if (!url.hostname || isBlockedHostname(url.hostname)) return false
    return true
  } catch {
    return false
  }
}

export function isPreviewImageUrl(raw) {
  if (!raw || !isPublicHttpUrl(raw)) return false
  const url = raw.toLowerCase()
  if (url.includes('google.com/s2/favicons')) return false
  if (url.includes('favicon')) return false
  if (/\.ico(\?|$)/.test(url)) return false
  if (url.includes('/icons.svg')) return false
  return true
}

function absolutize(raw, base) {
  try {
    return new URL(decodeHtmlUrl(raw), base).href
  } catch {
    return null
  }
}

function extractPreviewImage(html, baseUrl) {
  const patterns = [
    /<meta[^>]+property=["']og:image(?::secure_url|:url)?["'][^>]*content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]*property=["']og:image(?::secure_url|:url)?["']/i,
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]*content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]*name=["']twitter:image(?::src)?["']/i,
    /<link[^>]+rel=["']image_src["'][^>]*href=["']([^"']+)["']/i,
    /<link[^>]+href=["']([^"']+)["'][^>]*rel=["']image_src["']/i,
  ]
  for (const pattern of patterns) {
    const match = html.match(pattern)
    const absolute = match?.[1] ? absolutize(match[1], baseUrl) : null
    if (absolute && isPreviewImageUrl(absolute)) return absolute
  }
  return null
}

async function readHeadHtml(response) {
  const reader = response.body?.getReader()
  if (!reader) return ''
  const decoder = new TextDecoder()
  let html = ''
  try {
    while (html.length < MAX_HTML_CHARS) {
      const { done, value } = await reader.read()
      if (done) break
      html += decoder.decode(value, { stream: true })
      if (/<\/head>/i.test(html)) break
    }
  } finally {
    await reader.cancel().catch(() => {})
  }
  return html
}

/** Fetch a page's Open Graph / Twitter preview image. Returns null when none is public. */
export async function resolveArticlePreview(rawUrl) {
  if (!isPublicHttpUrl(rawUrl)) return null
  const response = await fetch(rawUrl, {
    redirect: 'follow',
    signal: AbortSignal.timeout(7000),
    headers: {
      Accept: 'text/html,application/xhtml+xml',
      'User-Agent': PREVIEW_USER_AGENT,
    },
  })
  if (!response.ok) return null
  const finalUrl = response.url || rawUrl
  if (!isPublicHttpUrl(finalUrl)) return null
  const html = await readHeadHtml(response)
  return extractPreviewImage(html, finalUrl)
}
