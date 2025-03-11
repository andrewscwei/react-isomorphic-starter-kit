import type { SitemapProvider } from '../types/index.js'

type Params = {
  sitemap?: SitemapProvider
}

export function serveSitemap({ sitemap }: Params) {
  return async (req: Request) => {
    if (sitemap) {
      const payload = await sitemap(req)

      return new Response(payload, {
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
