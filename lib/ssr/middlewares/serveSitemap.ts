import { type RequestHandler } from 'express'
import type { SitemapProvider } from '../types/index.js'
import { createFetchRequest } from '../utils/index.js'

type Params = {
  sitemap?: SitemapProvider
}

/**
 * Request handler for serving the sitemap.
 *
 * @param params.sitemap Function for generating the contents of the sitemap.
 *
 * @returns The request handler.
 */
export function serveSitemap({ sitemap }: Params): RequestHandler {
  return async (req, res) => {
    if (sitemap) {
      const fetchRequest = createFetchRequest(req)
      const payload = await sitemap(fetchRequest)

      res.setHeader('content-type', 'application/xml')
      res.send(payload)
    }
    else {
      res.sendStatus(404)
    }
  }
}
