/**
 * @file Client router config.
 */

import { generateLocalizedRoutes } from '../lib/i18n'
import { I18N_CONFIG } from './app.conf'

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

export default generateLocalizedRoutes(routes, I18N_CONFIG)
