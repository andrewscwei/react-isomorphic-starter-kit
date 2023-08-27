import type { SEOConfig } from './types'

type Params = {
  seo?: SEOConfig
}

/**
 * `robots.txt` generator.
 */
export function generateRobots({ seo }: Params = {}) {
  return seo?.robots ?? ''
}
