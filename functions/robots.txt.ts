export const onRequest: PagesFunction = async ({ request, functionPath: path }) => {
  const response = new Response('bar')

  return response
}
