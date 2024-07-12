/**
 * @file Edge entry file.
 */

import { renderRoot, serveRobots, serveSitemap } from '@lib/edge'
import { generateLocalizedRoutes } from '@lib/i18n'
import { StaticRouterProvider, createStaticRouter } from 'react-router-dom/server'
import { DESCRIPTION, MASK_ICON_COLOR, THEME_COLOR, TITLE } from './app.conf'
import { i18n } from './i18n.conf'
import { routes as routesConfig } from './routes.conf'
import { seo } from './seo.conf'
import { App } from './ui/App'

const localizedRoutes = generateLocalizedRoutes(routesConfig, i18n)

export const handleRobots = serveRobots({ routes: localizedRoutes, seo })

export const handleSitemap = serveSitemap({ routes: localizedRoutes, seo })

export const handleRoot = renderRoot(({ context, routes }) => (
  <App>
    <StaticRouterProvider context={context} router={createStaticRouter(routes, context)}/>
  </App>
), {
  i18n,
  metadata: {
    description: DESCRIPTION,
    maskIconColor: MASK_ICON_COLOR,
    themeColor: THEME_COLOR,
    title: TITLE,
  },
  routes: localizedRoutes,
})
