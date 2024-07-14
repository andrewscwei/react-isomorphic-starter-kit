import { robots } from '../build/main.edge'

export const onRequest: PagesFunction = async ({ request }) => {
  const res = await robots()

  return new Response(res, {
    headers: { 'content-type': 'text/plain' },
  })
}
