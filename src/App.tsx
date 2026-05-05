import { useCallback, useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { DateRangeFilter } from '@/components/DateRangeFilter'
import {
  hasActiveDateFilter,
  toPublishedBounds,
  type DatePresetId,
} from '@/lib/dateRangeFilter'
import { isSupabaseConfigured } from '@/lib/supabase'
import { AddTopicModal } from '@/components/AddTopicModal'
import { Banner } from '@/components/Banner'
import { FeedList } from '@/components/FeedList'
import { SectionNav } from '@/components/SectionNav'
import { TagFilters } from '@/components/TagFilters'
import {
  loadStoredFilters,
  saveStoredFilters,
  type TopicChip,
} from '@/lib/constants'
import { useFeed } from '@/hooks/useFeed'
import { useTopicChips } from '@/hooks/useTopicChips'
import type { FeedSection } from '@/types'

const WORKFLOW_LINK = import.meta.env.VITE_GITHUB_ACTIONS_INGEST_URL as
  | string
  | undefined

export default function App() {
  const [section, setSection] = useState<FeedSection>('ai')
  /** Default 30d: a 7d window hides everything if ingest lag is ~10–14 days. */
  const [datePreset, setDatePreset] = useState<DatePresetId>('30d')
  const [customDateFrom, setCustomDateFrom] = useState('')
  const [customDateTo, setCustomDateTo] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalKind, setModalKind] = useState<
    'language' | 'integration'
  >('language')
  const {
    programmingChips,
    integrationChips,
    selectedForSection,
    toggleSlug,
    selectAllInSection,
    clearSection,
    resetToDefaults,
    tagFilterForQuery,
    refreshCustomTopics,
    reloadFiltersFromStorage,
  } = useTopicChips(section)

  const resolvedTagFilter = useMemo(() => {
    if (section === 'programming' || section === 'integrations') {
      return tagFilterForQuery ?? []
    }
    return null
  }, [tagFilterForQuery, section])

  const dateBounds = useMemo(
    () => toPublishedBounds(datePreset, customDateFrom, customDateTo),
    [datePreset, customDateFrom, customDateTo],
  )

  const feed = useFeed({
    section,
    tagFilter: resolvedTagFilter,
    dateBounds,
  })

  const chips = useMemo(() => {
    if (section === 'programming') return programmingChips
    if (section === 'integrations') return integrationChips
    return []
  }, [integrationChips, programmingChips, section])

  const selected = selectedForSection ?? new Set<string>()

  const emptyHint = useMemo(() => {
    if (section === 'programming' || section === 'integrations') {
      if (!resolvedTagFilter?.length) {
        return 'Select one or more topics above to see articles here.'
      }
    }
    if (hasActiveDateFilter(dateBounds)) {
      return 'Nothing in this date range. Try a wider period or different topics.'
    }
    return 'Nothing matches these filters yet. Try adjusting your selections above.'
  }, [dateBounds, section, resolvedTagFilter])

  const onSavedTopic = useCallback(
    (chip: TopicChip) => {
      const key =
        chip.kind === 'language' ? 'programming' : 'integrations'
      const prev = loadStoredFilters()
      const nextSlugs = new Set(prev[key])
      nextSlugs.add(chip.slug)
      const next = { ...prev, [key]: [...nextSlugs] }
      saveStoredFilters(next)
      reloadFiltersFromStorage()
      void refreshCustomTopics()
    },
    [reloadFiltersFromStorage, refreshCustomTopics],
  )

  return (
    <div className="min-h-screen pb-10">
      <Banner />

      <DateRangeFilter
        preset={datePreset}
        customFrom={customDateFrom}
        customTo={customDateTo}
        onPresetChange={setDatePreset}
        onCustomFromChange={setCustomDateFrom}
        onCustomToChange={setCustomDateTo}
      />

      {WORKFLOW_LINK ? (
        <div className="sticky top-0 z-40 border-b border-[color:var(--color-line)] bg-[color:var(--color-surface-0)]/88 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl justify-end px-5 py-3 sm:px-8">
            <a
              href={WORKFLOW_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/10 px-4 py-2 text-xs font-medium text-accent-bright hover:bg-accent/15"
            >
              <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
              Refresh feeds
            </a>
          </div>
        </div>
      ) : null}

      <SectionNav
        active={section}
        onChange={(s) => {
          if (s !== 'programming' && s !== 'integrations') setModalOpen(false)
          setSection(s)
        }}
      />

      {(section === 'programming' || section === 'integrations') && (
        <div className="pt-2">
          <TagFilters
            chips={chips}
            selected={selected}
            showAddTopic={isSupabaseConfigured}
            onToggle={toggleSlug}
            onAddClick={() => {
              setModalKind(section === 'programming' ? 'language' : 'integration')
              setModalOpen(true)
            }}
            onSelectAll={selectAllInSection}
            onClear={clearSection}
            onResetDefaults={resetToDefaults}
          />
        </div>
      )}

      <FeedList
        items={feed.items}
        loading={feed.loading}
        refreshing={feed.refreshing}
        loadingMore={feed.loadingMore}
        hasMore={feed.hasMore}
        onLoadMore={feed.loadMore}
        emptyHint={emptyHint}
      />

      <AddTopicModal
        kind={modalKind}
        open={
          modalOpen &&
          (section === 'programming' || section === 'integrations')
        }
        onClose={() => setModalOpen(false)}
        onSaved={onSavedTopic}
        existing={chips}
      />
    </div>
  )
}
