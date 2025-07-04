import { type RequestHandler } from 'express'
import { Transform } from 'node:stream'
import { type LocalDataProvider } from '../types/LocalDataProvider.js'
import { type RenderFunction } from '../types/RenderFunction.js'
import { createFetchRequest } from '../utils/createFetchRequest.js'
import { injectHTMLData } from '../utils/injectHTMLData.js'

type Params = {
  localData?: LocalDataProvider
  render: RenderFunction
}

type Options = {
  timeout?: number
}

export function renderRoot({ localData, render }: Params, template: string, {
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
          const html = injectHTMLData(template, {
            ...metadata,
            dev: process.env.NODE_ENV === 'development',
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
