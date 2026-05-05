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
    url: 'https://www.reddit.com/r/news/.rss',
    source: 'Reddit · r/news',
    section: 'general',
    tags: ['reddit'],
  },
  {
    url: 'https://www.reddit.com/r/technology/.rss',
    source: 'Reddit · r/technology',
    section: 'general',
    tags: ['reddit'],
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
