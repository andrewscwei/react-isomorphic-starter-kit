import { Router } from 'express'
import appConf from '../../app.conf'
import joinURL from '../utils/joinURL'

type Params = {
  routes: RouteConfig[]
}

/**
 * `robots.txt` generator.
 */
export default function robots({ routes }: Params) {
  const router = Router()

  router.use(joinURL(appConf.basePath, '/robots.txt'), async (req, res, next) => {
    res.header('Content-Type', 'text/plain')
    res.send('User-agent: * Disallow:')
  })

  return router
}
