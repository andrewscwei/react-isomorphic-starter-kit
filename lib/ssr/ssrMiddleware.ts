import { debug } from '@lib/utils/debug.js'
import compression from 'compression'
import { Router } from 'express'
import fs from 'node:fs/promises'
import { type Module } from './Module.js'
import { renderRoot } from './renderRoot.js'
import { serveRobots } from './serveRobots.js'
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

  /**
   * Replacements to apply to the template.
   */
  templateReplacements?: { regex: RegExp; replaceValue: string }[]
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
export function ssrMiddleware({ entryPath, templatePath }: Params, {
  basePath,
  staticPath,
  templateReplacements = [],
}: Options) {
  const router = Router()
  router.use(compression())
  if (staticPath) router.use(serveStatic(staticPath, { basePath }))

  router.use(async (req, res, next) => {
    try {
      const [template, module] = await Promise.all([
        fs.readFile(templatePath, 'utf-8'),
        import(entryPath),
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
        res.status(500).send(err.stack)
      }
      else {
        res.status(500).send(err)
      }
    }
  })

  return router
}
