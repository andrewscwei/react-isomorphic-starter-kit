/**
 * @file Client app root.
 */

import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { Route, Routes } from 'react-router'
import { BrowserRouter, BrowserRouterProps } from 'react-router-dom'
import { StaticRouter, StaticRouterProps } from 'react-router-dom/server'
import translations from '../locales'
import routesConf from '../routes.conf'
import Footer from './components/Footer'
import Header from './components/Header'
import { I18nRouterProvider } from './providers/i18n'
import './styles/global.css'

type RouterType = 'browser' | 'static'

type Props<T extends RouterType> = {
  helmetContext?: Record<string, any>
  routerProps?: T extends 'static' ? StaticRouterProps : BrowserRouterProps
  routerType?: T
}

export default function App<T extends RouterType = 'browser'>({
  helmetContext = {},
  routerProps,
  routerType,
}: Props<T>) {
  const RouterComponent = routerType === 'static' ? StaticRouter : BrowserRouter

  return (
    <RouterComponent {...routerProps ?? {} as any}>
      <I18nRouterProvider defaultLocale={'en'} translations={translations}>
        <HelmetProvider context={helmetContext}>
          <Header/>
          <Routes>
            {routesConf.map((route, index) => (
              <Route path={route.path} key={`route-${index}`} element={<route.component/>}/>
            ))}
          </Routes>
          <Footer/>
        </HelmetProvider>
      </I18nRouterProvider>
    </RouterComponent>
  )
}
