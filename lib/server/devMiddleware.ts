import { Router } from 'express'
import fs from 'node:fs'
import { createServer } from 'vite'
import { createDebug } from '../utils/createDebug'
import { renderRobots } from './renderRobots'
import { renderRoot } from './renderRoot'
import { renderSitemap } from './renderSitemap'

type Options = {
  basePath?: string
  entryPath: string
  publicURL?: string
  templatePath: string
}

/**
 * Express middleware for server-side rendering of React views during
 * development.
 *
 * @param options See {@link Options}.
 *
 * @returns The middleware.
 *
 * @see {@link https://reactjs.org/docs/react-dom-server.html}
 */
export async function devMiddleware({ basePath = '/', entryPath, publicURL, templatePath }: Options) {
  const debug = createDebug(undefined, 'server')
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

      const { render, robots, sitemap } = module

      switch (req.url) {
        case '/robots.txt':
          renderRobots(robots)(req, res, next)
          return
        case '/sitemap.xml':
          renderSitemap(sitemap)(req, res, next)
          return
        default: {
          renderRoot({
            render,
            template,
          })(req, res, next)
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
