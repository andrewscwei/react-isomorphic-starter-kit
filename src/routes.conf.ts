/**
 * @file Client router config.
 */

import React from 'react'

const config: RouteConfig[] = [{
  component: React.lazy(() => import('./ui/pages/home')),
  path: '/',
}, {
  component: React.lazy(() => import('./ui/pages/quote')),
  path: '/quote',
  prefetch: async () => (await import('./ui/pages/quote')).prefetch(),
}, {
  component: React.lazy(() => import('./ui/pages/notFound')),
  path: '*',
}]

export default config
