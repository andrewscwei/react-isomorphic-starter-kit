import { type SitemapOptions } from '../types/SitemapOptions.js'
import { generateSitemap } from '../utils/generateSitemap.js'

type Params = {
  /**
   * Options for generating the sitemap.
   */
  sitemap?: SitemapOptions
}

/**
 * Middleware for serving the sitemap.
 *
 * @param params See {@link Params}.
 *
 * @returns The middleware.
 */
export function sitemapMiddleware({ sitemap: options }: Params) {
  return async (req: Request) => {
    if (options) {
      const sitemap = await generateSitemap(options)

      return new Response(sitemap, {
        headers: { 'Content-Type': 'application/xml' },
      })
    } else {
      return new Response(undefined, {
        status: 404,
      })
    }
  }
}
