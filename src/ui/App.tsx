/**
 * @file Client app root.
 */

import React, { StrictMode, Suspense, lazy } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { StaticRouter } from 'react-router-dom/server'
import { LocalsProvider, useFavicon, useThemeColor } from '../../lib/dom'
import { I18nProvider, I18nRoutes } from '../../lib/i18n'
import { joinURL } from '../../lib/utils'
import { BASE_PATH, DEFAULT_LOCALE, LOCALE_CHANGE_STRATEGY, MASK_ICON_COLOR, PUBLIC_PATH, THEME_COLOR } from '../app.conf'
import translations from '../locales'
import routesConf from '../routes.conf'
import './styles/global.css'
import './styles/theme.css'

const Footer = lazy(() => import('./components/Footer'))
const Header = lazy(() => import('./components/Header'))

export default function App({
  locals,
  staticURL,
}: RootComponentProps) {
  useThemeColor(THEME_COLOR)

  useFavicon({
    maskIcon: {
      color: MASK_ICON_COLOR,
    },
    icon: {
      darkImage: joinURL(PUBLIC_PATH, 'favicon-dark.svg'),
    },
    alternateIcon: {
      darkImage: joinURL(PUBLIC_PATH, 'favicon-dark.png'),
    },
  })

  const renderRouter = (children: JSX.Element) => staticURL
    ? <StaticRouter location={staticURL} basename={BASE_PATH}>{children}</StaticRouter>
    : <BrowserRouter basename={BASE_PATH}>{children}</BrowserRouter>

  return (
    <StrictMode>
      <LocalsProvider locals={locals}>
        {renderRouter(
          <I18nProvider defaultLocale={DEFAULT_LOCALE} translations={translations} localeChangeStrategy={LOCALE_CHANGE_STRATEGY}>
            <Suspense>
              <Header/>
            </Suspense>
            <Suspense>
              <I18nRoutes>
                {routesConf.map(config => {
                  const path = config.path.startsWith('/') ? config.path.substring(1) : config.path
                  const isIndex = path === ''

                  return (
                    <Route key={path} index={isIndex} path={isIndex ? undefined : path} element={<config.component/>}/>
                  )
                })}
              </I18nRoutes>
            </Suspense>
            <Suspense>
              <Footer/>
            </Suspense>
          </I18nProvider>
        )}
      </LocalsProvider>
    </StrictMode>
  )
}
