import { formatDistanceToNow } from '../utils/time'
import './ArticleCard.css'

const SOURCE_LABELS = {
  hackernews: 'HN',
  devto: 'DEV',
  lobsters: 'LOB',
}

export default function ArticleCard({ article }) {
  const {
    title,
    url,
    author,
    authorAvatar,
    points,
    comments,
    commentsUrl,
    publishedAt,
    tags,
    source,
    domain,
    readingTime,
    coverImage,
  } = article

  const timeAgo = publishedAt ? formatDistanceToNow(new Date(publishedAt)) : null

  return (
    <article className="card" role="listitem">
      {coverImage && (
        <a href={url} target="_blank" rel="noopener noreferrer" className="card__cover-link" tabIndex={-1} aria-hidden="true">
          <img className="card__cover" src={coverImage} alt="" loading="lazy" />
        </a>
      )}

      <div className="card__body">
        <div className="card__meta-top">
          <span className={`card__source card__source--${source}`} aria-label={`Source: ${source}`}>
            {SOURCE_LABELS[source] ?? source}
          </span>

          {domain && <span className="card__domain">{domain}</span>}

          {timeAgo && <span className="card__time">{timeAgo}</span>}
        </div>

        <h2 className="card__title">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="card__title-link"
          >
            {title}
          </a>
        </h2>

        {tags && tags.length > 0 && (
          <div className="card__tags" aria-label="Tags">
            {tags.slice(0, 4).map((tag) => (
              <span key={tag} className="card__tag">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="card__footer">
          <div className="card__author">
            {authorAvatar ? (
              <img className="card__avatar" src={authorAvatar} alt={author} loading="lazy" />
            ) : (
              <span className="card__avatar-placeholder" aria-hidden="true">
                {author ? author[0].toUpperCase() : '?'}
              </span>
            )}
            {author && <span className="card__author-name">{author}</span>}
          </div>

          <div className="card__stats">
            {readingTime != null && (
              <span className="card__stat" title="Reading time">
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M8 5v3.5l2 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                {readingTime} min
              </span>
            )}

            {points != null && (
              <span className="card__stat" title="Points">
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 2l1.8 3.6L14 6.5l-3 2.9.7 4.1L8 11.4l-3.7 2.1.7-4.1-3-2.9 4.2-.9z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
                {points}
              </span>
            )}

            {comments != null && (
              <a href={commentsUrl} target="_blank" rel="noopener noreferrer" className="card__stat card__stat--link" title="Comments">
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v7a1 1 0 01-1 1H6l-3 2v-2H3a1 1 0 01-1-1V3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                </svg>
                {comments}
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
