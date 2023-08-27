import type { RouteObject } from 'react-router'
import type { StaticHandlerContext } from 'react-router-dom/server'

export type RenderProps = {
  context: StaticHandlerContext
  routes: RouteObject[]
}
