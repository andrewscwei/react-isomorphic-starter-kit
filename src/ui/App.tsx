/**
 * @file Client app root.
 */

import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { Route } from 'react-router'
import { BrowserRouter, BrowserRouterProps } from 'react-router-dom'
import { StaticRouter, StaticRouterProps } from 'react-router-dom/server'
import appConf from '../app.conf'
import routesConf from '../routes.conf'
import Footer from './components/Footer'
import Header from './components/Header'
import translations from './locales'
import { I18nRouterProvider } from './providers/i18n'
import { I18nRoutes } from './providers/i18n/I18nRouterProvider'
import { LocalsProvider } from './providers/locals'
import './styles/global.css'

type RouterType = 'browser' | 'static'

type Props<T extends RouterType> = {
  helmetContext?: Record<string, any>
  locals?: Record<string, any>
  routerProps?: T extends 'static' ? StaticRouterProps : BrowserRouterProps
  routerType?: T
}

export default function App<T extends RouterType = 'browser'>({
  helmetContext = {},
  locals,
  routerProps,
  routerType,
}: Props<T>) {
  const Router = routerType === 'static' ? StaticRouter : BrowserRouter

  return (
    <React.StrictMode>
      <LocalsProvider locals={locals}>
        <Router {...routerProps ?? {} as any}>
          <I18nRouterProvider defaultLocale={appConf.defaultLocale} translations={translations}>
            <HelmetProvider context={helmetContext}>
              <Header/>
              <I18nRoutes>
                {routesConf.map(config => {
                  const path = config.path.startsWith('/') ? config.path.substring(1) : config.path
                  const isIndex = path === ''

                  return (
                    <Route key={path} index={isIndex} path={isIndex ? undefined : path} element={<config.component/>}/>
                  )
                })}
              </I18nRoutes>
              <Footer/>
            </HelmetProvider>
          </I18nRouterProvider>
        </Router>
      </LocalsProvider>
    </React.StrictMode>
  )
}
