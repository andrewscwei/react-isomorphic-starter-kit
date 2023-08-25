export const onRequest: PagesFunction = async context => {
  console.log('FOO')

  return new Response('Hello, world!')
}
