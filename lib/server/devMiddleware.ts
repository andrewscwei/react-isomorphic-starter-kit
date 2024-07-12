/**
 * @file Express middleware for server-side rendering of React views during
 *       development.
 *
 * @see {@link https://reactjs.org/docs/react-dom-server.html}
 */

import { Router } from 'express'
import fs from 'node:fs'
import { Transform } from 'node:stream'
import { createServer } from 'vite'
import { createDebug } from '../utils/createDebug'
import { createFetchRequest } from './createFetchRequest'
import { type RenderFunction } from './RenderFunction'

type Options = {
  basePath?: string
  entryPath: string
  templatePath: string
}

const ABORT_DELAY_MS = 10_000

export async function devMiddleware({ basePath = '/', entryPath, templatePath }: Options) {
  const debug = createDebug(undefined, 'server')
  const router = Router()
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base: basePath,
  })

  router.use(vite.middlewares)

  router.use('*', async (req, res) => {
    try {
      const templateStr = fs.readFileSync(templatePath, 'utf-8')
      const template = await vite.transformIndexHtml(req.originalUrl.replace(basePath, ''), templateStr)
      const { render } = await vite.ssrLoadModule(entryPath) as { render: RenderFunction }

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
            transform: (chunk, encoding, callback) => {
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
