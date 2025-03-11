/**
 * @file Server entry file.
 */

import { MetaProvider } from '@lib/meta'
import { generateSitemap } from '@lib/sitemap'
import { type RenderFunction, type SitemapProvider } from '@lib/ssr'
import { renderToPipeableStream } from 'react-dom/server'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router'
import { BASE_PATH, BASE_URL, BUILD_TIME } from './app.config.js'
import { routes } from './routes.config.js'
import { App } from './ui/App.js'

export const sitemap: SitemapProvider = async req => generateSitemap(routes, {
  hostname: BASE_URL,
  updatedAt: BUILD_TIME,
})

export const render: RenderFunction = async (req, metadata, options) => {
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
