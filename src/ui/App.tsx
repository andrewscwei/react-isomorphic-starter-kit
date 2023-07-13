/**
 * @file Client app root.
 */

import React, { Suspense } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, BrowserRouterProps, Route } from 'react-router-dom'
import { StaticRouter, StaticRouterProps } from 'react-router-dom/server'
import appConf from '../app.conf'
import I18nProvider, { I18nRoutes } from '../framework/providers/I18nProvider'
import LocalsProvider from '../framework/providers/LocalsProvider'
import translations from '../locales'
import routesConf from '../routes.conf'
import './styles/global.css'
import './styles/theme.css'

type RouterType = 'browser' | 'static'

type Props<T extends RouterType> = {
  helmetContext?: Record<string, any>
  locals?: Record<string, any>
  routerProps?: T extends 'static' ? StaticRouterProps : BrowserRouterProps
  routerType?: T
}

const Footer = React.lazy(() => import('./components/Footer'))
const Header = React.lazy(() => import('./components/Header'))

export default function App<T extends RouterType = 'browser'>({
  helmetContext = {},
  locals = window.__LOCALS__ ?? {},
  routerProps,
  routerType,
}: Props<T>) {
  const Router = routerType === 'static' ? StaticRouter : BrowserRouter

  return (
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <LocalsProvider locals={locals}>
          <Router {...routerProps ?? {} as any} basename={appConf.basePath}>
            <I18nProvider defaultLocale={appConf.defaultLocale} translations={translations} changeLocaleStrategy={appConf.changeLocaleStrategy as any}>
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
    </React.StrictMode>
  )
}
