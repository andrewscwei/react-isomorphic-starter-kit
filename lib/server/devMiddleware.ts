import { Router } from 'express'
import fs from 'node:fs'
import { createServer } from 'vite'
import { createDebug } from '../utils/createDebug'
import { type RenderFunction } from './RenderFunction'
import { createFetchRequest } from './createFetchRequest'
import { renderRoot } from './renderRoot'

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
    res.setHeader('content-type', 'text/html')

    try {
      const [template, module] = await Promise.all([
        vite.transformIndexHtml(req.originalUrl.replace(basePath, ''), fs.readFileSync(templatePath, 'utf-8')),
        vite.ssrLoadModule(entryPath),
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
