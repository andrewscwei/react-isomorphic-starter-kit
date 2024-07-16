/**
 * @file Server entry file.
 */

import { type Metadata } from '@lib/dom/Metadata.js'
import { MetaProvider } from '@lib/dom/MetaProvider.js'
import { generateLocalizedRoutes } from '@lib/i18n/index.js'
import { generateRobots, generateSitemap } from '@lib/seo/index.js'
import { renderToPipeableStream, type RenderToPipeableStreamOptions } from 'react-dom/server'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom/server'
import { BASE_PATH, BASE_URL, DESCRIPTION, MASK_ICON_COLOR, THEME_COLOR, TITLE } from './app.conf.js'
import { i18n } from './i18n.conf.js'
import { routes } from './routes.conf.js'
import { seo } from './seo.conf.js'
import { App } from './ui/App.js'

const localizedRoutes = generateLocalizedRoutes(routes, i18n)

export const robots = () => generateRobots(localizedRoutes, seo)

export const sitemap = () => generateSitemap(localizedRoutes, seo, {
  baseURL: BASE_URL,
  modifiedAt: new Date().toISOString(),
})

export const render = async (req: Request, metadata?: Metadata, options: RenderToPipeableStreamOptions = {}) => {
  const handler = createStaticHandler(localizedRoutes, { basename: BASE_PATH })
  const context = await handler.query(req)

  if (context instanceof Response) throw context

  const defaultMetadata: Metadata = {
    baseTitle: TITLE,
    baseURL: BASE_URL,
    description: DESCRIPTION,
    maskIconColor: MASK_ICON_COLOR,
    themeColor: THEME_COLOR,
    title: TITLE,
    url: BASE_URL,
  }

  return renderToPipeableStream(
    (
      <App>
        <MetaProvider context={metadata} default={defaultMetadata}>
          <StaticRouterProvider context={context} router={createStaticRouter(handler.dataRoutes, context)}/>
        </MetaProvider>
      </App>
    ), options,
  )
}
