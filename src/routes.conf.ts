/**
 * @file Route definitions for React router.
 */

import { ComponentType } from 'react'
import Home from './ui/pages/Home'
import NotFound from './ui/pages/NotFound'
import Quote from './ui/pages/Quote'

export type RouteConfig = {
  component: ComponentType<any>
  path: string
}

const config: RouteConfig[] = [{
  component: Home,
  path: '/',
}, {
  component: Quote,
  path: '/quote',
}, {
  component: Home,
  path: '/ja',
}, {
  component: Quote,
  path: '/ja/quote',
}, {
  component: NotFound,
  path: '*',
}]

export default config
