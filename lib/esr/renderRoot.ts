import { injectMetadata } from '../dom/index.js'
import { type Module } from './Module.js'

export function renderRoot({ render }: Module, template: string) {
  return async (req: Request, path: string) => {
    try {
      const metadata = {}
      const stream = await render(req, metadata)
      const readableStream = new ReadableStream({
        start: async controller => {
          try {
            const html = injectMetadata(template, metadata)
            const [htmlStart, htmlEnd] = html.split('<!-- APP_HTML -->')
            controller.enqueue(new TextEncoder().encode(htmlStart))

            const reader = stream.getReader()

            while (true) {
              const { done, value } = await reader.read()
              if (done) break
              controller.enqueue(value)
            }

            controller.enqueue(new TextEncoder().encode(htmlEnd))
            controller.close()
          }
          catch (err) {
            controller.error(err)
          }
        },
      })

      return new Response(readableStream, {
        headers: { 'content-type': 'text/html' },
        status: 200,
      })
    }
    catch (err) {
      return new Response(JSON.stringify({ error: err }), {
        headers: { 'content-type': 'application/json' },
        status: 500,
      })
    }
  }
}
