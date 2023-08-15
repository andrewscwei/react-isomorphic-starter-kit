import { Request } from 'express'
import React, { ComponentType } from 'react'
import { RouteObject } from 'react-router'
import { StaticRouterProvider, createStaticHandler, createStaticRouter } from 'react-router-dom/server'
import createFetchRequest from './createFetchRequest'

type Options = {
  container: ComponentType
  routes: RouteObject[]
}

export default async function createStaticRouterProvider(req: Request, { container, routes }: Options) {
  const fetchRequest = createFetchRequest(req)
  const handler = createStaticHandler([{ Component: container, children: routes }])
  const context = await handler.query(fetchRequest)

  if (context instanceof Response) throw context

  return <StaticRouterProvider router={createStaticRouter(handler.dataRoutes, context)} context={context}/>
}
