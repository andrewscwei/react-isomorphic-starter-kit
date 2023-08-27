import type { RouteObject } from 'react-router'
import { generateSitemap, type SEOConfig } from '../seo'

type Params = {
  routes: RouteObject[]
  seo?: SEOConfig
}

export function serveSitemap({ routes, seo }: Params) {
  return async (request: Request) => {
    try {
      const sitemap = generateSitemap({ routes, seo })

      return new Response(sitemap, {
        headers: { 'content-type': 'application/xml' },
      })
    }
    catch (err) {
      return new Response(`${err}`, { status: 500 })
    }
  }
}
