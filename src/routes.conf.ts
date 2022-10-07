/**
 * @file Route definitions for React router.
 */

import { ComponentType } from 'react'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Quote from './pages/Quote'

export type RouteConfig = {
  component: ComponentType<any>
  path: string
  title?: string
}

const config: RouteConfig[] = [{
  component: Home,
  path: '/',
}, {
  component: Quote,
  path: '/quote',
}, {
  component: Home,
  path: '/jp',
}, {
  component: Quote,
  path: '/jp/quote',
}, {
  component: NotFound,
  path: '*',
}]

export default config
