/**
 * @file Routes config.
 */

import type { RouteObject } from 'react-router'

export const config: RouteObject[] = [{
  path: '/',
  index: true,
  lazy: () => import('./ui/pages/home'),
  metadata: async ltxt => ({ title: ltxt('window-title-home') }),
}, {
  path: '/quote',
  lazy: () => import('./ui/pages/quote'),
  metadata: async ltxt => ({ title: ltxt('window-title-quote') }),
}, {
  path: '*',
  lazy: () => import('./ui/pages/notFound'),
  metadata: async ltxt => ({ title: ltxt('window-title-not-found') }),
}]
