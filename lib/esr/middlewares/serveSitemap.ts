import { type SitemapOptions } from '../types/SitemapOptions.js'
import { generateSitemap } from '../utils/generateSitemap.js'

type Params = {
  sitemap?: SitemapOptions
}

export function serveSitemap({ sitemap: options }: Params) {
  return async (req: Request) => {
    if (options) {
      const sitemap = await generateSitemap(options)

      return new Response(sitemap, {
        headers: { 'Content-Type': 'application/xml' },
      })
    }
    else {
      return new Response(undefined, {
        status: 404,
      })
    }
  }
}
