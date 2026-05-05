/**
 * Fetches top stories from the Hacker News API.
 * Returns up to `limit` story objects.
 */
export async function fetchHackerNews(limit = 30) {
  const idsRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
  if (!idsRes.ok) throw new Error('Failed to fetch HN top stories')
  const ids = await idsRes.json()
  const topIds = ids.slice(0, limit)

  const stories = await Promise.all(
    topIds.map(async (id) => {
      const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      if (!res.ok) return null
      const item = await res.json()
      if (!item || item.type !== 'story' || !item.url) return null
      return {
        id: `hn-${item.id}`,
        source: 'hackernews',
        title: item.title,
        url: item.url,
        author: item.by,
        points: item.score,
        comments: item.descendants ?? 0,
        commentsUrl: `https://news.ycombinator.com/item?id=${item.id}`,
        publishedAt: new Date(item.time * 1000).toISOString(),
        tags: [],
        domain: extractDomain(item.url),
      }
    }),
  )

  return stories.filter(Boolean)
}

/**
 * Fetches recent articles from the Dev.to public API.
 */
export async function fetchDevTo(limit = 30) {
  const res = await fetch(
    `https://dev.to/api/articles?per_page=${limit}&top=7`,
  )
  if (!res.ok) throw new Error('Failed to fetch Dev.to articles')
  const articles = await res.json()

  return articles.map((article) => ({
    id: `devto-${article.id}`,
    source: 'devto',
    title: article.title,
    url: article.url,
    author: article.user?.name ?? article.user?.username,
    authorAvatar: article.user?.profile_image_90,
    points: article.public_reactions_count,
    comments: article.comments_count,
    commentsUrl: article.url,
    publishedAt: article.published_at,
    tags: article.tag_list ?? [],
    coverImage: article.cover_image,
    readingTime: article.reading_time_minutes,
    domain: 'dev.to',
  }))
}

/**
 * Fetches newest stories from Lobste.rs.
 */
export async function fetchLobsters(limit = 30) {
  const res = await fetch('https://lobste.rs/hottest.json')
  if (!res.ok) throw new Error('Failed to fetch Lobsters stories')
  const stories = await res.json()

  return stories.slice(0, limit).map((story) => ({
    id: `lobsters-${story.short_id}`,
    source: 'lobsters',
    title: story.title,
    url: story.url || `https://lobste.rs/s/${story.short_id}`,
    author: story.submitter_user?.username,
    points: story.score,
    comments: story.comment_count,
    commentsUrl: story.comments_url,
    publishedAt: story.created_at,
    tags: story.tags ?? [],
    domain: story.url ? extractDomain(story.url) : 'lobste.rs',
  }))
}

function extractDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}
