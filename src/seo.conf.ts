import { type SEOConfig } from '@lib/seo/index.js'

export const seo: SEOConfig = {
  urlFilter: url => !url.endsWith('*'),
}
