import { XMLBuilder } from 'fast-xml-parser'
import { type SitemapOptions, type SitemapTags } from '../types/index.js'
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
  hostname,
  routes,
  updatedAt,
  filter = t => !t.endsWith('*'),
  transform = async t => t,
}: SitemapOptions) {
  const baseURL = hostname.replace(/\/+$/, '')
  const paths = extractPaths(routes).filter(filter)
  const urls = await transform(paths)

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
  })

  const xml = builder.build({
    urlset: {
      '@_xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
      '@_xmlns:news': 'http://www.google.com/schemas/sitemap-news/0.9',
      '@_xmlns:xhtml': 'http://www.w3.org/1999/xhtml',
      '@_xmlns:mobile': 'http://www.google.com/schemas/sitemap-mobile/1.0',
      '@_xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1',
      '@_xmlns:video': 'http://www.google.com/schemas/sitemap-video/1.1',
      'url': urls.map(t => {
        const defaultTags: Partial<SitemapTags> = {
          lastmod: updatedAt,
          changefreq: 'daily',
          priority: '0.7',
        }

        if (typeof t === 'string') {
          return {
            ...defaultTags,
            loc: joinPaths(baseURL, t),
          }
        }
        else {
          const { loc, ...tags } = t

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
