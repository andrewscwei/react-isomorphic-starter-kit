/**
 * @file Edge entry file.
 */

import { type RenderFunction, type SitemapOptions } from '@lib/esr'
import { MetaProvider } from '@lib/meta'
import { renderToReadableStream } from 'react-dom/server'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router'

import { BASE_PATH, BASE_URL, BUILD_TIME } from '@/app.config.js'
import { App } from '@/App.js'
import { routes } from '@/routes.config.js'

export const sitemap: SitemapOptions = {
  hostname: BASE_URL,
  routes,
  updatedAt: BUILD_TIME,
}

export const render: RenderFunction = async (req, context, options) => {
  const handler = createStaticHandler(routes, { basename: BASE_PATH })
  const handlerContext = await handler.query(req)

  if (handlerContext instanceof Response) throw handlerContext

  return renderToReadableStream(
    (
      <App>
        <MetaProvider metadata={context.metadata}>
          <StaticRouterProvider context={handlerContext} router={createStaticRouter(handler.dataRoutes, handlerContext)}/>
        </MetaProvider>
      </App>
    ), options,
  )
}
