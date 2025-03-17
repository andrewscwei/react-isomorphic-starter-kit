import express, { Router } from 'express'
import { existsSync } from 'node:fs'

/**
 * Creates a router for serving local static files and adding expire headers.
 *
 * @param path Path to the static files.
 *
 * @see {@link https://expressjs.com/en/starter/static-files.html}
 */
export function serveStatic(path: string) {
  const router = Router()

  if (existsSync(path)) {
    router.use(express.static(path, {
      index: false,
      setHeaders: res => {
        const duration = 1000 * 60 * 60 * 24 * 365 * 10
        res.setHeader('Expires', new Date(Date.now() + duration).toUTCString())
        res.setHeader('Cache-Control', `max-age=${duration / 1000}`)
      },
    }))
  }

  return router
}
