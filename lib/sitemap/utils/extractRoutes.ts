import { type RouteObject } from 'react-router'

/**
 * Extracts all route patterns from the provided `{@link RouteObject}s.
 *
 * @param routes Array of {@link RouteObject} to extract URLs from.
 *
 * @returns Extracted URLs.
 */
export function extractRoutes(routes?: RouteObject[]): string[] {
  if (!routes) return []

  return routes.reduce<string[]>((out, { path, children }) => {
    if (!path) return [...out, ...extractRoutes(children)]

    return [...out, path]
  }, [])
}
