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
import { createFetchRequest } from './createFetchRequest'
import { type RenderFunction } from './RenderFunction'
import { renderRoot } from './renderRoot'
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

  router.use(async (req, res) => {
    try {
      const [template, module] = await Promise.all([
        fs.readFile(templatePath, 'utf-8').then(t => minify(t, {
          collapseWhitespace: true,
          removeComments: false,
        })),
        import(entryPath),
      ])

      const fetchRequest = createFetchRequest(req)
      const render = module.render as RenderFunction
      const { metadata, stream } = await render(fetchRequest)

      renderRoot(req, {
        metadata,
        template,
        stream,
        onStart: htmlStart => {
          res.status(200)
          res.write(htmlStart)
        },
        onProgress: (htmlChunk, encoding) => {
          res.write(htmlChunk, encoding)
        },
        onEnd: htmlEnd => {
          debug(`Rendering ${req.originalUrl}...`, 'OK')
          res.end(htmlEnd)
        },
        onError: err => {
          debug(`Rendering ${req.originalUrl}...`, 'ERR', err)

          res.status(500)
          res.setHeader('content-type', 'text/html')
          res.send({ error: err })
        },
      })
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
