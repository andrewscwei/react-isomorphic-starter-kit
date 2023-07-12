import express, { Router } from 'express'
import fs from 'fs'
import path from 'path'

type Params = {
  /**
   * The root directory to begin searching for static files.
   */
  rootDir: string
}

/**
 * Serve static files and add expire headers.
 *
 * @param params - See {@link Params}.
 *
 * @see {@link https://expressjs.com/en/starter/static-files.html}
 */
export default function staticFiles({ rootDir }: Params) {
  const { publicPath } = __BUILD_ARGS__
  const router = Router()
  const localPublicPath = path.join(rootDir, publicPath)

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
