/**
 * @file Server entry file.
 */

import { MetaProvider } from '@lib/meta'
import { type RenderFunction, type SitemapOptions } from '@lib/ssr'
import { renderToPipeableStream } from 'react-dom/server'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router'
import { BASE_PATH, BASE_URL, BUILD_TIME } from './app.config.js'
import { App } from './App.js'
import { routes } from './routes.config.js'

export const sitemap: SitemapOptions = {
  routes,
  hostname: BASE_URL,
  updatedAt: BUILD_TIME,
}

export const render: RenderFunction = async (req, context, options) => {
  const handler = createStaticHandler(routes, { basename: BASE_PATH })
  const handlerContext = await handler.query(req)

  if (handlerContext instanceof Response) throw handlerContext

  return renderToPipeableStream(
    (
      <App>
        <MetaProvider metadata={context.metadata}>
          <StaticRouterProvider context={handlerContext} router={createStaticRouter(handler.dataRoutes, handlerContext)}/>
        </MetaProvider>
      </App>
    ), options,
  )
}
