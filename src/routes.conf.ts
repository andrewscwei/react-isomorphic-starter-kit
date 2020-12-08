/**
 * @file Route definitions for React router.
 */

import { RouteConfig } from 'react-router-config'
import About from './containers/About'
import Home from './containers/Home'
import NotFound from './containers/NotFound'
import { getPolyglotByLocale } from './utils/i18n'

const config: Array<RouteConfig> = [{
  path: '/',
  title: getPolyglotByLocale('en').t('home'),
  exact: true,
  component: Home,
}, {
  path: '/about',
  title: getPolyglotByLocale('en').t('about'),
  exact: true,
  component: About,
}, {
  path: '/ja',
  title: getPolyglotByLocale('ja').t('home'),
  exact: true,
  component: Home,
}, {
  path: '/ja/about',
  title: getPolyglotByLocale('ja').t('about'),
  exact: true,
  component: About,
}, {
  path: '*',
  title: getPolyglotByLocale('en').t('not-found'),
  component: NotFound,
}]

export default config
