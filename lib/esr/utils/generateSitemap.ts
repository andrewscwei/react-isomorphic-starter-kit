import { XMLBuilder } from 'fast-xml-parser'

import { type SitemapOptions } from '../types/SitemapOptions.js'
import { type SitemapTags } from '../types/SitemapTags.js'
import { extractPaths } from './extractPaths.js'
import { joinPaths } from './joinPaths.js'

/**
 * Generates plain text `sitemap.xml` from the provided params.
 *
 * @param routes Routes to generate the sitemap from.
 * @param options See {@link SitemapOptions}).
 *
 * @returns The plain text `sitemap.xml`.
 */
export async function generateSitemap({
  filter = v => !v.endsWith('*'),
  hostname,
  routes,
  transform = async v => v,
  updatedAt,
}: SitemapOptions) {
  const baseURL = hostname.replace(/\/+$/, '')
  const paths = extractPaths(routes).filter(filter)
  const urls = await transform(paths)

  const builder = new XMLBuilder({
    format: true,
    ignoreAttributes: false,
  })

  const xml = builder.build({
    urlset: {
      '@_xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
      '@_xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1',
      '@_xmlns:mobile': 'http://www.google.com/schemas/sitemap-mobile/1.0',
      '@_xmlns:news': 'http://www.google.com/schemas/sitemap-news/0.9',
      '@_xmlns:video': 'http://www.google.com/schemas/sitemap-video/1.1',
      '@_xmlns:xhtml': 'http://www.w3.org/1999/xhtml',
      'url': urls.map(v => {
        const defaultTags: Partial<SitemapTags> = {
          changefreq: 'daily',
          lastmod: updatedAt,
          priority: '0.7',
        }

        if (typeof v === 'string') {
          return {
            ...defaultTags,
            loc: joinPaths(baseURL, v),
          }
        } else {
          const { loc, ...tags } = v

          return {
            ...defaultTags,
            loc: joinPaths(baseURL, loc),
            ...tags,
          }
        }
      }),
    },
  })

  return xml
}
