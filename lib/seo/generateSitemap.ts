import { XMLBuilder } from 'fast-xml-parser'
import type { RouteObject } from 'react-router'
import { joinURL } from '../utils'
import type { SEOConfig } from './types'

const { baseURL } = __BUILD_ARGS__

/**
 * Generates plain text `sitemap.xml` from the provided params.
 *
 * @param routes Array of {@link RouteObject} to generate the sitemap from.
 * @param config Configuration for SEO (see {@link SEOConfig}).
 *
 * @returns The plain text `sitemap.xml`.
 */
export function generateSitemap(routes: RouteObject[], { urlFilter = t => true }: SEOConfig = {}) {
  const urls = extractURLs(routes).filter(urlFilter)
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
