/**
 * @file Server entry file.
 */

import { MetaProvider } from '@lib/meta'
import { generateSitemap } from '@lib/seo'
import { type Module } from '@lib/ssr'
import { renderToPipeableStream } from 'react-dom/server'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router'
import { BASE_PATH } from './app.config.js'
import { routes } from './routes.config.js'
import { seo } from './seo.config.js'
import { App } from './ui/App.js'

export const sitemap: Module['sitemap'] = () => generateSitemap(routes, seo)

export const render: Module['render'] = async (req, metadata, options) => {
  const handler = createStaticHandler(routes, { basename: BASE_PATH })
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
