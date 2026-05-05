import clsx from 'clsx'
import { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'

/** Bundled wordmarks: dark-on-light and light-on-dark. */
const LOGO_LIGHT = '/brand/logo-1916-light.png'
const LOGO_DARK = '/brand/logo-1916-dark.png'

const BRAND_LOGO_URL = import.meta.env.VITE_BRAND_LOGO_URL as
  | string
  | undefined

export function Logo({
  className,
  variant = 'default',
}: {
  className?: string
  variant?: 'default' | 'compact'
}) {
  const { theme } = useTheme()
  const [imgFailed, setImgFailed] = useState(false)
  const compact = variant === 'compact'

  const envUrl = BRAND_LOGO_URL?.trim()
  const bundledSrc = theme === 'dark' ? LOGO_DARK : LOGO_LIGHT
  const src = envUrl || bundledSrc
  const showImage = !imgFailed

  if (showImage) {
    return (
      <div className={clsx('select-none', className)}>
        <img
          key={`${src}-${theme}`}
          src={src}
          alt="The 1916 Company"
          className={clsx(
            'w-auto object-contain object-left',
            compact
              ? 'max-h-9 max-w-[5.75rem] sm:max-h-10 sm:max-w-[6.5rem]'
              : 'max-h-12 max-w-[min(100%,220px)] sm:max-h-14 sm:max-w-[260px]',
          )}
          loading="eager"
          decoding="async"
          onError={() => setImgFailed(true)}
        />
      </div>
    )
  }

  return (
    <div className={clsx('select-none', className)}>
      <p
        className={clsx(
          'font-semibold uppercase tracking-[0.48em] text-[color:var(--color-ink-muted)]',
          compact
            ? 'text-[0.5rem] tracking-[0.36em]'
            : 'text-[0.65rem] tracking-[0.48em]',
        )}
      >
        The
      </p>
      <p
        className={clsx(
          'mt-0.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-0 font-semibold leading-none',
          compact
            ? 'text-[1.15rem] sm:text-[1.35rem]'
            : 'mt-1 gap-x-2.5 text-[2rem] sm:text-[2.35rem]',
        )}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <span className="text-[color:var(--color-accent)]">1916</span>
        <span className="tracking-[0.06em] text-[color:var(--color-ink)]">
          Company
        </span>
      </p>
      <div
        className={clsx(
          'h-px bg-gradient-to-r from-[color:var(--color-accent)] via-[color:var(--color-accent-dim)]/50 to-transparent',
          compact ? 'mt-1.5 max-w-[3.5rem]' : 'mt-3 max-w-[10rem]',
        )}
        aria-hidden
      />
    </div>
  )
}
