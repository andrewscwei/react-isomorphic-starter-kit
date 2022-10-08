/**
 * @file Route definitions for React router.
 */

import { ComponentType } from 'react'
import Home from './ui/pages/Home'
import NotFound from './ui/pages/NotFound'
import Quote from './ui/pages/Quote'

export type RouteConfig = {
  component: ComponentType
  path: string
  index?: boolean
}

const config: RouteConfig[] = [{
  component: Home,
  path: '/',
  index: true,
}, {
  component: Quote,
  path: '/quote',
}, {
  component: NotFound,
  path: '*',
}]

export default config
