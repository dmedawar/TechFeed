import { useMemo } from 'react'
import { useFeed } from '../hooks/useFeed'
import ArticleCard from './ArticleCard'
import SkeletonCard from './SkeletonCard'
import './Feed.css'

export default function Feed({ activeSource, searchQuery }) {
  const { articles, loading, error, reload } = useFeed(activeSource)

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return articles
    const q = searchQuery.toLowerCase()
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.author && a.author.toLowerCase().includes(q)) ||
        (a.tags && a.tags.some((t) => t.toLowerCase().includes(q))) ||
        (a.domain && a.domain.toLowerCase().includes(q)),
    )
  }, [articles, searchQuery])

  if (error) {
    return (
      <div className="feed__error">
        <p className="feed__error-message">⚠️ {error}</p>
        <button className="feed__retry-btn" onClick={reload}>
          Try again
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="feed__list">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (!filtered.length) {
    return (
      <div className="feed__empty">
        <span className="feed__empty-icon">🔍</span>
        <p>No articles found{searchQuery ? ` for "${searchQuery}"` : ''}.</p>
      </div>
    )
  }

  return (
    <div className="feed__list" role="list">
      {filtered.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  )
}
