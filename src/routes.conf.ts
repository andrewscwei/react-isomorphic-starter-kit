/**
 * @file Route definitions for React router.
 */

import { ComponentType } from 'react'
import Home from './ui/pages/home'
import NotFound from './ui/pages/notFound'
import Quote, { prefetch as prefetchQuote } from './ui/pages/quote'

type RouteConfig = {
  component: ComponentType
  path: string
  index?: boolean
  prefetch?: () => Promise<any>
}

const config: RouteConfig[] = [{
  component: Home,
  path: '/',
}, {
  component: Quote,
  path: '/quote',
  prefetch: prefetchQuote,
}, {
  component: NotFound,
  path: '*',
}]

export default config
