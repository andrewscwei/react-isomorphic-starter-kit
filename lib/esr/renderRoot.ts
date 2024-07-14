import { injectMetadata } from '../seo'
import { type Module } from './Module'

export function renderRoot({ render }: Module, template: string) {
  return async (req: Request, path: string) => {
    try {
      const { metadata, stream } = await render(req)
      const html = injectMetadata(template, metadata)
      const [htmlStart, htmlEnd] = html.split('<!-- APP_HTML -->')
      const readableStream = new ReadableStream({
        start: async controller => {
          try {
            controller.enqueue(new TextEncoder().encode(htmlStart))

            const reactStream = await stream()
            const reader = reactStream.getReader()

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
