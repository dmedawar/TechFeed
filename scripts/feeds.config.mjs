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
