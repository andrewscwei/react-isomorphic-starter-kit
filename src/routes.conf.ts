/**
 * @file Routes config.
 */

import { type RouteObject } from 'react-router'
import { ErrorBoundary } from './ui/pages/ErrorBoundary.js'

export const routes: RouteObject[] = [{
  id: 'root',
  lazy: () => import('./ui/pages/Page.js'),
  ErrorBoundary,
  children: [{
    path: '/',
    index: true,
    lazy: () => import('./ui/pages/home/Home.js'),
  }, {
    path: '/quote',
    lazy: () => import('./ui/pages/quote/Quote.js'),
    loader: async args => (await import('./ui/pages/quote/Quote.loader.js')).loader(args),
  }, {
    path: '*',
    lazy: () => import('./ui/pages/notFound/NotFound.js'),
  }],
}]
