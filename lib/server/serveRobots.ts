import { Router } from 'express'
import { generateRobots, type SEOConfig } from '../seo'

type Params = {
  seo?: SEOConfig
}

export function serveRobots({ seo }: Params = {}) {
  const router = Router()

  router.use('/robots.txt', async (req, res, next) => {
    const robots = generateRobots({ seo })

    res.header('Content-Type', 'text/plain')
    res.send(robots)
  })

  return router
}
