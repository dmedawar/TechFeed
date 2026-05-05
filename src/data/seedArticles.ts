import type { FeedItemRow } from '@/types'

const iso = (d: string) => new Date(d).toISOString()

/** Curated starter articles so the feed is readable before backend ingest runs. */
export const SEED_ARTICLES: FeedItemRow[] = [
  {
    id: 'seed-ai-1',
    title: 'Anthropic expands Claude for enterprise workflows',
    url: 'https://www.anthropic.com/news',
    summary:
      'How teams are deploying safer, steerable models for research, support, and internal copilots — plus what to watch as capabilities grow.',
    thumbnail_url: null,
    section: 'ai',
    tags: ['ai-signal', 'anthropic'],
    source_name: 'Anthropic',
    published_at: iso('2026-04-22T14:00:00Z'),
    created_at: iso('2026-04-22T14:00:00Z'),
  },
  {
    id: 'seed-ai-2',
    title: 'OpenAI: reasoning models and the path to reliable agents',
    url: 'https://openai.com/news/',
    summary:
      'A look at tool use, evaluation, and product guardrails as AI moves from chat to autonomous workflows.',
    thumbnail_url: null,
    section: 'ai',
    tags: ['ai-signal', 'openai'],
    source_name: 'OpenAI',
    published_at: iso('2026-04-18T10:30:00Z'),
    created_at: iso('2026-04-18T10:30:00Z'),
  },
  {
    id: 'seed-ai-3',
    title: 'Google DeepMind: advances in multimodal understanding',
    url: 'https://deepmind.google/discover/blog/',
    summary:
      'Research highlights spanning vision, language, and scientific discovery — and what they imply for product teams.',
    thumbnail_url: null,
    section: 'ai',
    tags: ['ai-signal', 'research'],
    source_name: 'Google DeepMind',
    published_at: iso('2026-04-12T09:15:00Z'),
    created_at: iso('2026-04-12T09:15:00Z'),
  },
  {
    id: 'seed-ai-4',
    title: 'EU AI Act: compliance timelines for global product launches',
    url: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai',
    summary:
      'Practical framing for roadmap owners balancing innovation with transparency and risk management requirements.',
    thumbnail_url: null,
    section: 'ai',
    tags: ['ai-signal', 'policy'],
    source_name: 'European Commission',
    published_at: iso('2026-04-08T16:45:00Z'),
    created_at: iso('2026-04-08T16:45:00Z'),
  },
  {
    id: 'seed-ai-5',
    title: 'Benchmarks vs. reality: evaluating LLMs for your use case',
    url: 'https://arxiv.org/list/cs.CL/recent',
    summary:
      'Why leaderboard scores diverge from production quality — and how to design evals that match customer workflows.',
    thumbnail_url: null,
    section: 'ai',
    tags: ['ai-signal', 'evals'],
    source_name: 'Research roundup',
    published_at: iso('2026-04-05T11:00:00Z'),
    created_at: iso('2026-04-05T11:00:00Z'),
  },
  {
    id: 'seed-ai-6',
    title: 'On-device AI and privacy-preserving inference',
    url: 'https://developer.apple.com/machine-learning/',
    summary:
      'When edge deployment wins on latency and trust, and what trade-offs to expect for model size and updates.',
    thumbnail_url: null,
    section: 'ai',
    tags: ['ai-signal', 'edge'],
    source_name: 'Apple Developer',
    published_at: iso('2026-04-01T08:20:00Z'),
    created_at: iso('2026-04-01T08:20:00Z'),
  },
  {
    id: 'seed-tech-1',
    title: 'The state of the semiconductor supply chain in 2026',
    url: 'https://www.reuters.com/technology/',
    summary:
      'Lead times, packaging, and geopolitics — what hardware-dependent roadmaps should assume this year.',
    thumbnail_url: null,
    section: 'tech',
    tags: ['industry'],
    source_name: 'Reuters Tech',
    published_at: iso('2026-04-24T13:10:00Z'),
    created_at: iso('2026-04-24T13:10:00Z'),
  },
  {
    id: 'seed-tech-2',
    title: 'Apple previews next-generation developer tools',
    url: 'https://developer.apple.com/news/',
    summary:
      'IDE improvements, distribution changes, and platform capabilities relevant to mobile product releases.',
    thumbnail_url: null,
    section: 'tech',
    tags: ['platform'],
    source_name: 'Apple Developer News',
    published_at: iso('2026-04-21T15:00:00Z'),
    created_at: iso('2026-04-21T15:00:00Z'),
  },
  {
    id: 'seed-tech-3',
    title: 'Enterprise SaaS spend: where budgets moved last quarter',
    url: 'https://www.theverge.com/tech',
    summary:
      'A concise read on which categories grew, where churn appeared, and what it signals for vendor strategy.',
    thumbnail_url: null,
    section: 'tech',
    tags: ['business'],
    source_name: 'The Verge',
    published_at: iso('2026-04-19T12:00:00Z'),
    created_at: iso('2026-04-19T12:00:00Z'),
  },
  {
    id: 'seed-tech-4',
    title: 'Cybersecurity incidents that shaped board-level priorities',
    url: 'https://www.cisa.gov/news-events/cybersecurity-advisories',
    summary:
      'Why resilience and identity investments are top of mind for executives sponsoring digital products.',
    thumbnail_url: null,
    section: 'tech',
    tags: ['security'],
    source_name: 'CISA',
    published_at: iso('2026-04-14T09:40:00Z'),
    created_at: iso('2026-04-14T09:40:00Z'),
  },
  {
    id: 'seed-tech-5',
    title: 'Climate tech and datacenter energy: trends to track',
    url: 'https://www.iea.org/topics/energy-efficiency',
    summary:
      'How sustainability reporting intersects with infrastructure decisions for cloud-native teams.',
    thumbnail_url: null,
    section: 'tech',
    tags: ['sustainability'],
    source_name: 'IEA',
    published_at: iso('2026-04-10T14:25:00Z'),
    created_at: iso('2026-04-10T14:25:00Z'),
  },
  {
    id: 'seed-tech-6',
    title: 'Antitrust and app ecosystems: the regulatory snapshot',
    url: 'https://www.ftc.gov/news-events/topics/technology',
    summary:
      'What product leaders should know about storefront rules, defaults, and interoperability expectations.',
    thumbnail_url: null,
    section: 'tech',
    tags: ['policy'],
    source_name: 'FTC',
    published_at: iso('2026-04-06T10:05:00Z'),
    created_at: iso('2026-04-06T10:05:00Z'),
  },
  {
    id: 'seed-pr-1',
    title: 'React 19 patterns for data-heavy dashboards',
    url: 'https://react.dev/blog',
    summary:
      'Suspense boundaries, server components trade-offs, and keeping UX responsive under load.',
    thumbnail_url: null,
    section: 'programming',
    tags: ['react'],
    source_name: 'React Blog',
    published_at: iso('2026-04-23T18:00:00Z'),
    created_at: iso('2026-04-23T18:00:00Z'),
  },
  {
    id: 'seed-pr-2',
    title: 'Swift 6 concurrency: migration notes for app teams',
    url: 'https://www.swift.org/blog/',
    summary:
      'Actor isolation, Sendable, and incremental adoption paths for large codebases.',
    thumbnail_url: null,
    section: 'programming',
    tags: ['swift'],
    source_name: 'Swift.org',
    published_at: iso('2026-04-20T11:30:00Z'),
    created_at: iso('2026-04-20T11:30:00Z'),
  },
  {
    id: 'seed-pr-3',
    title: 'JavaScript tooling in 2026: bundlers, typecheck, and CI speed',
    url: 'https://developer.mozilla.org/en-US/blog/',
    summary:
      'Practical choices for fast feedback loops without sacrificing maintainability.',
    thumbnail_url: null,
    section: 'programming',
    tags: ['javascript'],
    source_name: 'MDN Blog',
    published_at: iso('2026-04-17T09:10:00Z'),
    created_at: iso('2026-04-17T09:10:00Z'),
  },
  {
    id: 'seed-pr-4',
    title: 'Node.js LTS: upgrade planning for API platforms',
    url: 'https://nodejs.org/en/blog',
    summary:
      'Release schedules, native test runner maturity, and dependency hygiene at scale.',
    thumbnail_url: null,
    section: 'programming',
    tags: ['nodejs'],
    source_name: 'Node.js Blog',
    published_at: iso('2026-04-15T13:45:00Z'),
    created_at: iso('2026-04-15T13:45:00Z'),
  },
  {
    id: 'seed-pr-5',
    title: '.NET Aspire and cloud-native developer experience',
    url: 'https://devblogs.microsoft.com/dotnet/',
    summary:
      'How teams standardize local dev, observability, and service defaults across microservices.',
    thumbnail_url: null,
    section: 'programming',
    tags: ['dotnet'],
    source_name: '.NET Blog',
    published_at: iso('2026-04-11T08:50:00Z'),
    created_at: iso('2026-04-11T08:50:00Z'),
  },
  {
    id: 'seed-pr-6',
    title: 'Type-safe APIs end to end: lessons from large migrations',
    url: 'https://www.typescriptlang.org/docs/',
    summary:
      'Contract testing, schema evolution, and preventing drift between clients and services.',
    thumbnail_url: null,
    section: 'programming',
    tags: ['javascript', 'react'],
    source_name: 'TypeScript',
    published_at: iso('2026-04-09T16:15:00Z'),
    created_at: iso('2026-04-09T16:15:00Z'),
  },
  {
    id: 'seed-int-1',
    title: 'GitHub Actions: secure CI patterns for mobile releases',
    url: 'https://github.blog/',
    summary:
      'Secrets management, OIDC to clouds, and protecting supply chains without slowing releases.',
    thumbnail_url: null,
    section: 'integrations',
    tags: ['github'],
    source_name: 'GitHub Blog',
    published_at: iso('2026-04-25T12:00:00Z'),
    created_at: iso('2026-04-25T12:00:00Z'),
  },
  {
    id: 'seed-int-2',
    title: 'Firebase: growth and engagement features for product teams',
    url: 'https://firebase.blog/',
    summary:
      'Analytics, messaging, and Remote Config — tying experimentation to retention outcomes.',
    thumbnail_url: null,
    section: 'integrations',
    tags: ['firebase'],
    source_name: 'Firebase Blog',
    published_at: iso('2026-04-22T10:20:00Z'),
    created_at: iso('2026-04-22T10:20:00Z'),
  },
  {
    id: 'seed-int-3',
    title: 'Salesforce World Tour: AI across CRM and service clouds',
    url: 'https://www.salesforce.com/news/',
    summary:
      'Executive-friendly recap of announcements relevant to revenue and customer experience teams.',
    thumbnail_url: null,
    section: 'integrations',
    tags: ['salesforce'],
    source_name: 'Salesforce News',
    published_at: iso('2026-04-19T14:40:00Z'),
    created_at: iso('2026-04-19T14:40:00Z'),
  },
  {
    id: 'seed-int-4',
    title: 'App Store Connect: submission tips for smoother review',
    url: 'https://developer.apple.com/news/',
    summary:
      'Metadata, entitlements, and test notes that reduce back-and-forth during review cycles.',
    thumbnail_url: null,
    section: 'integrations',
    tags: ['appstoreconnect'],
    source_name: 'Apple Developer',
    published_at: iso('2026-04-16T09:00:00Z'),
    created_at: iso('2026-04-16T09:00:00Z'),
  },
  {
    id: 'seed-int-5',
    title: 'Braze: orchestrating cross-channel lifecycle campaigns',
    url: 'https://www.braze.com/resources/articles',
    summary:
      'Personalization guardrails, frequency caps, and measuring uplift without annoying users.',
    thumbnail_url: null,
    section: 'integrations',
    tags: ['braze'],
    source_name: 'Braze',
    published_at: iso('2026-04-13T11:25:00Z'),
    created_at: iso('2026-04-13T11:25:00Z'),
  },
  {
    id: 'seed-int-6',
    title: 'Community platforms and social layers inside apps',
    url: 'https://social.plus/',
    summary:
      'When embedded communities drive retention — design patterns and moderation basics.',
    thumbnail_url: null,
    section: 'integrations',
    tags: ['socialplus'],
    source_name: 'social.plus',
    published_at: iso('2026-04-07T15:50:00Z'),
    created_at: iso('2026-04-07T15:50:00Z'),
  },
]

export function getSeedItemsForView(
  section: FeedItemRow['section'],
  tagFilter: string[] | null,
): FeedItemRow[] {
  let rows = SEED_ARTICLES.filter((r) => r.section === section)
  if (section === 'programming' || section === 'integrations') {
    if (!tagFilter?.length) return []
    rows = rows.filter((r) =>
      r.tags.some((t) => tagFilter.includes(t)),
    )
  }
  return rows
}
