import { type RequestHandler } from 'express'

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
export function sitemapMiddleware({ sitemap: options }: Params): RequestHandler {
  return async (req, res) => {
    if (options) {
      const sitemap = await generateSitemap(options)

      res.setHeader('content-type', 'application/xml')
      res.send(sitemap)
    } else {
      res.sendStatus(404)
    }
  }
}
