import express, { Router } from 'express'
import fs from 'fs'
import path from 'path'

/**
 * Serve local static files and add expire headers.
 *
 * @see {@link https://expressjs.com/en/starter/static-files.html}
 */
export default function serveLocalStatic() {
  const router = Router()
  const { publicPath } = __BUILD_ARGS__
  const localPublicPath = path.join(__dirname, publicPath)

  if (fs.existsSync(localPublicPath)) {
    router.use(publicPath, express.static(localPublicPath, {
      setHeaders: res => {
        const duration = 1000 * 60 * 60 * 24 * 365 * 10
        res.setHeader('Expires', new Date(Date.now() + duration).toUTCString())
        res.setHeader('Cache-Control', `max-age=${duration / 1000}`)
      },
    }))
  }

  return router
}
