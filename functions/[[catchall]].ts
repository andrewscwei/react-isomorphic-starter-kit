import render from '../build/index.edge'

export const onRequest: PagesFunction = async ({ request, functionPath: path }) => {
  const response = await render(request, path)

  return response
}
