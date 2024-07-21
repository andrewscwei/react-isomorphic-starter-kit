/**
 * @file Edge entry file.
 */

import { type Metadata } from '@lib/dom/Metadata.js'
import { MetaProvider } from '@lib/dom/MetaProvider.js'
import { type RenderFunction } from '@lib/esr/RenderFunction.js'
import { generateLocalizedRoutes } from '@lib/i18n/index.js'
import { generateRobots, generateSitemap } from '@lib/seo/index.js'
import { renderToReadableStream } from 'react-dom/server'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom/server'
import { BASE_PATH, BASE_URL, METADATA } from './app.config.js'
import { i18n } from './i18n.config.js'
import { routes } from './routes.config.js'
import { seo } from './seo.config.js'
import { App } from './ui/App.js'

const localizedRoutes = generateLocalizedRoutes(routes, i18n)

export const robots = () => generateRobots(localizedRoutes, seo)

export const sitemap = () => generateSitemap(localizedRoutes, seo, {
  baseURL: BASE_URL,
  modifiedAt: new Date().toISOString(),
})

export const render: RenderFunction = async (req, metadata, options = {}) => {
  const handler = createStaticHandler(localizedRoutes, { basename: BASE_PATH })
  const context = await handler.query(req)

  if (context instanceof Response) throw context

  const defaultMetadata: Metadata = {
    ...METADATA,
    baseURL: BASE_URL,
    url: BASE_URL,
  }

  return renderToReadableStream(
    (
      <App>
        <MetaProvider context={metadata} default={defaultMetadata}>
          <StaticRouterProvider context={context} router={createStaticRouter(handler.dataRoutes, context)}/>
        </MetaProvider>
      </App>
    ), options,
  )
}
