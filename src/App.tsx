import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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

  const reloadRef = useRef(feed.reload)
  useEffect(() => {
    reloadRef.current = feed.reload
  }, [feed.reload])

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'visible') void reloadRef.current()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  const chips = useMemo(() => {
    if (section === 'programming') return programmingChips
    if (section === 'integrations') return integrationChips
    return []
  }, [integrationChips, programmingChips, section])

  const selected = selectedForSection ?? new Set<string>()

  const emptyHint = useMemo(() => {
    if (isSupabaseConfigured) {
      if (section === 'programming' || section === 'integrations') {
        if (!resolvedTagFilter?.length) {
          return 'Select one or more topics above to see articles here.'
        }
      }
      if (hasActiveDateFilter(dateBounds)) {
        return 'Nothing in this date range. Try “All time” or a wider window — or confirm ingest is populating Supabase.'
      }
      return 'No articles in Supabase for this view yet. Ingest runs on a schedule via GitHub Actions (every 4h UTC weekdays, every 8h weekends); wait for the next run or trigger the workflow manually, then tap “Reload from database”. You can also run npm run ingest locally.'
    }
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

      {!isSupabaseConfigured ? (
        <div
          role="status"
          className="border-b border-amber-500/35 bg-amber-500/12 px-5 py-3 text-center text-sm font-medium text-amber-950 dark:text-amber-100"
        >
          Live articles are disabled: set{' '}
          <code className="rounded bg-black/10 px-1 py-0.5 text-xs dark:bg-white/10">
            VITE_SUPABASE_URL
          </code>{' '}
          and{' '}
          <code className="rounded bg-black/10 px-1 py-0.5 text-xs dark:bg-white/10">
            VITE_SUPABASE_ANON_KEY
          </code>{' '}
          on Netlify (or <code className="text-xs">.env</code> locally), then redeploy. Below is
          offline sample data only.
        </div>
      ) : null}

      <DateRangeFilter
        preset={datePreset}
        customFrom={customDateFrom}
        customTo={customDateTo}
        onPresetChange={setDatePreset}
        onCustomFromChange={setCustomDateFrom}
        onCustomToChange={setCustomDateTo}
      />

      {isSupabaseConfigured ? (
        <div className="sticky top-0 z-40 border-b border-[color:var(--color-line)] bg-[color:var(--color-surface-0)]/88 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-end gap-2 px-5 py-3 sm:px-8">
            <button
              type="button"
              onClick={() => void feed.reload()}
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-surface-1)] px-4 py-2 text-xs font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-surface-2)]"
            >
              <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
              Reload from database
            </button>
            {WORKFLOW_LINK ? (
              <a
                href={WORKFLOW_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/10 px-4 py-2 text-xs font-medium text-accent-bright hover:bg-accent/15"
              >
                <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
                Run ingest (GitHub)
              </a>
            ) : null}
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
