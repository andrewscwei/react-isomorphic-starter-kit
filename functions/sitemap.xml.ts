export const onRequest: PagesFunction = async ({ request, functionPath: path }) => {
  const response = new Response('foo')

  return response
}
