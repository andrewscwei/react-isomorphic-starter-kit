import { handleRoot } from '../build'

export const onRequest: PagesFunction = async ({ request, functionPath: path }) => {
  const response = await handleRoot(request, path)

  return response
}
