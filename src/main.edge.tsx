/**
 * @file Edge entry file.
 */

import { generateLocalizedRoutes } from '@lib/i18n/index.js'
import { generateMetadata, generateRobots, generateSitemap } from '@lib/seo/index.js'
import { renderToReadableStream, type RenderToReadableStreamOptions } from 'react-dom/server'
import { StaticRouterProvider, createStaticHandler, createStaticRouter } from 'react-router-dom/server'
import { BASE_PATH, BASE_URL, DESCRIPTION, MASK_ICON_COLOR, THEME_COLOR, TITLE } from './app.conf.js'
import { i18n } from './i18n.conf.js'
import { routes as routesConfig } from './routes.conf.js'
import { seo } from './seo.conf.js'
import { App } from './ui/App.js'

const localizedRoutes = generateLocalizedRoutes(routesConfig, i18n)

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
    stream: (options: RenderToReadableStreamOptions = {}) => renderToReadableStream(
      (
        <App>
          <StaticRouterProvider context={context} router={createStaticRouter(handler.dataRoutes, context)}/>
        </App>
      ), options,
    ),
  }
}
