import { XMLBuilder } from 'fast-xml-parser'
import { type RouteObject } from 'react-router'
import { joinURL } from '../utils/joinURL'
import { extractURLs } from './helpers'
import { type SEOConfig } from './types'
import { type SitemapTags } from './types/SitemapTags'

const { baseURL, buildTime, debugEnabled } = __BUILD_ARGS__

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
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: debugEnabled,
  })
  const xml = builder.build({
    'urlset': {
      '@_xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
      '@_xmlns:news': 'http://www.google.com/schemas/sitemap-news/0.9',
      '@_xmlns:xhtml': 'http://www.w3.org/1999/xhtml',
      '@_xmlns:mobile': 'http://www.google.com/schemas/sitemap-mobile/1.0',
      '@_xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1',
      '@_xmlns:video': 'http://www.google.com/schemas/sitemap-video/1.1',
      'url': urls.map(t => {
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
