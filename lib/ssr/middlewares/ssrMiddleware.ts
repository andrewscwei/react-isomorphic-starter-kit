import { Router } from 'express'
import { readFile } from 'node:fs/promises'

import { renderMiddleware } from './renderMiddleware.js'
import { sitemapMiddleware } from './sitemapMiddleware.js'
import { staticMiddleware } from './staticMiddleware.js'

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
   * Base path for static assets.
   */
  basePath?: string

  /**
   * Path for static assets in the file system.
   */
  staticPath?: string
}

/**
 * Middleware for server-side rendering of React views during production.
 *
 * @param entryPath Path to the entry module.
 * @param templatePath Path to the HTML template.
 * @param options See {@link Options}.
 *
 * @returns The middleware.
 *
 * @see {@link https://reactjs.org/docs/react-dom-server.html}
 */
export async function ssrMiddleware({ entryPath, templatePath }: Params, {
  basePath = '/',
  staticPath,
}: Options = {}) {
  const router = Router()

  if (staticPath) {
    router.use(staticMiddleware(staticPath))
  }

  const [template, { middlewares = [], ...module }] = await Promise.all([
    readFile(templatePath, 'utf-8'),
    import(entryPath),
  ])

  for (const middleware of middlewares) {
    router.use(...[].concat(middleware))
  }

  router.use(basePath, async (req, res, next) => {
    try {
      switch (req.url) {
        case '/sitemap.xml':
          return sitemapMiddleware(module)(req, res, next)
        default: {
          return renderMiddleware(module, template)(req, res, next)
        }
      }
    } catch (err) {
      console.error(`Rendering ${req.originalUrl}...`, 'ERR', err)

      if (err instanceof Error) {
        res.status(500).send(err.stack)
      } else {
        res.status(500).send(err)
      }
    }
  })

  return router
}
