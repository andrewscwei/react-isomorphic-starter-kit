/**
 * @file I18n config.
 */

import { defineConfig } from '@lib/i18n/index.js'
import { DEFAULT_LOCALE } from './app.config.js'

export const i18n = defineConfig({
  defaultLocale: DEFAULT_LOCALE,
  localeChangeStrategy: 'path',
  sources: import.meta.glob('./locales/**/*.json', { eager: true }),
})
