/**
 * @file Routes config.
 */

import { defineRoutes } from '@lib/i18n'

import { DEFAULT_LOCALE } from '@/app.config.js'
import { ErrorBoundary } from '@/ui/ErrorBoundary.js'

export const routes = defineRoutes([{
  children: [{
    index: true,
    lazy: () => import('./ui/pages/Home/Home.js'),
    path: '/',
  }, {
    lazy: () => import('./ui/pages/NotFound/NotFound.js'),
    path: '*',
  }],
  ErrorBoundary,
}], {
  defaultLocale: DEFAULT_LOCALE,
  localeChangeStrategy: 'path',
  sources: [
    import.meta.glob('./locales/**/*.json', { eager: true }),
  ],
})
