/**
 * @file Route definitions for React router.
 */

import { ComponentType } from 'react'
import About from './containers/About'
import Home from './containers/Home'
import NotFound from './containers/NotFound'
import { getPolyglotByLocale } from './utils/i18n'

export type RouteConfig = {
  component: ComponentType<any>
  path: string
  title?: string
}

const config: RouteConfig[] = [{
  component: Home,
  path: '/',
  title: getPolyglotByLocale('en').t('window-title-home'),
}, {
  component: About,
  path: '/about',
  title: getPolyglotByLocale('en').t('window-title-about'),
}, {
  component: Home,
  path: '/ja',
  title: getPolyglotByLocale('ja').t('window-title-home'),
}, {
  component: About,
  path: '/ja/about',
  title: getPolyglotByLocale('ja').t('window-title-about'),
}, {
  component: NotFound,
  path: '*',
  title: getPolyglotByLocale('en').t('window-title-not-found'),
}]

export default config
