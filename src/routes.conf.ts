/**
 * @file Route definitions for React router.
 */

import { RouteConfig } from 'react-router-config'
import About from './containers/About'
import Home from './containers/Home'
import NotFound from './containers/NotFound'
import { getPolyglotByLocale } from './utils/i18n'

const config: RouteConfig[] = [{
  path: '/',
  title: getPolyglotByLocale('en').t('window-title-home'),
  exact: true,
  component: Home,
}, {
  path: '/about',
  title: getPolyglotByLocale('en').t('window-title-about'),
  exact: true,
  component: About,
}, {
  path: '/ja',
  title: getPolyglotByLocale('ja').t('window-title-home'),
  exact: true,
  component: Home,
}, {
  path: '/ja/about',
  title: getPolyglotByLocale('ja').t('window-title-about'),
  exact: true,
  component: About,
}, {
  path: '*',
  title: getPolyglotByLocale('en').t('window-title-not-found'),
  component: NotFound,
}]

export default config
