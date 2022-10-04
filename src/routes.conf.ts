/**
 * @file Route definitions for React router.
 */

import { ComponentType } from 'react'
import Quote from './containers/Quote'
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
  component: Quote,
  path: '/quote',
  title: getPolyglotByLocale('en').t('window-title-quote'),
}, {
  component: Home,
  path: '/ja',
  title: getPolyglotByLocale('ja').t('window-title-home'),
}, {
  component: Quote,
  path: '/ja/quote',
  title: getPolyglotByLocale('ja').t('window-title-quote'),
}, {
  component: NotFound,
  path: '*',
  title: getPolyglotByLocale('en').t('window-title-not-found'),
}]

export default config
