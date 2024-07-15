import template from '../build/index.html'
import * as module from '../build/main.edge.js'
import { renderRoot } from '../lib/esr/renderRoot'

export const onRequest: PagesFunction = async ({ request, functionPath }) => {
  switch (functionPath) {
    case '/robots.txt':
      if (module.robots) {
        return new Response(await module.robots(), {
          headers: { 'content-type': 'text/plain' },
        })
      }
      else {
        return new Response(undefined, {
          status: 404,
        })
      }
    case '/sitemap.xml':
      if (module.sitemap) {
        return new Response(await module.sitemap(), {
          headers: { 'Content-Type': 'application/xml' },
        })
      }
      else {
        return new Response(undefined, {
          status: 404,
        })
      }
    default:
      return renderRoot(module, template)(request, functionPath)
  }
}
