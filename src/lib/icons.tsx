import { useState } from 'react'
import {
  AppWindow,
  Brain,
  Code2,
  Layers,
  Newspaper,
  PlugZap,
} from 'lucide-react'
import type { FeedSection } from '@/types'
import { brandIconUrl } from '@/lib/iconHelpers'

export function SectionGlyph({
  section,
  className,
}: {
  section: FeedSection
  className?: string
}) {
  const props = { className, 'aria-hidden': true as const, strokeWidth: 1.75 }
  switch (section) {
    case 'ai':
      return <Brain {...props} />
    case 'tech':
      return <Newspaper {...props} />
    case 'programming':
      return <Code2 {...props} />
    case 'integrations':
      return <PlugZap {...props} />
    default:
      return <Layers {...props} />
  }
}

function BrandGlyphInner({
  label,
  iconSlug,
  size = 20,
}: {
  label: string
  iconSlug: string | null
  size?: number
}) {
  const url = brandIconUrl(iconSlug)
  const [failed, setFailed] = useState(false)
  const initials = label
    .split(/[\s./]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')

  if (url && !failed) {
    return (
      <img
        src={url}
        alt=""
        width={size}
        height={size}
        className="rounded-md bg-[color:var(--app-muted-fill)] ring-1 ring-[color:var(--app-ring-subtle)]"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    )
  }

  return (
    <span
      className="flex items-center justify-center rounded-md bg-[color:var(--app-muted-fill)] font-semibold text-[0.65rem] uppercase tracking-wide text-accent-bright/95 ring-1 ring-[color:var(--app-ring-subtle)]"
      style={{ width: size, height: size }}
      aria-hidden
    >
      {initials || <AppWindow size={size * 0.65} strokeWidth={1.75} />}
    </span>
  )
}

export function BrandGlyph(props: {
  label: string
  iconSlug: string | null
  size?: number
}) {
  return (
    <BrandGlyphInner
      key={`${props.iconSlug ?? ''}:${props.label}`}
      {...props}
    />
  )
}
