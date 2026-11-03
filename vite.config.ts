import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type ViteDevServer } from 'vite'
// Runtime helper shared with the Netlify function. No TS types are emitted for it.
// @ts-expect-error module is plain JavaScript
import { resolveArticlePreview } from './scripts/articlePreview.mjs'

type PreviewLookup = (rawUrl: string | null) => Promise<string | null>
const lookupPreview = resolveArticlePreview as PreviewLookup

function articlePreviewDevPlugin() {
  return {
    name: 'article-preview-dev',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? ''
        if (!url.startsWith('/api/article-preview')) {
          next()
          return
        }
        const target = new URL(url, 'http://127.0.0.1').searchParams.get('url')
        let image = null
        try {
          image = await lookupPreview(target)
        } catch {
          image = null
        }
        res.statusCode = 200
        res.setHeader('content-type', 'application/json; charset=utf-8')
        res.setHeader('cache-control', 'public, max-age=86400')
        res.end(JSON.stringify({ image }))
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), articlePreviewDevPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
