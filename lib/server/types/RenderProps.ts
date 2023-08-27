import type { RouteObject } from 'react-router'
import type { StaticHandlerContext } from 'react-router-dom/server'

type RenderProps = {
  context: StaticHandlerContext
  routes: RouteObject[]
}

export default RenderProps
