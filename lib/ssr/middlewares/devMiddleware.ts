import { Router } from 'express'
import { readFile } from 'node:fs/promises'
import { renderRoot } from './renderRoot.js'
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
}

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
}: Options = {}) {
  const { createServer } = await import('vite')
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base: basePath,
  })

  const router = Router()
  router.use(vite.middlewares)

  const { middlewares = [], ...module } = await vite.ssrLoadModule(entryPath)

  for (const middleware of middlewares) {
    router.use(...[].concat(middleware))
  }

  router.use(async (req, res, next) => {
    try {
      const template = await readFile(templatePath, 'utf-8')
      const html = await vite.transformIndexHtml(req.url, template)

      switch (req.url) {
        case '/sitemap.xml':
          return serveSitemap(module)(req, res, next)
        default: {
          return renderRoot(module as any, html)(req, res, next)
        }
      }
    }
    catch (err) {
      console.error(`Rendering ${req.originalUrl}...`, 'ERR', err)

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
