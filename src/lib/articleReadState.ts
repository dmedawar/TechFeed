const STORAGE_KEY = 'techfeed-read-article-ids'
const MAX_IDS = 2500

const listeners = new Set<() => void>()
let version = 0

function bump() {
  version += 1
  listeners.forEach((l) => l())
}

export function subscribeArticleReadState(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export function getArticleReadStateVersion(): number {
  return version
}

function loadIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const p = raw ? JSON.parse(raw) : []
    return Array.isArray(p) ? p.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}

function saveIds(ids: string[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.slice(-MAX_IDS)))
  } catch {
    /* quota */
  }
}

export function isArticleRead(id: string): boolean {
  return loadIds().includes(id)
}

/** Call when the user opens the article (e.g. clicks through to the source). */
export function markArticleOpened(id: string): void {
  if (typeof window === 'undefined') return
  const without = loadIds().filter((x) => x !== id)
  saveIds([...without, id])
  bump()
}
