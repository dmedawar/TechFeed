import { describe, it, expect } from 'vitest'
import { formatDistanceToNow } from '../utils/time'

describe('formatDistanceToNow', () => {
  it('returns "just now" for seconds ago', () => {
    const date = new Date(Date.now() - 30_000)
    expect(formatDistanceToNow(date)).toBe('just now')
  })

  it('returns minutes ago', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000)
    expect(formatDistanceToNow(date)).toBe('5m ago')
  })

  it('returns hours ago', () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000)
    expect(formatDistanceToNow(date)).toBe('3h ago')
  })

  it('returns days ago', () => {
    const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    expect(formatDistanceToNow(date)).toBe('2d ago')
  })

  it('returns formatted date for older entries', () => {
    const date = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    const result = formatDistanceToNow(date)
    // Should look like "Apr 21" or similar locale-formatted date
    expect(result).toMatch(/[A-Za-z]+\s+\d+/)
  })
})
