/**
 * @file Routes config.
 */

import { DEFAULT_LOCALE } from '@/app.config.js'
import { ErrorBoundary } from '@/ui/ErrorBoundary.js'
import { defineRoutes } from '@lib/i18n'

export const routes = defineRoutes([{
  ErrorBoundary,
  children: [{
    path: '/',
    index: true,
    lazy: () => import('./ui/pages/Home/Home.js'),
  }, {
    path: '*',
    lazy: () => import('./ui/pages/NotFound/NotFound.js'),
  }],
}], {
  defaultLocale: DEFAULT_LOCALE,
  localeChangeStrategy: 'path',
  sources: [
    import.meta.glob('./locales/**/*.json', { eager: true }),
  ],
})
