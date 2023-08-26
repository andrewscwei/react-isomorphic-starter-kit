import app from '../build/index.workers'


export const onRequest: PagesFunction = async ({ request, functionPath: path }) => {
  const url = new URL(request.url)

  console.log('FOO', app)

  return new Response('Hello, world!')
}
