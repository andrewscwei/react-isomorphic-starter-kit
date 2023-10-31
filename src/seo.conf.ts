import { type SEOConfig } from '@lib/seo'

export const config: SEOConfig = {
  urlFilter: url => !url.endsWith('*'),
}
