/**
 * Client-side diagnostics for stale / empty feeds. Only runs when `vite` dev server
 * is active (`npm run dev`); production builds strip this. Output: **browser DevTools**
 * console, not the shell (the UI runs in the browser).
 */
export function feedDebug(label: string, ...args: unknown[]) {
  if (import.meta.env.DEV) {
    console.debug(`[TechFeed feed:debug] ${label}`, ...args)
  }
}
