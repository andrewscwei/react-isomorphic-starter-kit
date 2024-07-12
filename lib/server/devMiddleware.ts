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
import { type MetadataFunction } from './MetadataFunction'
import { type RenderFunction } from './RenderFunction'

type Options = {
  basePath?: string
  entryPath: string
  publicURL?: string
  templatePath: string
}

const ABORT_DELAY_MS = 10_000

export async function devMiddleware({ basePath = '/', entryPath, publicURL, templatePath }: Options) {
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
      const [template, module] = await Promise.all([
        vite.transformIndexHtml(req.originalUrl.replace(basePath, ''), fs.readFileSync(templatePath, 'utf-8')),
        vite.ssrLoadModule(entryPath),
      ])

      let error: unknown

      const request = createFetchRequest(req)
      const { metadata: getMetadata, render } = module as { metadata: MetadataFunction; render: RenderFunction }
      const metadata = await getMetadata(request)

      const { pipe, abort } = await render(request, {
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

          const parts = template.split('<!-- APP_HTML -->')
          const end = parts[1]
          const start = parts[0]
            .replace(/<!-- BASE_TITLE -->/g, metadata.baseTitle ?? '')
            .replace(/<!-- DESCRIPTION -->/g, metadata.description ?? '')
            .replace(/<!-- LOCALE -->/g, metadata.locale ?? '')
            .replace(/<!-- MASK_ICON_COLOR -->/g, metadata.maskIconColor ?? '')
            .replace(/<!-- THEME_COLOR -->/g, metadata.themeColor ?? '')
            .replace(/<!-- TITLE -->/g, metadata.title ?? '')
            .replace(/<!-- URL -->/g, metadata.url ?? '')
            .replace(/<!-- PUBLIC_URL -->/g, publicURL ?? '/')

          res.write(start)

          transformStream.on('finish', () => {
            debug(`Rendering ${req.originalUrl}...`, 'OK')

            res.end(end)
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
