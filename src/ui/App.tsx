/**
 * @file Client app root.
 */

import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, BrowserRouterProps, Route } from 'react-router-dom'
import { StaticRouter, StaticRouterProps } from 'react-router-dom/server'
import appConf from '../app.conf'
import routesConf from '../routes.conf'
import useDebug from '../utils/useDebug'
import Footer from './components/Footer'
import Header from './components/Header'
import translations from './locales'
import I18nProvider, { I18nRoutes } from './providers/I18nProvider'
import LocalsProvider from './providers/LocalsProvider'
import './styles/global.css'

type RouterType = 'browser' | 'static'

type Props<T extends RouterType> = {
  helmetContext?: Record<string, any>
  locals?: Record<string, any>
  routerProps?: T extends 'static' ? StaticRouterProps : BrowserRouterProps
  routerType?: T
}

const debug = useDebug()

export function mount(containerId = 'app') {
  const container = document.getElementById(containerId)
  if (!container) return console.warn(`No container with ID <${containerId}> found`)

  const app = <App locals={window.__LOCALS__ ?? {}}/>

  if (process.env.NODE_ENV === 'development') {
    createRoot(container).render(app)
  }
  else {
    hydrateRoot(container, app)
  }

  debug('Mounting app...', 'OK')
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
          <I18nProvider defaultLocale={appConf.defaultLocale} translations={translations} changeLocaleStrategy={appConf.changeLocaleStrategy as any}>
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
          </I18nProvider>
        </Router>
      </LocalsProvider>
    </React.StrictMode>
  )
}
