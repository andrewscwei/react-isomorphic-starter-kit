import { type RequestHandler } from 'express'
import { Transform } from 'node:stream'
import { injectMetadata } from '../seo/index.js'
import { createDebug } from '../utils/createDebug.js'
import { createFetchRequest } from './createFetchRequest.js'
import { type Module } from './Module.js'

type Options = {
  timeout?: number
}

const debug = createDebug(undefined, 'server')

export function renderRoot({ render }: Module, template: string, {
  timeout = 10_000,
}: Options = {}): RequestHandler {
  return async (req, res, next) => {
    const fetchRequest = createFetchRequest(req)
    const { metadata, stream } = await render(fetchRequest)
    const html = injectMetadata(template, metadata)

    let error: unknown

    const { pipe, abort } = stream({
      onError(err) {
        error = err
      },
      onShellError() {
        debug(`Rendering ${req.originalUrl}...`, 'ERR', error)

        res.setHeader('content-type', 'application/json')
        res.status(500).send({ error })
      },
      onShellReady() {
        if (error) {
          res.setHeader('content-type', 'application/json')
          res.status(500).send({ error })

          return
        }

        const [htmlStart, htmlEnd] = html.split('<!-- APP_HTML -->')
        const transformStream = new Transform({
          transform: (chunk, encoding, callback) => {
            res.write(chunk, encoding)
            callback()
          },
        })

        transformStream.on('finish', () => {
          debug(`Rendering ${req.originalUrl}...`, 'OK')
          res.end(htmlEnd)
        })

        res.setHeader('content-type', 'text/html')
        res.status(200)
        res.write(htmlStart)
        pipe(transformStream)
      },
    })

    setTimeout(() => abort(), timeout)
  }
}
