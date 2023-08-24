/**
 * @file Server entry file.
 */

import React from 'react'
import { StaticRouterProvider, createStaticRouter } from 'react-router-dom/server'
import { initServer } from '../lib/server'
import { PORT } from './app.conf'
import i18nConf from './i18n.conf'
import routesConf from './routes.conf'
import Layout from './templates/Layout'
import App from './ui/App'

export default initServer(({ context, routes }) => (
  <App>
    <StaticRouterProvider router={createStaticRouter(routes, context)} context={context}/>
  </App>
), { i18n: i18nConf, layout: Layout, routes: routesConf, port: PORT })
