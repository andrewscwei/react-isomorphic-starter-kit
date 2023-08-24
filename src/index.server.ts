/**
 * @file Server entry file.
 */

import { createServer } from '../lib/server'
import { I18N, PORT } from './app.conf'
import routesConf from './routes.conf'
import Layout from './templates/Layout'
import App from './ui/App'

export default createServer({
  layoutComponent: Layout,
  rootComponent: App,
  routes: routesConf,
  i18n: I18N,
  port: process.env.NODE_ENV === 'test' ? undefined : PORT,
})
