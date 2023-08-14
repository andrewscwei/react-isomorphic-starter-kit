/**
 * @file Client router config.
 */

import { lazy } from 'react'

const config: RouteConfig[] = [{
  component: lazy(() => import('./ui/pages/home')),
  path: '/',
}, {
  component: lazy(() => import('./ui/pages/quote')),
  path: '/quote',
  metaTags: () => ({ title: 'foo' }),
  prefetch: async () => (await import('./ui/pages/quote')).prefetch(),
}, {
  component: lazy(() => import('./ui/pages/notFound')),
  path: '*',
}]

export default config
