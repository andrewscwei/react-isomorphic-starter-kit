/**
 * @file I18n config.
 */

import { defineConfig } from '@lib/i18n/index.js'
import { DEFAULT_LOCALE, LOCALE_CHANGE_STRATEGY } from './app.conf.js'

export const i18n = defineConfig({
  defaultLocale: DEFAULT_LOCALE,
  localeChangeStrategy: LOCALE_CHANGE_STRATEGY,
  sources: import.meta.glob('./locales/**/*.json', { eager: true }),
})
