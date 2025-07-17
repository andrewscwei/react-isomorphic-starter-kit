/* eslint-disable @typescript-eslint/naming-convention */
/**
 * @file Routes config.
 */

import { defineRoutes } from '@lib/i18n'
import { DEFAULT_LOCALE } from './app.config.js'
import { ErrorBoundary } from './ui/pages/ErrorBoundary.js'

export const routes = defineRoutes([{
  ErrorBoundary,
  HydrateFallback: () => null,
  children: [{
    path: '/',
    index: true,
    lazy: () => import('./ui/pages/home/Home.js'),
  }, {
    path: '*',
    lazy: () => import('./ui/pages/notFound/NotFound.js'),
  }],
}], {
  defaultLocale: DEFAULT_LOCALE,
  localeChangeStrategy: 'path',
  sources: [
    import.meta.glob('./locales/**/*.json', { eager: true }),
  ],
})
