import { XMLBuilder } from 'fast-xml-parser'
import type { RouteObject } from 'react-router'
import { joinURL } from '../utils'
import type { SEOConfig } from './types'

type Params = {
  routes: RouteObject[]
  seo?: SEOConfig
}

const { baseURL } = __BUILD_ARGS__

/**
 * Sitemap generator.
 */
export function generateSitemap({ routes, seo }: Params) {
  const urls = extractURLs(routes).filter(seo?.urlFilter ?? (t => true))
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

  return xml
}

function extractURLs(routes?: RouteObject[]): string[] {
  if (!routes) return []

  return routes.reduce<string[]>((out, { path, children }) => {
    if (!path) return [...out, ...extractURLs(children)]

    return [...out, path]
  }, [])
}
