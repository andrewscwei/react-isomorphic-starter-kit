import { Router } from 'express'

const router = Router()

router.get('/version', (req, res, next) => {
  switch (req.accepts(['html', 'json'])) {
  case 'html':
    next()
    return
  case 'json':
    res.status(200).send({ version: __BUILD_CONFIG__.version, build: __BUILD_CONFIG__.buildNumber })
    return
  default:
    next(new Error('Bad request'))
  }
})

router.get('/health', (req, res) => {
  res.sendStatus(200)
})

export default router
