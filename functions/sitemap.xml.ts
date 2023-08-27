import { handleSitemap } from '../build/index.edge'

export const onRequest: PagesFunction = async ({ request }) => {
  const response = await handleSitemap(request)

  return response
}
