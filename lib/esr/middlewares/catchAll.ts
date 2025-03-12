import type { LocalDataProvider, Middleware, RenderFunction, SitemapOptions } from '../types/index.js'
import { renderRoot } from './renderRoot.js'
import { serveSitemap } from './serveSitemap.js'

type Params = {
  module: {
    middlewares?: Middleware[]
    sitemap?: SitemapOptions
    localData?: LocalDataProvider
    render: RenderFunction
  }
  template: string
}

export function catchAll({ module: { middlewares = [], ...module }, template }: Params) {
  return (request: Request) => {
    const path = new URL(request.url).pathname
    const middleware = middlewares.find(t => t.path === path)

    if (middleware) {
      return middleware.handler(request)
    }
    else {
      switch (path) {
        case '/sitemap.xml':
          return serveSitemap(module)(request)
        default:
          return renderRoot(module, template)(request)
      }
    }
  }
}
