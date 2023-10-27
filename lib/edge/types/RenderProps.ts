import { type RouteObject } from 'react-router'
import { type StaticHandlerContext } from 'react-router-dom/server'

/**
 * Props for rendering the application root.
 */
export type RenderProps = {
  /**
   * {@link StaticHandlerContext} for instantiating the static client router
   * provider.
   */
  context: StaticHandlerContext

  /**
   * The invoking {@link Request}.
   */
  request: Request

  /**
   * Array of {@link RouteObject} to render in the static application router.
   */
  routes: RouteObject[]
}
