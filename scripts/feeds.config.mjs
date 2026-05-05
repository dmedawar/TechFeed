/** Curated RSS sources — extend as your team prefers */
export const AI_FEEDS = [
  { url: 'https://openai.com/blog/rss.xml', source: 'OpenAI' },
  { url: 'https://blog.google/technology/ai/rss/', source: 'Google AI' },
  { url: 'https://www.technologyreview.com/feed/', source: 'MIT Technology Review' },
  { url: 'https://feeds.arstechnica.com/arstechnica/index', source: 'Ars Technica' },
]

export const TECH_FEEDS = [
  { url: 'https://techcrunch.com/feed/', source: 'TechCrunch' },
  { url: 'https://www.theverge.com/rss/index.xml', source: 'The Verge' },
  { url: 'https://www.wired.com/feed/rss', source: 'Wired' },
]

/**
 * Official Google blogs (The Keyword + Developers). Routed by ingest heuristics into AI / tech / integrations.
 */
export const GOOGLE_OFFICIAL_FEEDS = [
  { url: 'https://blog.google/rss.xml', source: 'Google · The Keyword' },
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

/** Apple Newsroom Atom feed (official Apple company news; not the Apple News reader app). */
export const APPLE_NEWSROOM_FEEDS = [
  {
    url: 'https://www.apple.com/newsroom/rss-feed.rss',
    source: 'Apple Newsroom',
    section: 'tech',
    tags: ['apple', 'apple-newsroom'],
  },
]

/** Feeds pinned to a single feed section (TLDR editions, Apple Newsroom, …). */
export const FIXED_SECTION_FEEDS = [
  ...TLDR_NEWSLETTER_FEEDS,
  ...APPLE_NEWSROOM_FEEDS,
]

/**
 * Google News RSS (topic + search). Aggregates many publishers; complements direct feeds.
 * @see https://news.google.com/rss (undocumented but widely used URL shapes)
 */
export const GOOGLE_NEWS_FEEDS = [
  {
    url: 'https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-US&gl=US&ceid=US:en',
    source: 'Google News · Technology',
  },
  {
    url: 'https://news.google.com/rss/headlines/section/topic/SCIENCE?hl=en-US&gl=US&ceid=US:en',
    source: 'Google News · Science',
  },
  {
    url: 'https://news.google.com/rss/search?q=artificial+intelligence+OR+machine+learning+OR+LLM&hl=en-US&gl=US&ceid=US:en',
    source: 'Google News · AI & ML',
  },
  {
    url: 'https://news.google.com/rss/search?q=enterprise+software+OR+cloud+computing+OR+cybersecurity&hl=en-US&gl=US&ceid=US:en',
    source: 'Google News · Enterprise & cloud',
  },
]

/** Wire services and national outlets — high-trust general / tech desks */
export const CREDIBLE_WIRE_FEEDS = [
  {
    url: 'https://feeds.reuters.com/reuters/technologyNews',
    source: 'Reuters · Technology',
  },
  {
    url: 'https://feeds.bbci.co.uk/news/technology/rss.xml',
    source: 'BBC News · Technology',
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

/** All feeds passed through AI / tech / integrations routing (title + body heuristics) */
export const ROUTED_SOURCE_FEEDS = [
  ...TECH_FEEDS,
  ...GOOGLE_OFFICIAL_FEEDS,
  ...CREDIBLE_WIRE_FEEDS,
  ...GOOGLE_NEWS_FEEDS,
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
