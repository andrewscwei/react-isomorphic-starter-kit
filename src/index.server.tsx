/**
 * @file Server entry file.
 */

import React from 'react'
import { StaticRouterProvider, createStaticRouter } from 'react-router-dom/server'
import { initServer } from '../lib/server'
import { DESCRIPTION, MASK_ICON_COLOR, THEME_COLOR, TITLE } from './app.conf'
import i18nConf from './i18n.conf'
import routesConf from './routes.conf'
import sitemapConf from './sitemap.conf'
import App from './ui/App'

export default initServer(({ context, routes }) => (
  <App>
    <StaticRouterProvider router={createStaticRouter(routes, context)} context={context}/>
  </App>
), {
  defaultMetadata: {
    description: DESCRIPTION,
    maskIconColor: MASK_ICON_COLOR,
    themeColor: THEME_COLOR,
    title: TITLE,
  },
  i18n: i18nConf,
  routes: routesConf,
  sitemap: sitemapConf,
})
