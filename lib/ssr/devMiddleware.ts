import { Router } from 'express'
import fs from 'node:fs'
import { createDebug } from '../utils/createDebug.js'
import { type Module } from './Module.js'
import { renderRoot } from './renderRoot.js'
import { serveRobots } from './serveRobots.js'
import { serveSitemap } from './serveSitemap.js'

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

  /**
   * Replacements to apply to the template.
   */
  templateReplacements?: { regex: RegExp; replaceValue: string }[]
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
export async function devMiddleware({ entryPath, templatePath }: Params, {
  basePath = '/',
  templateReplacements = [],
}: Options = {}) {
  const { createServer } = await import ('vite')
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base: basePath,
  })

  const router = Router()
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
          renderRoot(module as Module, template, { templateReplacements })(req, res, next)
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
