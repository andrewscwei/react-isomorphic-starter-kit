/**
 * @file Routes config.
 */

import { localizeReactRouterRoutes } from '@lib/i18n/adapters/react-router'

import i18nConfig from './i18n.config.js'
import { ErrorBoundary } from './ui/ErrorBoundary.js'

export const routes = localizeReactRouterRoutes([{
  path: '/',
  ErrorBoundary,
  lazy: async () => ({
    ...await import('./ui/Root.js'),
  }),

  children: [{
    index: true,
    lazy: () => import('./ui/pages/Home/Home.js'),
  }, {
    path: '*',
    lazy: () => import('./ui/pages/NotFound/NotFound.js'),
  }],
}], i18nConfig)
