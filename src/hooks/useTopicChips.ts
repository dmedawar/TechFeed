import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_INTEGRATIONS,
  DEFAULT_LANGUAGES,
  defaultStoredFilters,
  loadStoredFilters,
  saveStoredFilters,
  type StoredFilters,
  type TopicChip,
} from '@/lib/constants'
import { fetchCustomTopics } from '@/lib/supabase'
import type { CustomTopicRow, FeedSection } from '@/types'

function mergeChips(
  defaults: TopicChip[],
  customs: CustomTopicRow[],
  kind: CustomTopicRow['kind'],
): TopicChip[] {
  const map = new Map<string, TopicChip>()
  for (const d of defaults) {
    map.set(d.slug, d)
  }
  for (const c of customs) {
    if (c.kind !== kind) continue
    map.set(c.slug, {
      slug: c.slug,
      label: c.label,
      iconSlug: c.icon_slug,
      kind,
      isCustom: true,
    })
  }
  return [...map.values()].sort((a, b) => a.label.localeCompare(b.label))
}

export function useTopicChips(section: FeedSection) {
  const [customRows, setCustomRows] = useState<CustomTopicRow[]>([])
  const [filters, setFilters] = useState<StoredFilters>(() =>
    loadStoredFilters(),
  )

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data } = await fetchCustomTopics()
      if (!cancelled) setCustomRows(data)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const programmingChips = useMemo(
    () =>
      mergeChips(
        DEFAULT_LANGUAGES.map((x) => ({
          slug: x.slug,
          label: x.label,
          iconSlug: x.iconSlug,
          kind: 'language' as const,
        })),
        customRows,
        'language',
      ),
    [customRows],
  )

  const integrationChips = useMemo(
    () =>
      mergeChips(
        DEFAULT_INTEGRATIONS.map((x) => ({
          slug: x.slug,
          label: x.label,
          iconSlug: x.iconSlug,
          kind: 'integration' as const,
        })),
        customRows,
        'integration',
      ),
    [customRows],
  )

  const selectedForSection = useMemo(() => {
    if (section === 'programming') return new Set(filters.programming)
    if (section === 'integrations') return new Set(filters.integrations)
    return null
  }, [filters, section])

  const toggleSlug = useCallback(
    (slug: string) => {
      if (section !== 'programming' && section !== 'integrations') return
      setFilters((prev) => {
        const key = section === 'programming' ? 'programming' : 'integrations'
        const cur = new Set(prev[key])
        if (cur.has(slug)) cur.delete(slug)
        else cur.add(slug)
        const next = { ...prev, [key]: [...cur] }
        saveStoredFilters(next)
        return next
      })
    },
    [section],
  )

  const selectAllInSection = useCallback(() => {
    if (section !== 'programming' && section !== 'integrations') return
    setFilters((prev) => {
      const key = section === 'programming' ? 'programming' : 'integrations'
      const chips =
        section === 'programming' ? programmingChips : integrationChips
      const next = {
        ...prev,
        [key]: chips.map((c) => c.slug),
      }
      saveStoredFilters(next)
      return next
    })
  }, [integrationChips, programmingChips, section])

  const clearSection = useCallback(() => {
    if (section !== 'programming' && section !== 'integrations') return
    setFilters((prev) => {
      const key = section === 'programming' ? 'programming' : 'integrations'
      const next = { ...prev, [key]: [] as string[] }
      saveStoredFilters(next)
      return next
    })
  }, [section])

  const resetToDefaults = useCallback(() => {
    const next = defaultStoredFilters()
    saveStoredFilters(next)
    setFilters(next)
  }, [])

  const refreshCustomTopics = useCallback(async () => {
    const { data } = await fetchCustomTopics()
    setCustomRows(data)
  }, [])

  const reloadFiltersFromStorage = useCallback(() => {
    setFilters(loadStoredFilters())
  }, [])

  const tagFilterForQuery =
    section === 'programming'
      ? filters.programming
      : section === 'integrations'
        ? filters.integrations
        : null

  return {
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
    filters,
  }
}
