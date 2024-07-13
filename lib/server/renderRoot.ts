import { type Request } from 'express'
import { Transform } from 'node:stream'
import { type PipeableStream, type RenderToPipeableStreamOptions } from 'react-dom/server'
import { injectMetadata, type Metadata } from '../layouts'

type Options = {
  metadata: Metadata
  template: string
  timeout?: number
  stream: (options: RenderToPipeableStreamOptions) => PipeableStream
  onEnd: (htmlEnd: string) => void
  onError: (err: unknown) => void
  onProgress: (htmlChunk: any, encoding: BufferEncoding) => void
  onStart: (htmlStart: string) => void
}

export function renderRoot(req: Request, {
  metadata,
  stream,
  template,
  timeout = 10_000,
  onEnd,
  onError,
  onProgress,
  onStart,
}: Options) {
  const html = injectMetadata(template, metadata)

  let error: unknown

  const { pipe, abort } = stream({
    onError(err) {
      error = err
    },
    onShellError() {
      onError(error)
    },
    onShellReady() {
      if (error) return onError(error)

      const [htmlStart, htmlEnd] = html.split('<!-- APP_HTML -->')
      const transformStream = new Transform({
        transform: (chunk, encoding, callback) => {
          onProgress(chunk, encoding)
          callback()
        },
      })

      transformStream.on('finish', () => onEnd(htmlEnd))

      onStart(htmlStart)
      pipe(transformStream)
    },
  })

  setTimeout(() => abort(), timeout)
}
