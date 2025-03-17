import type { LocalDataProvider, Middleware, RenderFunction, SitemapOptions } from '../types/index.js'
import { joinPaths } from '../utils/index.js'
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

export function catchAll({ module: { middlewares = [], ...module }, template }: Params): Middleware['handler'] {
  return ({ request, env }) => {
    const { BASE_PATH = '/' } = env
    const path = new URL(request.url).pathname
    const middleware = middlewares.find(t => joinPaths('/', BASE_PATH, t.path) === path)

    if (middleware) {
      return middleware.handler({ request, env })
    }
    else {
      switch (path) {
        case joinPaths('/', BASE_PATH, 'sitemap.xml'):
          return serveSitemap(module)(request)
        default:
          return renderRoot(module, template)(request)
      }
    }
  }
}
