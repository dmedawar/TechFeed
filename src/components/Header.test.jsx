import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Header from '../components/Header'

const SOURCES = [
  { id: 'all', label: 'All' },
  { id: 'hackernews', label: 'Hacker News' },
  { id: 'devto', label: 'Dev.to' },
]

describe('Header', () => {
  it('renders the brand name', () => {
    render(
      <Header
        sources={SOURCES}
        activeSource="all"
        onSourceChange={vi.fn()}
        searchQuery=""
        onSearchChange={vi.fn()}
      />,
    )
    expect(screen.getByText('TechFeed')).toBeInTheDocument()
  })

  it('renders all source tabs', () => {
    render(
      <Header
        sources={SOURCES}
        activeSource="all"
        onSourceChange={vi.fn()}
        searchQuery=""
        onSearchChange={vi.fn()}
      />,
    )
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Hacker News')).toBeInTheDocument()
    expect(screen.getByText('Dev.to')).toBeInTheDocument()
  })

  it('marks active source tab as pressed', () => {
    render(
      <Header
        sources={SOURCES}
        activeSource="hackernews"
        onSourceChange={vi.fn()}
        searchQuery=""
        onSearchChange={vi.fn()}
      />,
    )
    const hnTab = screen.getByText('Hacker News').closest('button')
    expect(hnTab).toHaveAttribute('aria-pressed', 'true')
  })

  it('calls onSourceChange when a tab is clicked', async () => {
    const onSourceChange = vi.fn()
    render(
      <Header
        sources={SOURCES}
        activeSource="all"
        onSourceChange={onSourceChange}
        searchQuery=""
        onSearchChange={vi.fn()}
      />,
    )
    await userEvent.click(screen.getByText('Dev.to'))
    expect(onSourceChange).toHaveBeenCalledWith('devto')
  })

  it('calls onSearchChange when typing in search box', async () => {
    const onSearchChange = vi.fn()
    render(
      <Header
        sources={SOURCES}
        activeSource="all"
        onSourceChange={vi.fn()}
        searchQuery=""
        onSearchChange={onSearchChange}
      />,
    )
    const input = screen.getByRole('searchbox')
    await userEvent.type(input, 'rust')
    expect(onSearchChange).toHaveBeenCalled()
  })
})
