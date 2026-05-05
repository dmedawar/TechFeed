/** Curated RSS sources — extend as your team prefers */
export const AI_FEEDS = [
  { url: 'https://openai.com/blog/rss.xml', source: 'OpenAI' },
  { url: 'https://blog.google/technology/ai/rss/', source: 'Google AI' },
  { url: 'https://the-decoder.com/feed/', source: 'The Decoder · AI' },
  { url: 'https://www.technologyreview.com/feed/', source: 'MIT Technology Review' },
  { url: 'https://feeds.arstechnica.com/arstechnica/index', source: 'Ars Technica' },
]

export const TECH_FEEDS = [
  { url: 'https://techcrunch.com/feed/', source: 'TechCrunch' },
  { url: 'https://www.theverge.com/rss/index.xml', source: 'The Verge' },
  { url: 'https://www.wired.com/feed/rss', source: 'Wired' },
  { url: 'https://www.engadget.com/rss.xml', source: 'Engadget' },
  { url: 'https://www.cnet.com/rss/news/', source: 'CNET · News' },
  { url: 'https://www.theregister.com/headlines.atom', source: 'The Register' },
  { url: 'https://venturebeat.com/feed/', source: 'VentureBeat' },
]

/** Google Developers Blog only — routed into AI / tech / integrations by heuristics. */
export const GOOGLE_DEVELOPERS_FEEDS = [
  {
    url: 'https://developers.googleblog.com/feeds/posts/default?alt=rss',
    source: 'Google Developers Blog',
  },
]

/**
 * TLDR newsletter — community RSS mirrors (bullrich.dev). Official tldr.tech RSS often returns
 * bot challenges for server-side fetch; these mirrors track the same editions.
 */
export const TLDR_NEWSLETTER_FEEDS = [
  {
    url: 'https://bullrich.dev/tldr-rss/tech.rss',
    source: 'TLDR · Tech',
    section: 'tech',
    tags: ['tldr'],
  },
  {
    url: 'https://bullrich.dev/tldr-rss/ai.rss',
    source: 'TLDR · AI',
    section: 'ai',
    tags: ['ai-signal', 'tldr'],
  },
]

/**
 * General: Apple Newsroom, Google The Keyword, Google News (topics + recency searches),
 * wires, and high-volume aggregators — not split by AI/tech heuristics.
 */
export const GENERAL_SECTION_FEEDS = [
  {
    url: 'https://www.apple.com/newsroom/rss-feed.rss',
    source: 'Apple Newsroom',
    section: 'general',
    tags: ['apple', 'apple-newsroom'],
  },
  {
    url: 'https://blog.google/rss.xml',
    source: 'Google · The Keyword',
    section: 'general',
    tags: ['google'],
  },
  {
    url: 'https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en',
    source: 'Google News · Top stories',
    section: 'general',
    tags: ['google-news'],
  },
  {
    url: 'https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-US&gl=US&ceid=US:en',
    source: 'Google News · Technology',
    section: 'general',
    tags: ['google-news'],
  },
  {
    url: 'https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-US&gl=US&ceid=US:en',
    source: 'Google News · Business',
    section: 'general',
    tags: ['google-news'],
  },
  {
    url: 'https://news.google.com/rss/headlines/section/topic/WORLD?hl=en-US&gl=US&ceid=US:en',
    source: 'Google News · World',
    section: 'general',
    tags: ['google-news'],
  },
  {
    url: 'https://news.google.com/rss/headlines/section/topic/NATION?hl=en-US&gl=US&ceid=US:en',
    source: 'Google News · U.S.',
    section: 'general',
    tags: ['google-news'],
  },
  {
    url: 'https://news.google.com/rss/headlines/section/topic/SCIENCE?hl=en-US&gl=US&ceid=US:en',
    source: 'Google News · Science',
    section: 'general',
    tags: ['google-news'],
  },
  {
    url: 'https://news.google.com/rss/search?q=technology+OR+software+OR+startup+when:7d&hl=en-US&gl=US&ceid=US:en',
    source: 'Google News · Tech pulse (7d)',
    section: 'general',
    tags: ['google-news'],
  },
  {
    url: 'https://news.google.com/rss/search?q=breaking+OR+major+announcement+when:3d&hl=en-US&gl=US&ceid=US:en',
    source: 'Google News · Breaking (3d)',
    section: 'general',
    tags: ['google-news'],
  },
  {
    url: 'https://news.google.com/rss/search?q=technology+OR+software+when:1d&hl=en-US&gl=US&ceid=US:en',
    source: 'Google News · Tech (24h)',
    section: 'general',
    tags: ['google-news'],
  },
  {
    url: 'https://news.google.com/rss/search?q=artificial+intelligence+OR+machine+learning+when:1d&hl=en-US&gl=US&ceid=US:en',
    source: 'Google News · AI (24h)',
    section: 'general',
    tags: ['google-news'],
  },
  {
    url: 'https://news.google.com/rss/search?q=Apple+OR+Google+OR+Microsoft+when:1d&hl=en-US&gl=US&ceid=US:en',
    source: 'Google News · Big tech (24h)',
    section: 'general',
    tags: ['google-news'],
  },
  {
    url: 'https://www.techmeme.com/feed.xml',
    source: 'Techmeme',
    section: 'general',
    tags: ['techmeme'],
  },
  {
    url: 'https://feeds.bbci.co.uk/news/rss.xml',
    source: 'BBC News · Front page',
    section: 'general',
    tags: ['bbc'],
  },
  {
    url: 'https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml',
    source: 'BBC News · US & Canada',
    section: 'general',
    tags: ['bbc'],
  },
  {
    url: 'https://www.pbs.org/newshour/feeds/rss/headlines',
    source: 'PBS NewsHour · Headlines',
    section: 'general',
    tags: ['pbs'],
  },
  {
    url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html',
    source: 'CNBC · Top news',
    section: 'general',
    tags: ['cnbc'],
  },
  {
    url: 'https://rss.slashdot.org/Slashdot/slashdotMain',
    source: 'Slashdot',
    section: 'general',
    tags: ['slashdot'],
  },
  {
    url: 'https://hnrss.org/frontpage',
    source: 'Hacker News · Front page',
    section: 'general',
    tags: ['hackernews'],
  },
  {
    url: 'https://lobste.rs/rss',
    source: 'Lobsters',
    section: 'general',
    tags: ['lobsters'],
  },
  {
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    source: 'BBC News · World',
    section: 'general',
    tags: ['bbc'],
  },
  {
    url: 'https://feeds.bbci.co.uk/news/business/rss.xml',
    source: 'BBC News · Business',
    section: 'general',
    tags: ['bbc'],
  },
  {
    url: 'https://feeds.bbci.co.uk/news/technology/rss.xml',
    source: 'BBC News · Technology',
    section: 'general',
    tags: ['bbc'],
  },
  {
    url: 'https://feeds.reuters.com/reuters/topNews',
    source: 'Reuters · Top News',
    section: 'general',
    tags: ['reuters'],
  },
  {
    url: 'https://feeds.reuters.com/Reuters/worldNews',
    source: 'Reuters · World',
    section: 'general',
    tags: ['reuters'],
  },
  {
    url: 'https://feeds.reuters.com/reuters/businessNews',
    source: 'Reuters · Business',
    section: 'general',
    tags: ['reuters'],
  },
  {
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
    source: 'The New York Times · Home Page',
    section: 'general',
    tags: ['nyt'],
  },
  {
    url: 'https://www.theguardian.com/world/rss',
    source: 'The Guardian · World',
    section: 'general',
    tags: ['guardian'],
  },
  {
    url: 'https://www.theguardian.com/us-news/rss',
    source: 'The Guardian · U.S.',
    section: 'general',
    tags: ['guardian'],
  },
  {
    url: 'https://feeds.npr.org/1001/rss.xml',
    source: 'NPR · News',
    section: 'general',
    tags: ['npr'],
  },
]

/** Feeds pinned to a single section (TLDR editions + general bundle). */
export const FIXED_SECTION_FEEDS = [
  ...TLDR_NEWSLETTER_FEEDS,
  ...GENERAL_SECTION_FEEDS,
]

/** Wire / tech desks — still routed for AI vs tech vs integrations */
export const CREDIBLE_WIRE_FEEDS = [
  {
    url: 'https://feeds.reuters.com/reuters/technologyNews',
    source: 'Reuters · Technology',
  },
  {
    url: 'https://www.theguardian.com/technology/rss',
    source: 'The Guardian · Technology',
  },
]

/**
 * Official LinkedIn engineering blog (company technical content).
 * LinkedIn “News” in-app has no stable public RSS; this is the standard public engineering feed.
 */
export const LINKEDIN_OFFICIAL_FEEDS = [
  {
    url: 'https://engineering.linkedin.com/blog.rss',
    source: 'LinkedIn Engineering',
  },
]

/** Routed feeds — heuristics assign AI / tech / integrations */
export const ROUTED_SOURCE_FEEDS = [
  ...TECH_FEEDS,
  ...GOOGLE_DEVELOPERS_FEEDS,
  ...CREDIBLE_WIRE_FEEDS,
  ...LINKEDIN_OFFICIAL_FEEDS,
]

/** Routed into the integrations section when body/title matches */
export const INTEGRATION_EXTRA_FEEDS = [
  { url: 'https://github.blog/feed/', source: 'GitHub Blog' },
  {
    url: 'https://firebase.blog/feeds/posts/default?alt=rss',
    source: 'Firebase Blog',
  },
  {
    url: 'https://android-developers.googleblog.com/feeds/posts/default/-/Google%20Play?alt=rss',
    source: 'Google Play · Android Developers Blog',
  },
]

/** Default programming tags → dev.to tag feeds */
export const DEFAULT_PROGRAMMING_SLUGS = [
  'react',
  'swift',
  'javascript',
  'nodejs',
  'dotnet',
]

/** Default integration slugs → keyword needles (lowercase fragments) */
export const DEFAULT_INTEGRATION_KEYWORDS = {
  braze: ['braze'],
  socialplus: ['social.plus', 'social plus', 'socialplus'],
  github: ['github'],
  firebase: ['firebase'],
  salesforce: ['salesforce', 'marketing cloud', 'slack acquisition'],
  appstoreconnect: [
    'app store connect',
    'testflight',
    'apple developer',
    'app review',
    'appstore',
  ],
  'google-play': [
    'google play',
    'play store',
    'play console',
    'android vitals',
    'play billing',
  ],
}

export const AI_HINTS = [
  'anthropic',
  'openai',
  'gpt',
  'llm',
  'large language',
  'gemini',
  'copilot',
  'mistral',
  'deepmind',
  'neural',
  'machine learning',
  'diffusion',
  'generative ai',
]

/**
 * Ingest-only: scan these subs’ public JSON for external story URLs. Reddit is never a
 * displayed feed source; only links whose hosts match trusted publishers are kept.
 */
export const REDDIT_DISCOVERY_SUBREDDITS = [
  'technology',
  'artificial',
  'MachineLearning',
  'programming',
  'apple',
  'google',
  'android',
  'webdev',
  'devops',
  'sysadmin',
  'datascience',
  'cybersecurity',
  'compsci',
  'software',
]

/** Article hosts we allow from Reddit even if not present on a feed hostname (wires & desks). */
export const REDDIT_DISCOVERY_EXTRA_TRUSTED_HOST_SUFFIXES = [
  'apnews.com',
  'axios.com',
  'bloomberg.com',
  'economist.com',
  'ft.com',
  'nbcnews.com',
  'politico.com',
  'semafor.com',
  'semianalysis.com',
  'sfchronicle.com',
  'time.com',
  'usatoday.com',
  'washingtonpost.com',
  'wsj.com',
  'zdnet.com',
]

const REDDIT_DISCOVERY_SKIP_FEED_HOSTS = new Set([
  'bullrich.dev',
  'lobste.rs',
  'news.google.com',
  'news.ycombinator.com',
  'reddit.com',
])

/**
 * Host suffixes we never treat as article targets (aggregators, social, video, UGC).
 * Note: do not use `linkedin.com` here — it would block `engineering.linkedin.com`.
 */
const REDDIT_DISCOVERY_BLOCKED_HOST_SUFFIXES = [
  'reddit.com',
  'redd.it',
  'youtube.com',
  'youtu.be',
  'twitter.com',
  'x.com',
  'facebook.com',
  'instagram.com',
  'threads.net',
  'tiktok.com',
  'imgur.com',
  'medium.com',
  'substack.com',
  'patreon.com',
  'github.com',
  'stackoverflow.com',
  'stackexchange.com',
  'dev.to',
  'discord.com',
  'discord.gg',
  'twitch.tv',
]

function feedHostnameToArticleSuffix(hostname) {
  let h = hostname.replace(/^www\./i, '').toLowerCase()
  const map = {
    'feeds.bbci.co.uk': 'bbc.co.uk',
    'bbci.co.uk': 'bbc.co.uk',
    'feeds.reuters.com': 'reuters.com',
    'rss.nytimes.com': 'nytimes.com',
    'feeds.npr.org': 'npr.org',
    'rss.slashdot.org': 'slashdot.org',
    'engineering.linkedin.com': 'engineering.linkedin.com',
  }
  if (map[h]) return map[h]
  h = h.replace(/^feeds?\./i, '').replace(/^rss\./i, '')
  return h
}

function collectFeedEntriesForRedditTrust() {
  return [
    ...AI_FEEDS,
    ...TECH_FEEDS,
    ...GOOGLE_DEVELOPERS_FEEDS,
    ...TLDR_NEWSLETTER_FEEDS,
    ...GENERAL_SECTION_FEEDS,
    ...CREDIBLE_WIRE_FEEDS,
    ...LINKEDIN_OFFICIAL_FEEDS,
    ...INTEGRATION_EXTRA_FEEDS,
  ]
}

/**
 * Trust model for Reddit-surfaced links: host must match a configured feed publisher
 * (mapped to canonical article domains) or REDDIT_DISCOVERY_EXTRA_TRUSTED_HOST_SUFFIXES.
 */
export function buildRedditDiscoveryTrust() {
  const trustedSuffixes = new Set(REDDIT_DISCOVERY_EXTRA_TRUSTED_HOST_SUFFIXES)
  /** @type {Map<string, string>} */
  const suffixToPublisher = new Map()

  for (const { url, source } of collectFeedEntriesForRedditTrust()) {
    let host
    try {
      host = new URL(url).hostname.replace(/^www\./i, '').toLowerCase()
    } catch {
      continue
    }
    if (REDDIT_DISCOVERY_SKIP_FEED_HOSTS.has(host)) continue
    const suffix = feedHostnameToArticleSuffix(host)
    if (!suffix || REDDIT_DISCOVERY_SKIP_FEED_HOSTS.has(suffix)) continue
    trustedSuffixes.add(suffix)
    if (!suffixToPublisher.has(suffix)) {
      const label = source.includes(' · ')
        ? source.split(' · ')[0].trim()
        : source.trim()
      suffixToPublisher.set(suffix, label)
    }
  }

  return {
    trustedSuffixesSorted: [...trustedSuffixes].sort(
      (a, b) => b.length - a.length,
    ),
    suffixToPublisher,
    blockedHostSuffixes: REDDIT_DISCOVERY_BLOCKED_HOST_SUFFIXES,
    /** Exact hosts only (subdomains remain eligible when trusted). */
    blockedExactHosts: new Set(['google.com', 'linkedin.com']),
  }
}
