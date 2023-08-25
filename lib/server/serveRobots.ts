import { Router } from 'express'
import { SEOConfig } from './types'

type Params = {
  seo?: SEOConfig
}

/**
 * `robots.txt` generator.
 */
export default function serveRobots({ seo }: Params = {}) {
  const router = Router()

  router.use('/robots.txt', async (req, res, next) => {
    res.header('Content-Type', 'text/plain')
    res.send(seo?.robots ?? '')
  })

  return router
}
