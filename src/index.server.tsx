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

const isDev = process.env.NODE_ENV === 'development'
const isTest = process.env.NODE_ENV === 'test'

export default initServer(({ routes, context, metadata, resolveAssetPath }) => (
  <Layout injectScripts={!isDev} metadata={metadata} resolveAssetPath={resolveAssetPath}>
    <App>
      {!isDev && <StaticRouterProvider router={createStaticRouter(routes, context)} context={context}/>}
    </App>
  </Layout>
), { i18n: i18nConf, routes: routesConf, port: isTest ? undefined : PORT })
