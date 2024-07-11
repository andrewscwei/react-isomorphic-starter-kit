import express, { Router } from 'express'
import fs from 'fs'
import path from 'path'

const PUBLIC_PATH = process.env.PUBLIC_PATH ?? '/'

/**
 * Creates an Express router for serving local static files and adding expire
 * headers.
 *
 * @see {@link https://expressjs.com/en/starter/static-files.html}
 */
export function serveStatic() {
  const router = Router()
  const localPublicPath = path.join(__dirname, PUBLIC_PATH)

  if (fs.existsSync(localPublicPath)) {
    router.use(PUBLIC_PATH, express.static(localPublicPath, {
      setHeaders: res => {
        const duration = 1000 * 60 * 60 * 24 * 365 * 10
        res.setHeader('Expires', new Date(Date.now() + duration).toUTCString())
        res.setHeader('Cache-Control', `max-age=${duration / 1000}`)
      },
    }))
  }

  return router
}
