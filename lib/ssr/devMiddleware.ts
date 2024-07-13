import { Router } from 'express'
import fs from 'node:fs'
import { createServer } from 'vite'
import { createDebug } from '../utils/createDebug'
import { type Module } from './Module'
import { renderRoot } from './renderRoot'
import { serveRobots } from './serveRobots'
import { serveSitemap } from './serveSitemap'

type Params = {
  /**
   * Path to the entry module.
   */
  entryPath: string

  /**
   * Path to the HTML template.
   */
  templatePath: string
}

type Options = {
  /**
   * Base path for the server.
   */
  basePath?: string
}

const debug = createDebug(undefined, 'server')

/**
 * Middleware for server-side rendering of React views during development.
 *
 * @param params See {@link Params}.
 * @param options See {@link Options}.
 *
 * @returns The middleware.
 *
 * @see {@link https://reactjs.org/docs/react-dom-server.html}
 */
export async function devMiddleware({ entryPath, templatePath }: Params, { basePath = '/' }: Options = {}) {
  const router = Router()
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base: basePath,
  })

  router.use(vite.middlewares)

  router.use(async (req, res, next) => {
    try {
      const [template, module] = await Promise.all([
        vite.transformIndexHtml(req.originalUrl.replace(basePath, ''), fs.readFileSync(templatePath, 'utf-8')),
        vite.ssrLoadModule(entryPath),
      ])

      switch (req.url) {
        case '/robots.txt':
          serveRobots(module as Module)(req, res, next)
          return
        case '/sitemap.xml':
          serveSitemap(module as Module)(req, res, next)
          return
        default: {
          renderRoot(module as Module, template)(req, res, next)
        }
      }
    }
    catch (err) {
      debug(`Rendering ${req.originalUrl}...`, 'ERR', err)

      if (err instanceof Error) {
        vite.ssrFixStacktrace(err)
        res.status(500).send(err.stack)
      }
      else {
        res.status(500).send(err)
      }
    }
  })

  return router
}
