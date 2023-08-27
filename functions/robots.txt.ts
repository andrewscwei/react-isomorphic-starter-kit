import { handleRobots } from '../build/index.edge'

export const onRequest: PagesFunction = async ({ request }) => {
  const response = await handleRobots(request)

  return response
}
