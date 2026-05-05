import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'

export function Banner() {
  return (
    <header className="relative overflow-hidden border-b border-[color:var(--color-line)] bg-[color:var(--color-surface-1)]/92 backdrop-blur-xl">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,var(--app-glow),transparent_55%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl pt-8 pb-8 sm:pt-10 sm:pb-10">
        <div className="pointer-events-none absolute inset-x-0 top-8 z-10 flex justify-between px-5 sm:top-10 sm:px-8">
          <div className="pointer-events-auto">
            <Logo variant="compact" />
          </div>
          <div className="pointer-events-auto">
            <ThemeToggle />
          </div>
        </div>
        <div className="mx-auto max-w-2xl px-5 pt-14 text-center sm:px-8">
          <h1
            className="text-[1.65rem] font-bold tracking-tight text-[color:var(--color-accent-bright)] sm:text-[1.95rem]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Tech Feed
          </h1>
          <p className="mt-2 text-[0.9375rem] font-bold leading-relaxed text-[color:var(--color-ink-muted)] sm:text-base">
            One place to scan what matters across AI, tech, engineering, and
            the tools we depend on.
          </p>
        </div>
      </div>
    </header>
  )
}
