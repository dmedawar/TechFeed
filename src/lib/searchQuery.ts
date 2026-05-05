/** Align client-side search matching with `fetchFeedSearchPage` normalization. */
export const GLOBAL_SEARCH_MIN_CHARS = 2
export const GLOBAL_SEARCH_MAX_CHARS = 80

export function normalizeGlobalSearchQuery(raw: string): string {
  return raw
    .trim()
    .replace(/"/g, '')
    .replace(/,/g, ' ')
    .replace(/\s+/g, ' ')
    .slice(0, GLOBAL_SEARCH_MAX_CHARS)
}
