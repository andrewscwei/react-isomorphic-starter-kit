/**
 * @file Route definitions for React router.
 */

import Home from './ui/pages/home'
import NotFound from './ui/pages/notFound'
import Quote, { prefetch as prefetchQuote } from './ui/pages/quote'

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
