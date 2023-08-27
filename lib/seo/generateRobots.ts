import { SEOConfig } from './types'

type Params = {
  seo?: SEOConfig
}

/**
 * `robots.txt` generator.
 */
export default function generateRobots({ seo }: Params = {}) {
  return seo?.robots ?? ''
}
