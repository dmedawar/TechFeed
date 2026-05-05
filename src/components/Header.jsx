import './Header.css'

export default function Header({ sources, activeSource, onSourceChange, searchQuery, onSearchChange }) {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__brand">
          <svg className="header__logo" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="#6366f1" />
            <path d="M8 10h16M8 16h10M8 22h13" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span className="header__title">TechFeed</span>
        </div>

        <div className="header__search-wrap">
          <svg className="header__search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8" />
            <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            className="header__search"
            type="search"
            placeholder="Search articles…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search articles"
          />
        </div>
      </div>

      <nav className="header__nav" aria-label="Article sources">
        {sources.map((source) => (
          <button
            key={source.id}
            className={`header__tab${activeSource === source.id ? ' header__tab--active' : ''}`}
            onClick={() => onSourceChange(source.id)}
            aria-pressed={activeSource === source.id}
          >
            {source.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
