import { Router } from 'express'
import appConf from '../app.conf'
import { render } from '../middleware/render'

const router = Router()

router.get('/version', (req, res, next) => {
  switch (req.accepts(['html', 'json'])) {
    case 'html':
      next()

      return
    case 'json':
      res.status(200).send({ version: appConf.version })

      return
    default:
      next(new Error('Bad request'))
  }
})

router.get('/health', (req, res) => {
  res.sendStatus(200)
})

router.use(render())

export default router
