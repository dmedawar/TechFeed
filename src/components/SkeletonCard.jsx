import './SkeletonCard.css'

export default function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-card__body">
        <div className="skeleton-card__row">
          <div className="skeleton skeleton--badge" />
          <div className="skeleton skeleton--domain" />
        </div>
        <div className="skeleton skeleton--title-1" />
        <div className="skeleton skeleton--title-2" />
        <div className="skeleton-card__footer">
          <div className="skeleton skeleton--avatar" />
          <div className="skeleton skeleton--author" />
          <div className="skeleton skeleton--stat" />
        </div>
      </div>
    </div>
  )
}
