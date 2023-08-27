import { Router } from 'express'
import { SEOConfig, generateRobots } from '../seo'

type Params = {
  seo?: SEOConfig
}

export default function serveRobots({ seo }: Params = {}) {
  const router = Router()

  router.use('/robots.txt', async (req, res, next) => {
    const robots = generateRobots({ seo })

    res.header('Content-Type', 'text/plain')
    res.send(robots)
  })

  return router
}
