#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import Parser from 'rss-parser'
import {
  AI_FEEDS,
  AI_HINTS,
  DEFAULT_INTEGRATION_KEYWORDS,
  DEFAULT_PROGRAMMING_SLUGS,
  FIXED_SECTION_FEEDS,
  INTEGRATION_EXTRA_FEEDS,
  REDDIT_DISCOVERY_SUBREDDITS,
  ROUTED_SOURCE_FEEDS,
  buildRedditDiscoveryTrust,
} from './feeds.config.mjs'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(url, key)

const INGEST_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 TechFeed/1.0 (+https://github.com/dmedawar/TechFeed)'

const parser = new Parser({
  timeout: 45000,
  headers: {
    Accept: 'application/rss+xml, application/xml, application/atom+xml, text/xml;q=0.9, */*;q=0.8',
    'User-Agent': INGEST_USER_AGENT,
  },
})

function stripHtml(html) {
  if (!html) return ''
  return String(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function firstImgSrcFromHtml(html) {
  if (typeof html !== 'string') return null
  const fromTag = html.match(/<img[^>]+src=["']([^"']+)["']/i)
  if (fromTag?.[1] && /^https?:/i.test(fromTag[1])) return fromTag[1]
  const loose = html.match(/https?:[^"' \>]+\.(png|jpe?g|gif|webp|avif)(\?[^"' \>]*)?/i)
  return loose ? loose[0] : null
}

function pickThumb(item) {
  const it = /** @type {Record<string, unknown>} */ (item)

  if (typeof it.image === 'string' && /^https?:/i.test(it.image)) return it.image
  if (it.image && typeof it.image === 'object' && it.image !== null) {
    const u = /** @type {{ url?: string }} */ (it.image).url
    if (u && /^https?:/i.test(u)) return u
  }

  const itunesImg = it['itunes:image']
  if (itunesImg && typeof itunesImg === 'object' && itunesImg !== null && '$' in itunesImg) {
    const href = /** @type {{ $?: { href?: string } }} */ (itunesImg).$?.href
    if (href && /^https?:/i.test(href)) return href
  }

  let mcRaw = it['media:content']
  if (mcRaw && !Array.isArray(mcRaw)) mcRaw = [mcRaw]
  if (Array.isArray(mcRaw)) {
    for (const mc of mcRaw) {
      if (!mc || typeof mc !== 'object') continue
      const attr =
        '$' in mc
          ? /** @type {{ $?: { url?: string; medium?: string; type?: string } }} */ (mc).$
          : null
      const u = attr?.url
      if (
        u &&
        /^https?:/i.test(u) &&
        (attr?.medium === 'image' ||
          (attr?.type && String(attr.type).startsWith('image/')) ||
          /\.(png|jpe?g|gif|webp|avif)/i.test(u))
      ) {
        return u
      }
    }
  }

  const mt = it['media:thumbnail']
  if (mt && typeof mt === 'object' && mt !== null) {
    if ('$' in mt) {
      const u = /** @type {{ $?: { url?: string } }} */ (mt).$?.url
      if (u) return u
    }
    if ('url' in mt && typeof /** @type {{ url?: string }} */ (mt).url === 'string') {
      return /** @type {{ url?: string }} */ (mt).url
    }
  }

  const enc =
    typeof it.enclosure === 'object' && it.enclosure !== null
      ? /** @type {{ url?: string; type?: string }} */ (it.enclosure)
      : undefined
  if (enc?.url && (/^image\//i.test(enc.type || '') || /\.(png|jpe?g|gif|webp|avif)/i.test(enc.url))) {
    return enc.url
  }

  for (const html of [
    it['content:encoded'],
    item.content,
    item.summary,
    item.contentSnippet,
  ]) {
    const found = firstImgSrcFromHtml(html)
    if (found) return found
  }

  return null
}

function faviconForLink(link) {
  try {
    const host = new URL(String(link)).hostname
    if (!host) return null
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128`
  } catch {
    return null
  }
}

/** Pull ISO-like timestamps embedded in text (some feeds omit structured dates). */
function extractIsoDatesFromText(text) {
  if (!text || typeof text !== 'string') return []
  const out = []
  const re = /\b20\d{2}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2})?(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)?/g
  let m
  while ((m = re.exec(text)) !== null) out.push(m[0])
  return out
}

function parseFirstValidDate(candidates) {
  for (const c of candidates) {
    if (c == null || c === '') continue
    const s = typeof c === 'string' ? c : String(c)
    const t = Date.parse(s)
    if (Number.isFinite(t)) return new Date(t).toISOString()
  }
  return null
}

/** Atom/RSS link may be a string, { href }, or links[]. */
function firstItemLink(item) {
  const L = item.link
  if (typeof L === 'string' && L.trim()) return L.trim()
  if (L && typeof L === 'object' && !Array.isArray(L) && 'href' in L) {
    const h = /** @type {{ href?: string }} */ (L).href
    if (typeof h === 'string' && h.trim()) return h.trim()
  }
  const links = /** @type {{ href?: string }[] | undefined} */ (item.links)
  if (Array.isArray(links)) {
    for (const l of links) {
      if (l?.href && typeof l.href === 'string') return l.href.trim()
    }
  }
  const guid = item.guid
  if (typeof guid === 'string' && /^https?:/i.test(guid)) return guid
  if (guid && typeof guid === 'object' && guid !== null && '#text' in guid) {
    const t = String(/** @type {{ '#text'?: string }} */ (guid)['#text'])
    if (/^https?:/i.test(t)) return t
  }
  if (typeof item.id === 'string' && /^https?:/i.test(item.id)) return item.id
  return ''
}

/**
 * @param {import('rss-parser').Item} item
 * @param {import('rss-parser').Feed | undefined} feedMeta
 */
function publishedAtFromItemAndFeed(item, feedMeta) {
  const it = /** @type {Record<string, unknown>} */ (item)
  const fromSnippet = extractIsoDatesFromText(
    [item.contentSnippet, item.summary, item.content, item.title]
      .filter(Boolean)
      .join(' ')
      .slice(0, 4000),
  )
  const candidates = [
    item.isoDate,
    item.pubDate,
    item.date,
    it.updated,
    it.published,
    it['dc:date'],
    it['atom:updated'],
    ...fromSnippet,
  ]
  let found = parseFirstValidDate(candidates)
  if (found) return found
  if (feedMeta) {
    const fm = /** @type {Record<string, unknown>} */ (feedMeta)
    found = parseFirstValidDate([
      feedMeta.lastBuildDate,
      feedMeta.pubDate,
      feedMeta.updated,
      fm['dc:date'],
    ])
    if (found) return found
  }
  return null
}

/**
 * @param {import('rss-parser').Item[]} items
 * @param {import('rss-parser').Feed} feed
 */
function sortFeedItemsNewestFirst(items, feed) {
  return [...items].sort(
    (a, b) =>
      (Date.parse(publishedAtFromItemAndFeed(b, feed) || '') || 0) -
      (Date.parse(publishedAtFromItemAndFeed(a, feed) || '') || 0),
  )
}

/**
 * @param {import('rss-parser').Feed} feed
 * @param {number} limit
 */
function takeNewestFeedItems(feed, limit) {
  return sortFeedItemsNewestFirst(feed.items ?? [], feed).slice(0, limit)
}

function uniq(arr) {
  return [...new Set(arr)]
}

async function fetchCustomTopics() {
  const { data, error } = await supabase.from('custom_topics').select('*')
  if (error) throw error
  return data ?? []
}

function buildIntegrationKeywords(customs) {
  /** @type {Record<string, string[]>} */
  const map = { ...DEFAULT_INTEGRATION_KEYWORDS }
  for (const row of customs) {
    if (row.kind !== 'integration') continue
    const needles = uniq([
      ...(map[row.slug] ?? []),
      row.slug.replace(/-/g, ' '),
      String(row.label).toLowerCase(),
    ].filter(Boolean))
    map[row.slug] = needles
  }
  return map
}

function matchNeedles(text, needles) {
  const lower = text.toLowerCase()
  return needles.some((n) => lower.includes(n))
}

function detectAi(text) {
  return matchNeedles(text, AI_HINTS)
}

/** @param {Record<string, string[]>} integrationMap */
function detectIntegrationTags(text, integrationMap) {
  /** @type {string[]} */
  const tags = []
  for (const [slug, needles] of Object.entries(integrationMap)) {
    if (matchNeedles(text, needles)) tags.push(slug)
  }
  return uniq(tags)
}

/**
 * @param {import('rss-parser').Item} item
 * @param {'ai'|'tech'|'general'|'programming'|'integrations'} section
 * @param {string[]} tags
 * @param {string} sourceName
 * @param {import('rss-parser').Feed | undefined} feedMeta
 */
function normalizeItem(item, section, tags, sourceName, feedMeta) {
  const title = stripHtml(item.title || '').slice(0, 500)
  const link = firstItemLink(item)
  if (!title || !link) return null
  const published = publishedAtFromItemAndFeed(item, feedMeta)
  if (!published) return null
  const summary =
    stripHtml(item.contentSnippet || item.summary || item.content || '').slice(
      0,
      1200,
    ) || null
  return {
    title,
    url: String(link).split('#')[0],
    summary,
    thumbnail_url: pickThumb(item) || faviconForLink(link),
    section,
    tags,
    source_name: sourceName,
    published_at: published,
  }
}

async function ingestProgramming(languageSlugs) {
  /** @type {NonNullable<ReturnType<typeof normalizeItem>>[]} */
  const out = []
  for (const slug of languageSlugs) {
    const feedUrl = `https://dev.to/feed/tag/${encodeURIComponent(slug)}`
    try {
      const feed = await parser.parseURL(feedUrl)
      for (const item of takeNewestFeedItems(feed, 80)) {
        const row = normalizeItem(
          item,
          'programming',
          [slug],
          'DEV Community',
          feed,
        )
        if (row) out.push(row)
      }
    } catch (e) {
      console.warn(
        `Programming feed failed (${slug}):`,
        /** @type {Error} */ (e).message,
      )
    }
  }
  return out
}

/**
 * @param {typeof FIXED_SECTION_FEEDS} specs
 */
async function ingestFixedSectionFeeds(specs) {
  /** @type {NonNullable<ReturnType<typeof normalizeItem>>[]} */
  const out = []
  for (const spec of specs) {
    try {
      const feed = await parser.parseURL(spec.url)
      for (const item of takeNewestFeedItems(feed, 150)) {
        const row = normalizeItem(
          item,
          /** @type {'ai'|'tech'|'general'|'programming'|'integrations'} */ (
            spec.section
          ),
          spec.tags,
          spec.source,
          feed,
        )
        if (row) out.push(row)
      }
    } catch (e) {
      console.warn(
        `Fixed-section feed failed (${spec.url}):`,
        /** @type {Error} */ (e).message,
      )
    }
  }
  return out
}

async function ingestDedicated(feedList, section, tagFn) {
  /** @type {NonNullable<ReturnType<typeof normalizeItem>>[]} */
  const out = []
  for (const src of feedList) {
    try {
      const feed = await parser.parseURL(src.url)
      for (const item of takeNewestFeedItems(feed, 120)) {
        const text = `${item.title ?? ''} ${item.contentSnippet ?? ''}`
        const tags = tagFn(text)
        const row = normalizeItem(item, section, tags, src.source, feed)
        if (row) out.push(row)
      }
    } catch (e) {
      console.warn(`Feed failed (${src.url}):`, /** @type {Error} */ (e).message)
    }
  }
  return out
}

async function ingestRoutedTechVerge(integrationMap) {
  /** @type {NonNullable<ReturnType<typeof normalizeItem>>[]} */
  const out = []
  for (const src of ROUTED_SOURCE_FEEDS) {
    try {
      const feed = await parser.parseURL(src.url)
      for (const item of takeNewestFeedItems(feed, 120)) {
        const text = `${item.title ?? ''} ${item.contentSnippet ?? ''}`
        const iTags = detectIntegrationTags(text, integrationMap)
        let section = 'tech'
        /** @type {string[]} */
        let tags = []
        if (iTags.length) {
          section = 'integrations'
          tags = iTags
        } else if (detectAi(text)) {
          section = 'ai'
          tags = ['ai-signal']
        }
        const row = normalizeItem(item, section, tags, src.source, feed)
        if (row) out.push(row)
      }
    } catch (e) {
      console.warn(`Tech feed failed (${src.url}):`, /** @type {Error} */ (e).message)
    }
  }
  return out
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function normalizeHttpStoryUrl(raw) {
  try {
    const u = new URL(String(raw).trim().split('#')[0])
    if (!/^https?:$/i.test(u.protocol)) return null
    return u.href
  } catch {
    return null
  }
}

function publisherLabelFromHost(host, matchedSuffix, suffixToPublisher) {
  const fromMap = suffixToPublisher.get(matchedSuffix)
  if (fromMap) return fromMap
  const base = host.replace(/^www\./i, '').split('.')[0] || host
  return base.charAt(0).toUpperCase() + base.slice(1)
}

/**
 * Scan public subreddit JSON for external URLs whose hosts match configured / trusted
 * publishers. Reddit is not stored as a source; rows use the article publisher as
 * `source_name` and merge with RSS via URL upsert.
 *
 * @param {Record<string, string[]>} integrationMap
 */
async function ingestRedditDiscovery(integrationMap) {
  const {
    trustedSuffixesSorted,
    suffixToPublisher,
    blockedHostSuffixes,
    blockedExactHosts,
  } = buildRedditDiscoveryTrust()

  /** @param {string} h normalized host */
  function isHardBlockedHost(h) {
    if (blockedExactHosts.has(h)) return true
    for (const suf of blockedHostSuffixes) {
      if (h === suf || h.endsWith('.' + suf)) return true
    }
    return false
  }

  /** @param {string} h normalized host */
  function matchedTrustedSuffix(h) {
    if (isHardBlockedHost(h)) return null
    for (const suf of trustedSuffixesSorted) {
      if (h === suf || h.endsWith('.' + suf)) return suf
    }
    return null
  }

  /** @type {Map<string, { title: string, url: string, summary: string | null, thumbnail_url: string | null, section: string, tags: string[], source_name: string, published_at: string }>} */
  const byUrl = new Map()
  const maxTotal = 220
  const perSubLimit = 38
  const pauseMs = 1300

  for (const sub of REDDIT_DISCOVERY_SUBREDDITS) {
    if (byUrl.size >= maxTotal) break
    try {
      const listingUrl = `https://www.reddit.com/r/${encodeURIComponent(sub)}/new.json?limit=${perSubLimit}&raw_json=1`
      const res = await fetch(listingUrl, {
        headers: { 'User-Agent': `${INGEST_USER_AGENT} reddit-discovery/0.1` },
      })
      if (!res.ok) {
        console.warn(`Reddit discovery r/${sub}: HTTP ${res.status}`)
        continue
      }
      /** @type {{ data?: { children?: { data?: Record<string, unknown> }[] } }} */
      const json = await res.json()
      const children = json?.data?.children ?? []
      for (const child of children) {
        if (byUrl.size >= maxTotal) break
        const d = child.data
        if (!d || d.is_self) continue
        const rawUrl = d.url
        if (typeof rawUrl !== 'string' || !rawUrl.trim()) continue
        const href = normalizeHttpStoryUrl(rawUrl)
        if (!href) continue
        let host
        try {
          host = new URL(href).hostname.replace(/^www\./i, '').toLowerCase()
        } catch {
          continue
        }
        const suf = matchedTrustedSuffix(host)
        if (!suf) continue
        const title = stripHtml(String(d.title ?? '')).slice(0, 500)
        if (!title) continue
        const created = d.created_utc
        const t =
          typeof created === 'number'
            ? created
            : typeof created === 'string'
              ? Number.parseFloat(created)
              : NaN
        if (!Number.isFinite(t)) continue
        const published_at = new Date(t * 1000).toISOString()
        const text = title
        const iTags = detectIntegrationTags(text, integrationMap)
        let section = 'tech'
        /** @type {string[]} */
        let tags = []
        if (iTags.length) {
          section = 'integrations'
          tags = iTags
        } else if (detectAi(text)) {
          section = 'ai'
          tags = ['ai-signal']
        }
        const row = {
          title,
          url: href,
          summary: null,
          thumbnail_url: faviconForLink(href),
          section,
          tags: uniq(tags),
          source_name: publisherLabelFromHost(host, suf, suffixToPublisher),
          published_at,
        }
        if (!byUrl.has(row.url)) byUrl.set(row.url, row)
      }
    } catch (e) {
      console.warn(
        `Reddit discovery r/${sub}:`,
        /** @type {Error} */ (e).message,
      )
    }
    await sleep(pauseMs)
  }

  return [...byUrl.values()]
}

async function ingestIntegrationFeeds(integrationMap) {
  /** @type {NonNullable<ReturnType<typeof normalizeItem>>[]} */
  const out = []
  for (const src of INTEGRATION_EXTRA_FEEDS) {
    try {
      const feed = await parser.parseURL(src.url)
      for (const item of takeNewestFeedItems(feed, 100)) {
        const text = `${item.title ?? ''} ${item.contentSnippet ?? ''}`
        let tags = detectIntegrationTags(text, integrationMap)
        if (!tags.length && src.source.includes('GitHub')) tags = ['github']
        if (!tags.length && src.source.includes('Firebase')) tags = ['firebase']
        if (!tags.length && src.source.includes('Google Play')) tags = ['google-play']
        if (!tags.length) continue
        const row = normalizeItem(item, 'integrations', uniq(tags), src.source, feed)
        if (row) out.push(row)
      }
    } catch (e) {
      console.warn(
        `Integration feed failed (${src.url}):`,
        /** @type {Error} */ (e).message,
      )
    }
  }
  return out
}

async function upsertRows(rows) {
  const dedup = new Map()
  for (const r of rows) {
    if (!r?.url) continue
    dedup.set(r.url, r)
  }
  const batch = [...dedup.values()]
  const chunkSize = 80
  for (let i = 0; i < batch.length; i += chunkSize) {
    const slice = batch.slice(i, i + chunkSize)
    const { error } = await supabase.from('feed_items').upsert(slice, {
      onConflict: 'url',
    })
    if (error) throw error
  }
  return batch.length
}

async function main() {
  console.log('Fetching custom topics…')
  const customs = await fetchCustomTopics()

  const extraLanguages = customs
    .filter((c) => c.kind === 'language')
    .map((c) => c.slug)
  const languageSlugs = uniq([...DEFAULT_PROGRAMMING_SLUGS, ...extraLanguages])

  const integrationMap = buildIntegrationKeywords(customs)

  console.log('Ingesting feeds (parallel batches)…')
  const [aiRows, progRows, routedRows, integRows, fixedRows, redditRows] =
    await Promise.all([
      ingestDedicated(AI_FEEDS, 'ai', (_text) => ['ai-signal']),
      ingestProgramming(languageSlugs),
      ingestRoutedTechVerge(integrationMap),
      ingestIntegrationFeeds(integrationMap),
      ingestFixedSectionFeeds(FIXED_SECTION_FEEDS),
      ingestRedditDiscovery(integrationMap),
    ])

  const merged = [
    ...aiRows,
    ...progRows,
    ...routedRows,
    ...integRows,
    ...fixedRows,
    ...redditRows,
  ]
  console.log(`Upserting ${merged.length} items…`)
  const n = await upsertRows(merged)
  console.log(`Done. ${n} unique URLs processed.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
