/**
 * @file Routes config.
 */

import { type RouteObject } from 'react-router'
import { ErrorBoundary } from './ui/pages/ErrorBoundary'

export const config: RouteObject[] = [{
  id: 'root',
  lazy: () => import('./ui/pages/index'),
  ErrorBoundary,
  children: [{
    path: '/',
    index: true,
    lazy: () => import('./ui/pages/home'),
    metadata: async (context, { ltxt }) => ({ title: ltxt('window-title-home') }),
  }, {
    path: '/quote',
    lazy: () => import('./ui/pages/quote'),
    metadata: async (context, { ltxt }) => ({ title: ltxt('window-title-quote') }),
    loader: async (...args) => (await import('./ui/pages/quote/loader')).loader(...args),
  }, {
    path: '*',
    lazy: () => import('./ui/pages/notFound'),
    metadata: async (context, { ltxt }) => ({ title: ltxt('window-title-not-found') }),
  }],
}]
