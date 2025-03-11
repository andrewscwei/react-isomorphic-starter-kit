import { Router } from 'express'
import { readFile } from 'node:fs/promises'
import type { LocalDataProvider, RenderFunction, SitemapOptions } from '../types/index.js'
import { renderRoot } from './renderRoot.js'
import { serveSitemap } from './serveSitemap.js'
import { serveStatic } from './serveStatic.js'

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
 * @see {@link https://reactjs.org/docs/react-dom-server.html}
 */
export async function ssrMiddleware({ entryPath, templatePath }: Params, {
  basePath,
  staticPath,
}: Options = {}) {
  const router = Router()
  if (staticPath) router.use(serveStatic(staticPath, { basePath }))

  const [template, { localData, middlewares = [], sitemap, render }] = await Promise.all([
    readFile(templatePath, 'utf-8'),
    import(entryPath),
  ])

  for (const middleware of middlewares) {
    router.use(...[].concat(middleware))
  }

  router.use(async (req, res, next) => {
    try {
      switch (req.url) {
        case '/sitemap.xml':
          return serveSitemap({
            sitemap: sitemap as SitemapOptions,
          })(req, res, next)
        default: {
          return renderRoot({
            localData: localData as LocalDataProvider,
            render: render as RenderFunction,
          }, template)(req, res, next)
        }
      }
    }
    catch (err) {
      console.error(`Rendering ${req.originalUrl}...`, 'ERR', err)

      if (err instanceof Error) {
        res.status(500).send(err.stack)
      }
      else {
        res.status(500).send(err)
      }
    }
  })

  return router
}
