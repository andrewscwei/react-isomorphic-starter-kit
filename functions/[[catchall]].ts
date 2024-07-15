import template from '../build/index.html'
import * as module from '../build/main.edge'
import { renderRoot } from '../lib/esr/renderRoot'

export const onRequest: PagesFunction = async ({ request, functionPath: path }) => {
  switch (path) {
    case '/robots.txt':
      return new Response(await module.robots(), {
        headers: { 'content-type': 'text/plain' },
      })
    case '/sitemap.xml':
      return new Response(await module.sitemap(), {
        headers: { 'Content-Type': 'application/xml' },
      })
    default:
      return renderRoot(module, template)(request, path)
  }
}
