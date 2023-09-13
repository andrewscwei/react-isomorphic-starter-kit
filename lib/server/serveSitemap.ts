import { Router } from 'express'
import { type RouteObject } from 'react-router'
import { generateSitemap, type SEOConfig } from '../seo'

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
export function serveSitemap({ routes, seo }: Params) {
  const router = Router()

  router.use('/sitemap.xml', async (req, res, next) => {
    res.header('Content-Type', 'application/xml')

    try {
      const sitemap = await generateSitemap(routes, seo)

      res.send(sitemap)
    }
    catch (err) {
      next(err)
    }
  })

  return router
}
