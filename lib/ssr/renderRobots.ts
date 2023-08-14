import { Router } from 'express'
import { joinURL } from '../utils'

const { basePath } = __BUILD_ARGS__

/**
 * `robots.txt` generator.
 */
export default function renderRobots() {
  const router = Router()

  router.use(joinURL(basePath, '/robots.txt'), async (req, res, next) => {
    res.header('Content-Type', 'text/plain')
    res.send('User-agent: * Disallow:')
  })

  return router
}
