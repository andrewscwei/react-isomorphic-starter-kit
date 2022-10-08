/**
 * @file Client app root.
 */

import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { Route, Routes } from 'react-router'
import translations from '../locales'
import routesConf from '../routes.conf'
import Footer from './components/Footer'
import Header from './components/Header'
import { I18nRouterProvider } from './providers/i18n'
import './styles/global.css'

export default function App() {
  return (
    <>
      <HelmetProvider>
        <I18nRouterProvider defaultLocale={'en'} translations={translations}>
          <Header/>
          <Routes>
            {routesConf.map((route, index) => (
              <Route path={route.path} key={`route-${index}`} element={<route.component/>}/>
            ))}
          </Routes>
          <Footer/>
        </I18nRouterProvider>
      </HelmetProvider>
    </>
  )
}
