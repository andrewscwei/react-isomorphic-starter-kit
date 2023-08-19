/**
 * @file Client router config.
 */

import { generateLocalizedRoutes } from '../lib/i18n'
import i18nConf from './i18n.conf'

const routes: RouteObjectWithMetadata[] = [{
  path: '/',
  index: true,
  lazy: () => import('./ui/pages/home'),
  metadata: async ltxt => ({ title: ltxt('window-title-home') }),
}, {
  path: '/quote',
  lazy: () => import('./ui/pages/quote'),
  metadata: async ltxt => ({ title: ltxt('window-title-quote') }),
}, {
  path: '*',
  lazy: () => import('./ui/pages/notFound'),
  metadata: async ltxt => ({ title: ltxt('window-title-not-found') }),
}]

export default generateLocalizedRoutes(routes, i18nConf)
