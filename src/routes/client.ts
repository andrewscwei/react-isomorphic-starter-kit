/**
 * @file Route definitions for React router.
 */

import About from '../containers/About';
import Home from '../containers/Home';
import NotFound from '../containers/NotFound';
import { getPolyglotByLocale } from '../utils/i18n';

export function getLocaleFromPath(path: string): string {
  const locales = __I18N_CONFIG__.locales;
  const possibleLocale = path.split('/')[1];

  if (~locales.indexOf(possibleLocale)) {
    return possibleLocale;
  }
  else {
    return locales[0];
  }
}

export function getLocalizedPath(path: string, locale: string = __I18N_CONFIG__.defaultLocale): string {
  const t = path.split('/').filter((v) => v);

  if (t.length > 0 && __I18N_CONFIG__.locales.indexOf(t[0]) >= 0) {
    t.shift();
  }

  switch (locale) {
  case __I18N_CONFIG__.defaultLocale:
    return `/${t.join('/')}`;
  default:
    return `/${locale}/${t.join('/')}`;
  }
}

export default [{
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
}];
