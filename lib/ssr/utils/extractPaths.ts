import type { Route } from '../types/index.js'
import { joinPaths } from './joinPaths.js'

/**
 * Extracts paths from a list of `{@link Route}s.
 *
 * @param routes List of {@link RouteObject} to extract paths from.
 *
 * @returns Extracted paths.
 */
export function extractPaths(routes: Route[] = [], parentPath = ''): string[] {
  return routes.flatMap(({ children = [], path = '' }) => {
    const currPath = joinPaths(parentPath, path)

    return [
      ...path ? [currPath] : [],
      ...extractPaths(children, currPath),
    ]
  })
}
