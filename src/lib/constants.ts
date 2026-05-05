import type { FeedSection, TopicKind } from '@/types'

export const PAGE_SIZE = 12

export const SECTION_ORDER: FeedSection[] = [
  'ai',
  'tech',
  'programming',
  'integrations',
]

export const SECTION_META: Record<
  FeedSection,
  { label: string; description: string }
> = {
  ai: {
    label: 'AI',
    description: 'Research, models, and practical applications',
  },
  tech: {
    label: 'Tech',
    description: 'Industry news that affects roadmaps',
  },
  programming: {
    label: 'Programming',
    description: 'Languages and frameworks your teams use',
  },
  integrations: {
    label: 'Integrations',
    description: 'Platforms in your stack',
  },
}

/** Default chips: slug → display label & Simple Icons slug (CDN) when applicable */
export const DEFAULT_LANGUAGES: {
  slug: string
  label: string
  iconSlug: string | null
}[] = [
  { slug: 'react', label: 'React', iconSlug: 'react' },
  { slug: 'swift', label: 'Swift', iconSlug: 'swift' },
  { slug: 'javascript', label: 'JavaScript', iconSlug: 'javascript' },
  { slug: 'nodejs', label: 'Node.js', iconSlug: 'nodedotjs' },
  { slug: 'dotnet', label: '.NET', iconSlug: 'dotnet' },
]

export const DEFAULT_INTEGRATIONS: {
  slug: string
  label: string
  iconSlug: string | null
}[] = [
  { slug: 'braze', label: 'Braze', iconSlug: 'braze' },
  { slug: 'socialplus', label: 'social.plus', iconSlug: null },
  { slug: 'github', label: 'GitHub', iconSlug: 'github' },
  { slug: 'firebase', label: 'Firebase', iconSlug: 'firebase' },
  { slug: 'salesforce', label: 'Salesforce', iconSlug: 'salesforce' },
  {
    slug: 'appstoreconnect',
    label: 'App Store Connect',
    iconSlug: 'appstore',
  },
]

export type TopicChip = {
  slug: string
  label: string
  iconSlug: string | null
  kind: TopicKind
  isCustom?: boolean
}

const STORAGE_KEY = 'techfeed:filters:v1'

export type StoredFilters = {
  programming: string[]
  integrations: string[]
}

export function defaultStoredFilters(): StoredFilters {
  return {
    programming: DEFAULT_LANGUAGES.map((x) => x.slug),
    integrations: DEFAULT_INTEGRATIONS.map((x) => x.slug),
  }
}

export function loadStoredFilters(): StoredFilters {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultStoredFilters()
    const parsed = JSON.parse(raw) as StoredFilters
    if (!parsed.programming?.length || !parsed.integrations?.length) {
      return defaultStoredFilters()
    }
    return parsed
  } catch {
    return defaultStoredFilters()
  }
}

export function saveStoredFilters(filters: StoredFilters) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
}

export function normalizeTopicSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}
