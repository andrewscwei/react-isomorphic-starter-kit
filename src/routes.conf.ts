/**
 * @file Client router config.
 */

import { RouteObject } from 'react-router'
import generateLocalizedRoutes from '../lib/i18n/generateLocalizedRoutes'
import { DEFAULT_LOCALE, LOCALE_CHANGE_STRATEGY } from './app.conf'
import translations from './locales'

const routes: RouteObject[] = [{
  path: '/',
  index: true,
  lazy: () => import('./ui/pages/home'),
}, {
  path: '/quote',
  lazy: () => import('./ui/pages/quote'),
}, {
  path: '*',
  lazy: () => import('./ui/pages/notFound'),
}]

export default generateLocalizedRoutes(routes, {
  defaultLocale: DEFAULT_LOCALE,
  localeChangeStrategy: LOCALE_CHANGE_STRATEGY,
  supportedLocales: Object.keys(translations),
})
