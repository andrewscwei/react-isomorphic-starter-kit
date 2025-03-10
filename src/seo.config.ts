/**
 * @file SEO config.
 */

import { defineConfig, type SEOConfig } from '@lib/seo'
import { BASE_URL, BUILD_TIME } from './app.config.js'

export const seo: SEOConfig = defineConfig({
  baseURL: BASE_URL,
  modifiedAt: BUILD_TIME,
})
