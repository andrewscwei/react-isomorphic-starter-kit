import { type RouteObject } from 'react-router'
import { joinPaths } from './joinPaths.js'

/**
 * Extracts paths from a list of `{@link RouteObject}s.
 *
 * @param routes List of {@link RouteObject} to extract paths from.
 *
 * @returns Extracted paths.
 */
export function extractPaths(routes: RouteObject[] = [], parentPath = ''): string[] {
  return routes.flatMap(({ children = [], path = '' }) => {
    const currPath = joinPaths(parentPath, path)

    return [
      ...path ? [currPath] : [],
      ...extractPaths(children, currPath),
    ]
  })
}
