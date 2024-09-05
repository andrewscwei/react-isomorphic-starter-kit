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
    path: '*',
    lazy: () => import('./ui/pages/notFound/NotFound.js'),
  }],
}]
