import { type RouteObject } from 'react-router'
import { generateSitemap, type SEOConfig } from '../seo'

type Params = {
  /**
   * Configuration for routes (see {@link RouteObject}).
   */
  routes: RouteObject[]

  /**
   * Configuration for SEO (see {@link SEOConfig}).
   */
  seo?: SEOConfig
}

/**
 * Creates a {@link Request} handler that returns a {@link Response} containing
 * the `sitemap.xml` of the application in plain text.
 *
 * @param params See {@link Params}.
 *
 * @returns The {@link Request} handler.
 */
export function serveSitemap({ routes, seo }: Params) {
  return async (request: Request) => {
    try {
      const sitemap = await generateSitemap(routes, seo)

      return new Response(sitemap, {
        headers: { 'content-type': 'application/xml' },
      })
    }
    catch (err) {
      return new Response(`${err}`, { status: 500 })
    }
  }
}
