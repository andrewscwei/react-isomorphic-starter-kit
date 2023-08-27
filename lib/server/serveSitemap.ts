import { Router } from 'express'
import type { RouteObject } from 'react-router'
import { generateSitemap, type SEOConfig } from '../seo'

type Params = {
  routes: RouteObject[]
  seo?: SEOConfig
}

export function serveSitemap({ routes, seo }: Params) {
  const router = Router()

  router.use('/sitemap.xml', async (req, res, next) => {
    res.header('Content-Type', 'application/xml')

    try {
      const sitemap = generateSitemap({ routes, seo })

      res.send(sitemap)
    }
    catch (err) {
      next(err)
    }
  })

  return router
}
