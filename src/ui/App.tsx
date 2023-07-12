/**
 * @file Client app root.
 */

import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, BrowserRouterProps, Route } from 'react-router-dom'
import { StaticRouter, StaticRouterProps } from 'react-router-dom/server'
import appConf from '../app.conf'
import I18nProvider, { I18nRoutes } from '../arch/providers/I18nProvider'
import LocalsProvider from '../arch/providers/LocalsProvider'
import getTranslations from '../arch/utils/getTranslations'
import useDebug from '../arch/utils/useDebug'
import routesConf from '../routes.conf'
import Footer from './components/Footer'
import Header from './components/Header'
import './styles/global.css'

type RouterType = 'browser' | 'static'

type Props<T extends RouterType> = {
  helmetContext?: Record<string, any>
  locals?: Record<string, any>
  routerProps?: T extends 'static' ? StaticRouterProps : BrowserRouterProps
  routerType?: T
}

const debug = useDebug()

export function mount(containerId = 'root') {
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
      <HelmetProvider context={helmetContext}>
        <LocalsProvider locals={locals}>
          <Router {...routerProps ?? {} as any} basename={appConf.basePath}>
            <I18nProvider defaultLocale={appConf.defaultLocale} translations={getTranslations()} changeLocaleStrategy={appConf.changeLocaleStrategy as any}>
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
            </I18nProvider>
          </Router>
        </LocalsProvider>
      </HelmetProvider>
    </React.StrictMode>
  )
}
