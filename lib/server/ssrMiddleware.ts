/**
 * @file Express middleware for server-side rendering of React views during
 *       production.
 *
 * @see {@link https://reactjs.org/docs/react-dom-server.html}
 */

import compression from 'compression'
import { Router } from 'express'
import { minify } from 'html-minifier-terser'
import fs from 'node:fs/promises'
import { createDebug } from '../utils/createDebug'
import { renderRobots } from './renderRobots'
import { renderRoot } from './renderRoot'
import { renderSitemap } from './renderSitemap'
import { serveStatic } from './serveStatic'

type Options = {
  entryPath: string
  publicPath?: string
  publicURL?: string
  staticPath?: string
  templatePath: string
}

export function ssrMiddleware({ entryPath, templatePath, publicPath, publicURL, staticPath }: Options) {
  const debug = createDebug(undefined, 'server')
  const router = Router()

  router.use(compression())

  if (staticPath) {
    router.use(serveStatic(staticPath, { publicPath }))
  }

  router.use(async (req, res, next) => {
    try {
      const [template, module] = await Promise.all([
        fs.readFile(templatePath, 'utf-8').then(t => minify(t, {
          collapseWhitespace: true,
          removeComments: false,
        })),
        import(entryPath),
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
        res.status(500).send(err.stack)
      }
      else {
        res.status(500).send(err)
      }
    }
  })

  return router
}
