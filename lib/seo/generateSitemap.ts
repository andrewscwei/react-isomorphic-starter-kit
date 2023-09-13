import { XMLBuilder } from 'fast-xml-parser'
import { type RouteObject } from 'react-router'
import { joinURL } from '../utils'
import { extractURLs } from './helpers'
import { type SEOConfig } from './types'
import { type SitemapTags } from './types/SitemapTags'

const { baseURL, buildTime } = __BUILD_ARGS__

/**
 * Generates plain text `sitemap.xml` from the provided params.
 *
 * @param routes Array of {@link RouteObject} to generate the sitemap from.
 * @param config Configuration for SEO (see {@link SEOConfig}).
 *
 * @returns The plain text `sitemap.xml`.
 */
export async function generateSitemap(routes: RouteObject[], {
  urlsProvider,
  urlFilter = t => true,
}: SEOConfig = {}) {
  const urls = urlsProvider ? await urlsProvider(routes) : extractURLs(routes).filter(urlFilter)
  const builder = new XMLBuilder()
  const xml = builder.build({
    'urlset': {
      url: urls.map(t => {
        const defaultTags: Partial<SitemapTags> = {
          lastmod: buildTime,
          changefreq: 'daily',
          priority: '0.7',
        }

        if (typeof t === 'string') {
          return {
            ...defaultTags,
            'loc': joinURL(baseURL, t),
          }
        }
        else {
          const { loc, ...tags } = t

          return {
            ...defaultTags,
            loc: joinURL(baseURL, loc),
            ...tags,
          }
        }
      }),
    },
  })

  return xml
}
