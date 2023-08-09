/**
 * @file Client app root.
 */

import React, { StrictMode, Suspense, lazy } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Route } from 'react-router-dom'
import { StaticRouter } from 'react-router-dom/server'
import { BASE_PATH, DEFAULT_LOCALE, LOCALE_CHANGE_STRATEGY } from '../app.conf'
import I18nProvider, { I18nRoutes } from '../base/providers/I18nProvider'
import LocalsProvider from '../base/providers/LocalsProvider'
import translations from '../locales'
import routesConf from '../routes.conf'
import './styles/global.css'
import './styles/theme.css'

const Footer = lazy(() => import('./components/Footer'))
const Header = lazy(() => import('./components/Header'))

export default function App<T extends RouterType = 'browser'>({
  helmetContext = {},
  locals = window.__LOCALS__ ?? {},
  routerProps,
  routerType,
}: RootComponentProps<T>) {
  const Router = routerType === 'static' ? StaticRouter : BrowserRouter

  return (
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <LocalsProvider locals={locals}>
          <Router {...routerProps ?? {} as any} basename={BASE_PATH}>
            <I18nProvider defaultLocale={DEFAULT_LOCALE} translations={translations} changeLocaleStrategy={LOCALE_CHANGE_STRATEGY as any}>
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
          </Router>
        </LocalsProvider>
      </HelmetProvider>
    </StrictMode>
  )
}
