import { resolveArticlePreview } from '../../scripts/articlePreview.mjs'

export default async (request) => {
  const target = new URL(request.url).searchParams.get('url')
  let image = null
  try {
    image = await resolveArticlePreview(target)
  } catch {
    image = null
  }
  return new Response(JSON.stringify({ image }), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=86400',
      'netlify-cdn-cache-control': 'public, s-maxage=604800, durable',
    },
  })
}
