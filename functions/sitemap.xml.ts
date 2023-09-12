import { handleSitemap } from '../build'

export const onRequest: PagesFunction = async ({ request }) => {
  const response = await handleSitemap(request)

  return response
}
