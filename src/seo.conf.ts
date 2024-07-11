import { type SEOConfig } from '@lib/seo'

export const seo: SEOConfig = {
  urlFilter: url => !url.endsWith('*'),
}
