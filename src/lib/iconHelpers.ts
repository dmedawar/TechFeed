export function brandIconUrl(iconSlug: string | null, fallbackHex = 'c6a76b') {
  if (!iconSlug) return null
  return `https://cdn.simpleicons.org/${iconSlug}/${fallbackHex}`
}
