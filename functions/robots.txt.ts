import { handleRobots } from '../build'

export const onRequest: PagesFunction = async ({ request }) => {
  const response = await handleRobots(request)

  return response
}
