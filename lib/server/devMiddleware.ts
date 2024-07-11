/**
 * @file Express middleware for server-side rendering of React views.
 *
 * @see {@link https://reactjs.org/docs/react-dom-server.html}
 */

import { Router } from 'express'
import { readFile } from 'fs/promises'
import { type RouteObject } from 'react-router'
import { createStaticHandler } from 'react-router-dom/server'
import { Transform } from 'stream'
import { createServer } from 'vite'
import { createFetchRequest } from './helpers'
import { type RenderFunc } from './types'

const BASE_URL = process.env.BASE_URL ?? ''
const BASE_PATH = process.env.BASE_PATH ?? '/'

type Options = {
  entryPath: string
  routes: RouteObject[]
  templatePath: string
}

export async function devMiddleware({ entryPath, routes, templatePath }: Options) {
  const router = Router()
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base: BASE_PATH,
  })

  router.use(vite.middlewares)

  router.use('*', async (req, res) => {
    const handler = createStaticHandler(routes, { basename: BASE_PATH })
    const context = await handler.query(createFetchRequest(req))

    if (context instanceof Response) return res.redirect(context.status, context.headers.get('Location') ?? '')

    try {
      const url = req.originalUrl.replace(BASE_PATH, '')
      // const customMetadata = await createMetadata(context, { baseURL: BASE_URL, i18n, routes })
      const raw = await readFile(templatePath, 'utf-8')
      const template = await vite.transformIndexHtml(url, raw)
      const { render } = await vite.ssrLoadModule(entryPath) as { render: RenderFunc }
      // const { manifest, template, render: renderToPipeableStream } = render({ context, request: req, routes: handler.dataRoutes })

      let error: unknown

      const { pipe, abort } = render({ context, routes: handler.dataRoutes }, {
        onError(err) {
          error = err
        },
        onShellError() {
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
            res.end(htmlEnd)
          })

          pipe(transformStream)
        },
      })
    }
    catch (err) {
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
