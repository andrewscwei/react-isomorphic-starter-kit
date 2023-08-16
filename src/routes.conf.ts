/**
 * @file Client router config.
 */

import generateLocalizedRoutes from '../lib/i18n/generateLocalizedRoutes'
import { DEFAULT_LOCALE, LOCALE_CHANGE_STRATEGY } from './app.conf'
import { translations } from './locales'

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

export default generateLocalizedRoutes(routes, {
  defaultLocale: DEFAULT_LOCALE,
  localeChangeStrategy: LOCALE_CHANGE_STRATEGY,
  supportedLocales: Object.keys(translations),
})
