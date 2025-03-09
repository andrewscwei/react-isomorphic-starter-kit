import { type RequestHandler } from 'express'
import { Transform } from 'node:stream'
import { injectData } from '../dom/index.js'
import { createFetchRequest } from './createFetchRequest.js'
import { type Module } from './Module.js'

type Options = {
  timeout?: number
}

export function renderRoot({ localData, render }: Module, template: string, {
  timeout = 10_000,
}: Options = {}): RequestHandler {
  return async (req, res, next) => {
    try {
      const metadata = {}
      const fetchRequest = createFetchRequest(req)
      const locals = localData ? await localData(fetchRequest) : {}

      let streamEnd = ''

      const { pipe, abort } = await render(fetchRequest, metadata, {
        onError(err) {
          console.error(`Rendering ${req.originalUrl}...`, 'ERR', err)
        },
        onShellError() {
          res.sendStatus(500)
        },
        onShellReady() {
          const html = injectData(template, {
            ...metadata,
            localData: `<script>window.__localData=${JSON.stringify(locals)}</script>`,
          })
          const [htmlStart, htmlEnd] = html.split(/<!--\s*root\s*-->/)

          streamEnd = htmlEnd

          res.setHeader('content-type', 'text/html')
          res.status(200)
          res.write(htmlStart)
        },
      })

      const transformStream = new Transform({
        transform: (chunk, encoding, callback) => {
          res.write(chunk, encoding)
          callback()
        },
      })

      transformStream.on('finish', () => {
        res.end(streamEnd)
      })

      pipe(transformStream)

      setTimeout(() => abort(), timeout)
    }
    catch (err) {
      if (err instanceof Response) {
        res.redirect(err.status, err.headers.get('Location') ?? '')
      }
      else {
        next(err)
      }
    }
  }
}
