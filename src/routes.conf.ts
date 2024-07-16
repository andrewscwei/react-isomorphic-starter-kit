/**
 * @file Routes config.
 */

import { type RouteObject } from 'react-router'
import { ErrorBoundary } from './ui/pages/ErrorBoundary.js'

export const routes: RouteObject[] = [{
  id: 'root',
  lazy: () => import('./ui/pages/index'),
  ErrorBoundary,
  children: [{
    path: '/',
    index: true,
    lazy: () => import('./ui/pages/home'),
  }, {
    path: '/quote',
    lazy: () => import('./ui/pages/quote'),
    loader: async args => (await import('./ui/pages/quote/loader')).loader(args),
  }, {
    path: '*',
    lazy: () => import('./ui/pages/notFound'),
  }],
}]
