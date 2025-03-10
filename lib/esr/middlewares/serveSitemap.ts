import type { Module } from '../types/index.js'

export function serveSitemap({ sitemap }: Module) {
  return async (req: Request) => {
    if (sitemap) {
      return new Response(await sitemap(), {
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
