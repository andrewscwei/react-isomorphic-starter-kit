import { type RequestHandler } from 'express'
import { type RouteObject } from 'react-router'
import { type SEOConfig } from '../seo'
import { type SitemapBuilder } from './SitemapBuilder'

type Params = {
  /**
   * Configuration for routes (see {@link RouteObject}).
   */
  routes: RouteObject[]

  /**
   * Configuration for SEO (see {@link SEOConfig}).
   */
  seo?: SEOConfig
}

/**
 * Creates an Express router serving the sitemap of the application.
 *
 * @param params See {@link Params}.
 *
 * @returns The request handler.
 */
export function renderSitemap(build: SitemapBuilder): RequestHandler {
  return async (req, res, next) => {
    if (build) {
      res.setHeader('content-type', 'application/xml')
      res.send(await build())
    }
    else {
      res.sendStatus(404)
    }
  }
}
