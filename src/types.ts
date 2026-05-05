export type FeedSection =
  | 'ai'
  | 'tech'
  | 'general'
  | 'programming'
  | 'integrations'

export type TopicKind = 'language' | 'integration'

export type FeedItemRow = {
  id: string
  title: string
  url: string
  summary: string | null
  thumbnail_url: string | null
  section: FeedSection
  tags: string[]
  source_name: string | null
  published_at: string
  created_at: string
  /** Bumped when ingest changes meaningful fields; used for client cache reconciliation. */
  updated_at?: string
}

export type CustomTopicRow = {
  id: string
  kind: TopicKind
  slug: string
  label: string
  icon_slug: string | null
  created_at: string
}
