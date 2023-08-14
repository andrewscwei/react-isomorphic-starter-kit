import { Router } from 'express'
import { BASE_PATH } from '../../src/app.conf'
import { joinURL } from '../utils'

/**
 * `robots.txt` generator.
 */
export default function renderRobots() {
  const router = Router()

  router.use(joinURL(BASE_PATH, '/robots.txt'), async (req, res, next) => {
    res.header('Content-Type', 'text/plain')
    res.send('User-agent: * Disallow:')
  })

  return router
}
