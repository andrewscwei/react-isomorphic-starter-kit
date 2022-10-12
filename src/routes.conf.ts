/**
 * @file Route definitions for React router.
 */

import { ComponentType } from 'react'
import Home from './ui/pages/Home'
import NotFound from './ui/pages/NotFound'
import Quote, { prefetch as prefetchQuote } from './ui/pages/Quote'

export type RouteConfig = {
  component: ComponentType
  path: string
  index?: boolean
  prefetch?: () => Promise<any>
}

const config: RouteConfig[] = [{
  component: Home,
  path: '/',
  index: true,
}, {
  component: Quote,
  path: '/quote',
  prefetch: prefetchQuote,
}, {
  component: NotFound,
  path: '*',
}]

export default config
