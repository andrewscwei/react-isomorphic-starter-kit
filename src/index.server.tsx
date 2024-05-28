/**
 * @file Server entry file.
 */

import { initServer } from '@lib/server'
import React from 'react'
import { StaticRouterProvider, createStaticRouter } from 'react-router-dom/server'
import { DESCRIPTION, MASK_ICON_COLOR, THEME_COLOR, TITLE } from './app.conf'
import { config as i18nConf } from './i18n.conf'
import { config as routesConf } from './routes.conf'
import { config as seoConf } from './seo.conf'
import { App } from './ui/App'

export const server = initServer(({ context, routes }) => (
  <App>
    <StaticRouterProvider context={context} router={createStaticRouter(routes, context)}/>
  </App>
), {
  i18n: i18nConf,
  metadata: {
    description: DESCRIPTION,
    maskIconColor: MASK_ICON_COLOR,
    themeColor: THEME_COLOR,
    title: TITLE,
  },
  routes: routesConf,
  seo: seoConf,
})
