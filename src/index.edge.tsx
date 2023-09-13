/**
 * @file Edge entry file.
 */

import React from 'react'
import { StaticRouterProvider, createStaticRouter } from 'react-router-dom/server'
import { renderRoot, serveRobots, serveSitemap } from '../lib/edge'
import { generateLocalizedRoutes } from '../lib/i18n'
import { DESCRIPTION, MASK_ICON_COLOR, THEME_COLOR, TITLE } from './app.conf'
import { config as i18nConf } from './i18n.conf'
import { config as routesConf } from './routes.conf'
import { config as seoConf } from './seo.conf'
import { App } from './ui/App'

const localizedRoutes = generateLocalizedRoutes(routesConf, i18nConf)

export const handleRobots = serveRobots({ routes: localizedRoutes, seo: seoConf })

export const handleSitemap = serveSitemap({ routes: localizedRoutes, seo: seoConf })

export const handleRoot = renderRoot(({ context, routes }) => (
  <App>
    <StaticRouterProvider router={createStaticRouter(routes, context)} context={context}/>
  </App>
), {
  i18n: i18nConf,
  metadata: {
    description: DESCRIPTION,
    maskIconColor: MASK_ICON_COLOR,
    themeColor: THEME_COLOR,
    title: TITLE,
  },
  routes: localizedRoutes,
})
