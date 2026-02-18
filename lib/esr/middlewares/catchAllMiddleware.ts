import { type Middleware } from '../types/Middleware.js'
import { type RenderFunction } from '../types/RenderFunction.js'
import { type SitemapOptions } from '../types/SitemapOptions.js'
import { joinPaths } from '../utils/joinPaths.js'
import { renderMiddleware } from './renderMiddleware.js'

type Params = {
  module: {
    middlewares?: Middleware[]
    render: RenderFunction
    sitemap?: SitemapOptions
  }
  template: string
}

const EXCLUDES = [
  { contains: '/assets/' },
  { endsWith: '.css' },
  { endsWith: '.js' },
  { endsWith: '.json' },
  { endsWith: '.png' },
  { endsWith: '.svg' },
  { endsWith: '.txt' },
]

export function catchAllMiddleware({ module: { middlewares = [], ...module }, template }: Params): Middleware['handler'] {
  return ({ env, request }) => {
    const { BASE_PATH = '/' } = env
    const path = new URL(request.url).pathname
    const middleware = middlewares.find(v => joinPaths('/', BASE_PATH, v.path) === path)

    if (middleware) {
      return middleware.handler({ env, request })
    } else if (isExcluded(path)) {
      return env.ASSETS.fetch(request)
    } else {
      return renderMiddleware(module, template)(request)
    }
  }
}

function isExcluded(path: string) {
  return EXCLUDES.some(rule => {
    if (rule.contains && path.includes(rule.contains)) return true
    if (rule.endsWith && path.endsWith(rule.endsWith)) return true
    return false
  })
}
