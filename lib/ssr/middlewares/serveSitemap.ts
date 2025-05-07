import type { RequestHandler } from 'express'
import type { SitemapOptions } from '../types/SitemapOptions.js'
import { generateSitemap } from '../utils/generateSitemap.js'

type Params = {
  sitemap?: SitemapOptions
}

/**
 * Request handler for serving the sitemap.
 *
 * @param params.sitemap Function for generating the contents of the sitemap.
 *
 * @returns The request handler.
 */
export function serveSitemap({ sitemap: options }: Params): RequestHandler {
  return async (req, res) => {
    if (options) {
      const sitemap = await generateSitemap(options)

      res.setHeader('content-type', 'application/xml')
      res.send(sitemap)
    }
    else {
      res.sendStatus(404)
    }
  }
}
