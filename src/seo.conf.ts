import { SEOConfig } from '../lib/server'

const robots = `
User-agent: * Disallow:
`

const urlFilter: SEOConfig['urlFilter'] = url => {
  if (url.endsWith('*')) return false

  return true
}

export default {
  robots,
  urlFilter,
} as SEOConfig