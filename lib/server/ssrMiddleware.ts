/**
 * @file Express middleware for server-side rendering of React views during
 *       production.
 *
 * @see {@link https://reactjs.org/docs/react-dom-server.html}
 */

import compression from 'compression'
import { Router } from 'express'
import fs from 'node:fs'
import { Transform } from 'node:stream'
import { createDebug } from '../utils/createDebug'
import { createFetchRequest } from './createFetchRequest'
import { type RenderFunction } from './RenderFunction'
import { serveStatic } from './serveStatic'

type Options = {
  entryPath: string
  publicPath?: string
  staticPath?: string
  templatePath: string
}

const ABORT_DELAY_MS = 10_000

export function ssrMiddleware({ entryPath, templatePath, publicPath, staticPath }: Options) {
  const debug = createDebug(undefined, 'server')
  const router = Router()

  router.use(compression())

  if (staticPath) {
    router.use(serveStatic(staticPath, { publicPath }))
  }

  router.use(async (req, res) => {
    try {
      const template = fs.readFileSync(templatePath, 'utf-8')
      const { render } = await import(entryPath) as { render: RenderFunction }

      let error: unknown

      const { pipe, abort } = await render(createFetchRequest(req), {
        onError(err) {
          error = err
        },
        onShellError() {
          debug(`Rendering ${req.originalUrl}...`, 'ERR', 'Shell error')

          res.setHeader('content-type', 'text/html')
          res.sendStatus(500)
        },
        onShellReady() {
          res.status(error ? 500 : 200)
          res.setHeader('content-type', 'text/html')

          const transformStream = new Transform({
            transform(chunk, encoding, callback) {
              res.write(chunk, encoding)
              callback()
            },
          })

          const [htmlStart, htmlEnd] = template.split('<div id="root">')

          res.write(`${htmlStart}<div id="root">`)

          transformStream.on('finish', () => {
            debug(`Rendering ${req.originalUrl}...`, 'OK')

            res.end(htmlEnd)
          })

          pipe(transformStream)
        },
      })

      setTimeout(() => abort(), ABORT_DELAY_MS)
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
