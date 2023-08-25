import { Router } from 'express'
import { XMLBuilder } from 'fast-xml-parser'
import { RouteObject } from 'react-router'
import { joinURL } from '../utils'
import { SitemapConfig } from './types'

type Params = SitemapConfig & {
  routes: RouteObject[]
}

const { baseURL } = __BUILD_ARGS__

/**
 * Sitemap generator.
 */
export default function serveSitemap({ routes, filter = t => true }: Params) {
  const router = Router()

  router.use('/sitemap.xml', async (req, res, next) => {
    res.header('Content-Type', 'application/xml')

    try {
      const urls = extractURLs(routes).filter(filter)
      const builder = new XMLBuilder()
      const xml = builder.build({
        'urlset': {
          url: urls.map(t => ({
            'loc': joinURL(baseURL, t),
            'lastmod': new Date().toISOString(),
            'changefreq': 'daily',
            'priority': '0.7',
          })),
        },
      })

      res.send(xml)
    }
    catch (err) {
      next(err)
    }
  })

  return router
}

function extractURLs(routes?: RouteObject[]): string[] {
  if (!routes) return []

  return routes.reduce<string[]>((out, { path, children }) => {
    if (!path) return [...out, ...extractURLs(children)]

    return [...out, path]
  }, [])
}
