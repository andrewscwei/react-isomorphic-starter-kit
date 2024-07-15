/**
 * @file Server entry file.
 */

import { generateLocalizedRoutes } from '@lib/i18n/index.js'
import { generateMetadata, generateRobots, generateSitemap } from '@lib/seo/index.js'
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

export const render = async (req: Request) => {
  const handler = createStaticHandler(localizedRoutes, { basename: BASE_PATH })
  const context = await handler.query(req)
  if (context instanceof Response) throw Error('Redirect response from static handler')

  const metadata = await generateMetadata(context, { baseURL: BASE_URL, i18n, routes: localizedRoutes })

  return {
    metadata: {
      baseTitle: TITLE,
      baseURL: BASE_URL,
      description: DESCRIPTION,
      maskIconColor: MASK_ICON_COLOR,
      themeColor: THEME_COLOR,
      title: TITLE,
      ...metadata,
    },
    stream: (options: RenderToPipeableStreamOptions = {}) => renderToPipeableStream(
      (
        <App>
          <StaticRouterProvider context={context} router={createStaticRouter(handler.dataRoutes, context)}/>
        </App>
      ), options,
    ),
  }
}
