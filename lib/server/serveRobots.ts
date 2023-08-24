import { Router } from 'express'

/**
 * `robots.txt` generator.
 */
export default function serveRobots() {
  const router = Router()

  router.use('/robots.txt', async (req, res, next) => {
    res.header('Content-Type', 'text/plain')
    res.send('User-agent: * Disallow:')
  })

  return router
}
