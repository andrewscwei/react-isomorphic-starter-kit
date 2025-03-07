/**
 * @file I18n config.
 */

import { defineConfig, type Locale } from '@lib/i18n/index.js'
import { DEFAULT_LOCALE } from './app.config.js'

export const i18n = defineConfig({
  defaultLocale: DEFAULT_LOCALE as Locale,
  localeChangeStrategy: 'path',
  sources: import.meta.glob('./locales/**/*.json', { eager: true }),
})
