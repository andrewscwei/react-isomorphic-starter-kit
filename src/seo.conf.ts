import type { SEOConfig } from '../lib/seo'

export const config: SEOConfig = {
  robots: `
User-agent: * Disallow:
  `,
  urlFilter: url => {
    if (url.endsWith('*')) return false

    return true
  },
}
