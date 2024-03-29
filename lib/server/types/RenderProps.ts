import { type Request } from 'express'
import { type RouteObject } from 'react-router'
import { type StaticHandlerContext } from 'react-router-dom/server'

/**
 * Props for rendering the application root.
 */
export type RenderProps = {
  /**
   * {@link StaticHandlerContext} for creating the static router provider.
   */
  context: StaticHandlerContext

  /**
   * The invoking {@link Request}.
   */
  request: Request

  /**
   * An array of {@link RouteObject} to render in the static application router.
   */
  routes: RouteObject[]
}
