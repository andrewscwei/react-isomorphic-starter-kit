import { Router } from 'express'
import { generateRobots, type SEOConfig } from '../seo'

type Params = {
  /**
   * Configuration for SEO (see {@link SEOConfig}).
   */
  seo?: SEOConfig
}

/**
 * Creates an Express router for serving the `robots.txt` of the application.
 *
 * @param params See {@link Params}.
 *
 * @returns The request handler.
 */
export function serveRobots({ seo }: Params = {}) {
  const router = Router()

  router.use('/robots.txt', async (req, res, next) => {
    const robots = generateRobots(seo)

    res.header('Content-Type', 'text/plain')
    res.send(robots)
  })

  return router
}
