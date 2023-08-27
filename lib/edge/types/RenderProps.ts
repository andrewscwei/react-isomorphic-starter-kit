import { RouteObject } from 'react-router'
import { StaticHandlerContext } from 'react-router-dom/server'

type RenderProps = {
  context: StaticHandlerContext
  routes: RouteObject[]
}

export default RenderProps
