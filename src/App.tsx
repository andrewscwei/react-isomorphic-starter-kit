/**
 * @file Client app root.
 */

import React from 'react'
import { Route, Routes } from 'react-router'
import Footer from './components/Footer'
import Header from './components/Header'
import routesConf from './routes.conf'

export default function App() {
  return (
    <>
      <Header/>
      <Routes>
        {routesConf.map((route, index) => (
          <Route path={route.path} key={`route-${index}`} element={<route.component/>}/>
        ))}
      </Routes>
      <Footer/>
    </>
  )
}
