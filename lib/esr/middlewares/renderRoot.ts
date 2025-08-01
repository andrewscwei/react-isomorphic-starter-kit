import { type LocalDataProvider } from '../types/LocalDataProvider.js'
import { type RenderFunction } from '../types/RenderFunction.js'
import { injectHTMLData } from '../utils/injectHTMLData.js'

type Params = {
  localData?: LocalDataProvider
  render: RenderFunction
}

export function renderRoot({ localData, render }: Params, template: string) {
  return async (req: Request) => {
    try {
      const metadata = {}
      const stream = await render(req, metadata, {})
      const readableStream = new ReadableStream({
        start: async controller => {
          try {
            const locals = localData ? await localData(req) : {}

            const htmlData = {
              ...metadata,
              dev: process.env.NODE_ENV === 'development',
              localData: `<script>window.__localData=${JSON.stringify(locals)}</script>`,
            }

            const chunks = template.split(/<!--\s*root\s*-->/is)
            const htmlStart = injectHTMLData(chunks[0], htmlData)
            const htmlEnd = injectHTMLData(chunks[1], htmlData)
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
      if (err instanceof Response) {
        return err
      }
      else {
        return new Response(JSON.stringify({ error: err }), {
          headers: { 'content-type': 'application/json' },
          status: 500,
        })
      }
    }
  }
}
