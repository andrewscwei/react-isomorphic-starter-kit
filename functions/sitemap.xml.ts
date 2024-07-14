import { sitemap } from '../build/main.edge'

export const onRequest: PagesFunction = async ({ request }) => {
  const res = await sitemap()

  return new Response(res, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
