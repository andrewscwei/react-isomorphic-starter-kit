import { type RequestHandler } from 'express'
import { type Module } from './Module'

/**
 * Request handler for serving the sitemap.
 *
 * @param module See {@link Module}.
 *
 * @returns The request handler.
 */
export function serveSitemap({ sitemap }: Module): RequestHandler {
  return async (req, res) => {
    if (sitemap) {
      res.setHeader('content-type', 'application/xml')
      res.send(await sitemap())
    }
    else {
      res.sendStatus(404)
    }
  }
}
