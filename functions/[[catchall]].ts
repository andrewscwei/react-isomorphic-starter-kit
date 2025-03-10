import { renderRoot, serveRobots, serveSitemap } from '@lib/esr'
import template from '../build/index.html'
import * as module from '../build/main.edge.js'

export const onRequest: PagesFunction = async ({ request, functionPath }) => {
  switch (functionPath) {
    case '/robots.txt':
      return serveRobots(module)(request, functionPath)
    case '/sitemap.xml':
      return serveSitemap(module)(request, functionPath)
    default:
      return renderRoot(module, template)(request, functionPath)
  }
}
