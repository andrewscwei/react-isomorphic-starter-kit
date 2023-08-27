import { RouteObject } from 'react-router'
import { SEOConfig, generateSitemap } from '../seo'

type Params = {
  routes: RouteObject[]
  seo?: SEOConfig
}

export default function serveSitemap({ routes, seo }: Params) {
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
