import template from '@build/index.html'
import * as module from '@build/main.edge.js'
import { renderRoot, serveSitemap } from '@lib/esr'

export const onRequest: PagesFunction = async ({ request, env, functionPath }) => {
  switch (functionPath) {
    case '/sitemap.xml':
      return serveSitemap(module)(request)
    default:
      return renderRoot(module, template)(request)
  }
}
