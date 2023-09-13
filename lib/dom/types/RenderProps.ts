import { type RouteObject } from 'react-router'

/**
 * Props for rendering the application root.
 */
export type RenderProps = {
  /**
   * Array of {@link RouteObject} to render in the application router.
   */
  routes: RouteObject[]
}
