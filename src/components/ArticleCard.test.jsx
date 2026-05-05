import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ArticleCard from '../components/ArticleCard'

const mockArticle = {
  id: 'hn-1234',
  source: 'hackernews',
  title: 'Why Rust is the future of systems programming',
  url: 'https://example.com/rust',
  author: 'torvalds',
  points: 452,
  comments: 87,
  commentsUrl: 'https://news.ycombinator.com/item?id=1234',
  publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  tags: [],
  domain: 'example.com',
}

describe('ArticleCard', () => {
  it('renders the article title as a link', () => {
    render(<ArticleCard article={mockArticle} />)
    const link = screen.getByRole('link', { name: mockArticle.title })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', mockArticle.url)
  })

  it('renders the source badge', () => {
    render(<ArticleCard article={mockArticle} />)
    expect(screen.getByText('HN')).toBeInTheDocument()
  })

  it('renders author name', () => {
    render(<ArticleCard article={mockArticle} />)
    expect(screen.getByText('torvalds')).toBeInTheDocument()
  })

  it('renders points', () => {
    render(<ArticleCard article={mockArticle} />)
    expect(screen.getByText('452')).toBeInTheDocument()
  })

  it('renders domain', () => {
    render(<ArticleCard article={mockArticle} />)
    expect(screen.getByText('example.com')).toBeInTheDocument()
  })

  it('renders tags when present', () => {
    const articleWithTags = { ...mockArticle, tags: ['rust', 'systems'] }
    render(<ArticleCard article={articleWithTags} />)
    expect(screen.getByText('#rust')).toBeInTheDocument()
    expect(screen.getByText('#systems')).toBeInTheDocument()
  })

  it('does not render cover image when none provided', () => {
    render(<ArticleCard article={mockArticle} />)
    expect(screen.queryByRole('img', { name: '' })).toBeNull()
  })

  it('renders cover image when provided', () => {
    const articleWithCover = { ...mockArticle, coverImage: 'https://example.com/cover.jpg' }
    const { container } = render(<ArticleCard article={articleWithCover} />)
    const img = container.querySelector('img.card__cover')
    expect(img).not.toBeNull()
    expect(img).toHaveAttribute('src', articleWithCover.coverImage)
  })
})
