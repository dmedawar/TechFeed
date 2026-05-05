import clsx from 'clsx'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setDark } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div
      className={clsx(
        'flex items-center gap-2 rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-surface-2)]/80 px-2.5 py-1.5',
        className,
      )}
    >
      <Sun
        className="h-3.5 w-3.5 shrink-0 text-[color:var(--color-ink-muted)]"
        strokeWidth={2}
        aria-hidden
      />
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? 'Use light mode' : 'Use dark mode'}
        onClick={() => setDark(!isDark)}
        className={clsx(
          'relative h-7 w-12 shrink-0 rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-surface-3)]',
          'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45',
        )}
      >
        <span
          className="absolute top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-accent shadow-sm transition-[transform] duration-200 ease-out"
          style={{
            transform: isDark ? 'translateX(1.375rem)' : 'translateX(0.125rem)',
          }}
        >
          {isDark ? (
            <Moon
              className="h-3 w-3 text-accent-foreground"
              strokeWidth={2.5}
              aria-hidden
            />
          ) : (
            <Sun
              className="h-3 w-3 text-accent-foreground"
              strokeWidth={2.5}
              aria-hidden
            />
          )}
        </span>
      </button>
      <Moon
        className="h-3.5 w-3.5 shrink-0 text-[color:var(--color-ink-muted)]"
        strokeWidth={2}
        aria-hidden
      />
    </div>
  )
}
