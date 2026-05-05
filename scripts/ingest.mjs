#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import Parser from 'rss-parser'
import {
  AI_FEEDS,
  AI_HINTS,
  DEFAULT_INTEGRATION_KEYWORDS,
  DEFAULT_PROGRAMMING_SLUGS,
  INTEGRATION_EXTRA_FEEDS,
  ROUTED_SOURCE_FEEDS,
} from './feeds.config.mjs'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(url, key)
const parser = new Parser({
  timeout: 20000,
  headers: {
    'User-Agent': 'TechFeedIngest/1.0 (+https://example.invalid)',
    Accept: 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
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

function publishedAt(item) {
  const d = item.isoDate || item.pubDate || item.date
  if (!d) return new Date().toISOString()
  const t = Date.parse(d)
  return Number.isFinite(t) ? new Date(t).toISOString() : new Date().toISOString()
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
 * @param {'ai'|'tech'|'programming'|'integrations'} section
 * @param {string[]} tags
 * @param {string} sourceName
 */
function normalizeItem(item, section, tags, sourceName) {
  const title = stripHtml(item.title || '').slice(0, 500)
  const guid = item.guid
  const link =
    typeof item.link === 'string'
      ? item.link
      : typeof guid === 'string'
        ? guid
        : typeof guid === 'object' && guid !== null && '#text' in guid
          ? String(/** @type {{ '#text'?: string }} */ (guid)['#text'])
          : typeof item.id === 'string'
            ? item.id
            : ''
  if (!title || !link) return null
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
    published_at: publishedAt(item),
  }
}

async function ingestProgramming(languageSlugs) {
  /** @type {NonNullable<ReturnType<typeof normalizeItem>>[]} */
  const out = []
  for (const slug of languageSlugs) {
    const feedUrl = `https://dev.to/feed/tag/${encodeURIComponent(slug)}`
    try {
      const feed = await parser.parseURL(feedUrl)
      for (const item of feed.items.slice(0, 72)) {
        const row = normalizeItem(item, 'programming', [slug], 'DEV Community')
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

async function ingestDedicated(feedList, section, tagFn) {
  /** @type {NonNullable<ReturnType<typeof normalizeItem>>[]} */
  const out = []
  for (const src of feedList) {
    try {
      const feed = await parser.parseURL(src.url)
      for (const item of feed.items.slice(0, 100)) {
        const text = `${item.title ?? ''} ${item.contentSnippet ?? ''}`
        const tags = tagFn(text)
        const row = normalizeItem(item, section, tags, src.source)
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
      for (const item of feed.items.slice(0, 100)) {
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
        const row = normalizeItem(item, section, tags, src.source)
        if (row) out.push(row)
      }
    } catch (e) {
      console.warn(`Tech feed failed (${src.url}):`, /** @type {Error} */ (e).message)
    }
  }
  return out
}

async function ingestIntegrationFeeds(integrationMap) {
  /** @type {NonNullable<ReturnType<typeof normalizeItem>>[]} */
  const out = []
  for (const src of INTEGRATION_EXTRA_FEEDS) {
    try {
      const feed = await parser.parseURL(src.url)
      for (const item of feed.items.slice(0, 72)) {
        const text = `${item.title ?? ''} ${item.contentSnippet ?? ''}`
        let tags = detectIntegrationTags(text, integrationMap)
        if (!tags.length && src.source.includes('GitHub')) tags = ['github']
        if (!tags.length && src.source.includes('Firebase')) tags = ['firebase']
        if (!tags.length) continue
        const row = normalizeItem(item, 'integrations', uniq(tags), src.source)
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
  const [aiRows, progRows, routedRows, integRows] = await Promise.all([
    ingestDedicated(AI_FEEDS, 'ai', (_text) => ['ai-signal']),
    ingestProgramming(languageSlugs),
    ingestRoutedTechVerge(integrationMap),
    ingestIntegrationFeeds(integrationMap),
  ])

  const merged = [...aiRows, ...progRows, ...routedRows, ...integRows]
  console.log(`Upserting ${merged.length} items…`)
  const n = await upsertRows(merged)
  console.log(`Done. ${n} unique URLs processed.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
