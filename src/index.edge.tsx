/**
 * @file Server entry file.
 */

import React from 'react'
import { StaticRouterProvider, createStaticRouter } from 'react-router-dom/server'
import { renderRoot } from '../lib/edge'
import { generateLocalizedRoutes } from '../lib/i18n'
import { DESCRIPTION, MASK_ICON_COLOR, THEME_COLOR, TITLE } from './app.conf'
import i18nConf from './i18n.conf'
import routesConf from './routes.conf'
import App from './ui/App'

export const handleRoot = renderRoot(({ context, routes }) => (
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
  routes: generateLocalizedRoutes(routesConf, i18nConf),
  i18n: i18nConf,
})
