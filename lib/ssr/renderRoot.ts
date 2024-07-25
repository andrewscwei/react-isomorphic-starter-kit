import debug from 'debug'
import { type RequestHandler } from 'express'
import { Transform } from 'node:stream'
import { injectMetadata } from '../dom/index.js'
import { createFetchRequest } from './createFetchRequest.js'
import { type Module } from './Module.js'

type Options = {
  templateReplacements?: { regex: RegExp; replaceValue: string }[]
  timeout?: number
}

const log = debug('server')

export function renderRoot({ render }: Module, template: string, {
  timeout = 10_000,
  templateReplacements = [],
}: Options = {}): RequestHandler {
  return async (req, res, next) => {
    try {
      const metadata = {}
      const fetchRequest = createFetchRequest(req)
      let error: unknown

      const { pipe, abort } = await render(fetchRequest, metadata, {
        onError(err) {
          error = err
        },
        onShellError() {
          log(`Rendering ${req.originalUrl}...`, 'ERR', error)

          res.setHeader('content-type', 'application/json')
          res.status(500).send({ error })
        },
        onShellReady() {
          if (error) {
            res.setHeader('content-type', 'application/json')
            res.status(500).send({ error })

            return
          }

          const html = injectMetadata(template, metadata, templateReplacements)
          const [htmlStart, htmlEnd] = html.split('<!-- APP_HTML -->')
          const transformStream = new Transform({
            transform: (chunk, encoding, callback) => {
              res.write(chunk, encoding)
              callback()
            },
          })

          transformStream.on('finish', () => {
            log(`Rendering ${req.originalUrl}...`, 'OK')
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
