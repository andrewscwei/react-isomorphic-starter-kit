import { handleRoot } from '../build/index.edge'

export const onRequest: PagesFunction = async ({ request, functionPath: path }) => {
  const response = await handleRoot(request, path)

  return response
}
