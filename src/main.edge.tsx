/**
 * @file Edge entry file.
 */

import { type Module } from '@lib/esr'
import { MetaProvider } from '@lib/meta'
import { generateRobots, generateSitemap } from '@lib/seo'
import { renderToReadableStream } from 'react-dom/server'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router'
import { BASE_PATH, BASE_URL, BUILD_TIME } from './app.config.js'
import { routes } from './routes.config.js'
import { seo } from './seo.config.js'
import { App } from './ui/App.js'

export const robots: Module['robots'] = () => generateRobots(routes, seo)

export const sitemap: Module['sitemap'] = () => generateSitemap(routes, seo, {
  baseURL: BASE_URL,
  modifiedAt: BUILD_TIME,
})

export const localData: Module['localData'] = async req => ({})

export const render: Module['render'] = async (req, metadata, options = {}) => {
  const handler = createStaticHandler(routes, { basename: BASE_PATH })
  const context = await handler.query(req)

  if (context instanceof Response) throw context

  return renderToReadableStream(
    (
      <App>
        <MetaProvider metadata={metadata}>
          <StaticRouterProvider context={context} router={createStaticRouter(handler.dataRoutes, context)}/>
        </MetaProvider>
      </App>
    ), options,
  )
}
