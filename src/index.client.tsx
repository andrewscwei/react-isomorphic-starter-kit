/**
 * @file Client entry file.
 */

import React from 'react'
import { RouterProvider } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'
import { initClient } from '../lib/dom'
import { BASE_PATH } from './app.conf'
import i18nConf from './i18n.conf'
import routesConf from './routes.conf'
import App from './ui/App'

export default initClient(({ routes }) => (
  <App>
    <RouterProvider router={createBrowserRouter(routes, { basename: BASE_PATH })}/>
  </App>
), { i18n: i18nConf, routes: routesConf })
