import { defineConfig } from '@lib/i18n'

import { DEFAULT_LOCALE } from './app.config.js'

export default defineConfig({
  defaultLocale: DEFAULT_LOCALE,
  localeChangeStrategy: 'path',
  sources: [
    import.meta.glob('./locales/**/*.json', { eager: true }),
  ],
})
