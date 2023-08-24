/**
 * @file Client entry file.
 */

import React from 'react'
import { RouterProvider } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'
import { initClient } from '../lib/dom'
import i18nConf from './i18n.conf'
import routesConf from './routes.conf'
import App from './ui/App'

export default initClient(({ routes }) => (
  <App>
    <RouterProvider router={createBrowserRouter(routes, { basename: __BUILD_ARGS__.basePath })}/>
  </App>
), {
  i18n: i18nConf,
  routes: routesConf,
})
