/**
 * @file Server entry file.
 */

import { generateLocalizedRoutes } from '@lib/i18n'
import { MetaProvider } from '@lib/meta'
import { generateRobots, generateSitemap } from '@lib/seo'
import { type Module } from '@lib/ssr'
import { renderToPipeableStream } from 'react-dom/server'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router'
import { BASE_PATH, BASE_URL, BUILD_TIME } from './app.config.js'
import { i18n } from './i18n.config.js'
import { routes } from './routes.config.js'
import { seo } from './seo.config.js'
import { App } from './ui/App.js'

const localizedRoutes = generateLocalizedRoutes(routes, i18n)

export const robots: Module['robots'] = () => generateRobots(localizedRoutes, seo)

export const sitemap: Module['sitemap'] = () => generateSitemap(localizedRoutes, seo, {
  baseURL: BASE_URL,
  modifiedAt: BUILD_TIME,
})

export const render: Module['render'] = async (req, metadata, options = {}) => {
  const handler = createStaticHandler(localizedRoutes, { basename: BASE_PATH })
  const context = await handler.query(req)

  if (context instanceof Response) throw context

  return renderToPipeableStream(
    (
      <App>
        <MetaProvider metadata={metadata}>
          <StaticRouterProvider context={context} router={createStaticRouter(handler.dataRoutes, context)}/>
        </MetaProvider>
      </App>
    ), options,
  )
}
