/**
 * @file I18n config.
 */

import { defineConfig, type Locale } from '@lib/i18n/index.js'

export const i18n = defineConfig({
  defaultLocale: (import.meta.env.VITE_DEFAULT_LOCALE ?? 'en') as Locale,
  localeChangeStrategy: 'path',
  sources: import.meta.glob('./locales/**/*.json', { eager: true }),
})
