import type { SEOConfig } from './types'

/**
 * Generates plain text `robots.txt` from the provided configuration.
 *
 * @param config Configuration for SEO (see {@link SEOConfig}).
 *
 * @returns The plain text `robots.txt`.
 */
export function generateRobots({ robots = '' }: SEOConfig = {}) {
  return robots
}
