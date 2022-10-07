/**
 * @file Client app root.
 */

import React from 'react'
import { Route, Routes } from 'react-router'
import Footer from './components/Footer'
import Header from './components/Header'
import translations from './locales'
import { I18nRouterProvider } from './providers/i18n'
import routesConf from './routes.conf'
import './styles/global.css'

export default function App() {
  return (
    <>
      <I18nRouterProvider defaultLocale={'en'} translations={translations}>
        <Header/>
        <Routes>
          {routesConf.map((route, index) => (
            <Route path={route.path} key={`route-${index}`} element={<route.component/>}/>
          ))}
        </Routes>
        <Footer/>
      </I18nRouterProvider>
    </>
  )
}
