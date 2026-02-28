import { type RequestHandler } from 'express'
import { Transform } from 'node:stream'

import { RenderContext } from '../types/RenderContext.js'
import { type RenderFunction } from '../types/RenderFunction.js'
import { createFetchRequest } from '../utils/createFetchRequest.js'
import { renderTemplate } from '../utils/renderTemplate.js'

type Params = {
  /**
   * Function to render the HTML for the request.
   */
  render: RenderFunction
}

type Options = {
  /**
   * Timeout for the rendering process in milliseconds. Defaults to 10,000 ms
   * (10 seconds).
   */
  timeout?: number
}

/**
 * Middleware for rendering HTML.
 *
 * @param params See {@link Params}.
 * @param template The HTML template to render.
 * @param options See {@link Options}.
 *
 * @returns The middleware.
 */
export function renderMiddleware({ render }: Params, template: string, {
  timeout = 10_000,
}: Options = {}): RequestHandler {
  return async (req, res, next) => {
    try {
      const context = RenderContext.factory()
      const fetchRequest = createFetchRequest(req)

      let streamEnd = ''

      const { abort, pipe } = await render(fetchRequest, context, {
        onError(err) {
          console.error(`Rendering ${req.originalUrl}...`, 'ERR', err)
        },
        onShellError() {
          res.sendStatus(500)
        },
        onShellReady() {
          const htmlData = {
            ...context.metadata,
            dev: process.env.NODE_ENV === 'development',
            localData: `<script>window.__localData=${JSON.stringify(context.localData).replace(/</g, '\\u003c')}</script>`,
          }

          const chunks = template.split(/<!--\s*root\s*-->/is)
          const htmlStart = renderTemplate(chunks[0], htmlData)
          const htmlEnd = renderTemplate(chunks[1], htmlData)

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
    } catch (err) {
      if (err instanceof Response) {
        res.redirect(err.status, err.headers.get('Location') ?? '')
      } else {
        next(err)
      }
    }
  }
}
