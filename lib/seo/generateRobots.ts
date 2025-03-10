import { type RouteObject } from 'react-router'
import { type SEOConfig } from './types/index.js'

/**
 * Generates plain text `robots.txt` from the provided configuration.
 *
 * @param routes Array of {@link RouteObject} to generate the `robots.txt` from.
 * @param config Configuration for SEO (see {@link SEOConfig}).
 *
 * @returns The plain text `robots.txt`.
 */
export async function generateRobots(routes: RouteObject[], {
  robotsProvider,
}: SEOConfig) {
  return robotsProvider(routes)
}
