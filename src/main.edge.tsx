/**
 * @file Edge entry file.
 */

import { MetaProvider } from '@lib/dom/index.js'
import { type Module } from '@lib/esr/index.js'
import { generateLocalizedRoutes } from '@lib/i18n/index.js'
import { generateRobots, generateSitemap } from '@lib/seo/index.js'
import { renderToReadableStream } from 'react-dom/server'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router'
import { BASE_PATH, BASE_URL, BUILD_TIME, DEFAULT_METADATA } from './app.config.js'
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

  return renderToReadableStream(
    (
      <App>
        <MetaProvider current={metadata} default={DEFAULT_METADATA}>
          <StaticRouterProvider context={context} router={createStaticRouter(handler.dataRoutes, context)}/>
        </MetaProvider>
      </App>
    ), options,
  )
}
