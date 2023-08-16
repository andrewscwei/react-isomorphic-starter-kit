import { Request } from 'express'
import { ComponentType } from 'react'
import { RouteObject } from 'react-router'
import { createStaticHandler } from 'react-router-dom/server'
import createFetchRequest from './createFetchRequest'

type Options = {
  container: ComponentType
  routes: RouteObject[]
}

export default async function createStaticHandlerAndContext(req: Request, { container, routes }: Options) {
  const fetchRequest = createFetchRequest(req)
  const handler = createStaticHandler([{ Component: container, children: routes }])
  const context = await handler.query(fetchRequest)

  return { handler, context }
}
