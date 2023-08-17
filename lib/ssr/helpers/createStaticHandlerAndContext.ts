import { Request } from 'express'
import { RouteObject } from 'react-router'
import { createStaticHandler } from 'react-router-dom/server'
import createFetchRequest from './createFetchRequest'

type Options = {
  routes: RouteObject[]
}

export default async function createStaticHandlerAndContext(req: Request, { routes }: Options) {
  const fetchRequest = createFetchRequest(req)
  const handler = createStaticHandler([{ children: routes }])
  const context = await handler.query(fetchRequest)

  return { handler, context }
}
