/**
 * @file Server entry file.
 */

import { generateLocalizedRoutes } from '@lib/i18n'
import { createMetadata, generateRobots, generateSitemap } from '@lib/seo'
import { renderToPipeableStream, type RenderToPipeableStreamOptions } from 'react-dom/server'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom/server'
import { BASE_PATH, BASE_URL, DESCRIPTION, MASK_ICON_COLOR, PUBLIC_URL, THEME_COLOR, TITLE } from './app.conf'
import { i18n } from './i18n.conf'
import { routes } from './routes.conf'
import { seo } from './seo.conf'
import { App } from './ui/App'

const localizedRoutes = generateLocalizedRoutes(routes, i18n)

export const robots = () => generateRobots(localizedRoutes, seo)

export const sitemap = () => generateSitemap(localizedRoutes, seo)

export const render = async (req: Request) => {
  const handler = createStaticHandler(localizedRoutes, { basename: BASE_PATH })
  const context = await handler.query(req)
  if (context instanceof Response) throw Error('Redirect response from static handler')

  const customMetadata = await createMetadata(context, { baseURL: BASE_URL, i18n, routes: localizedRoutes })

  return {
    metadata: {
      baseTitle: TITLE,
      description: DESCRIPTION,
      maskIconColor: MASK_ICON_COLOR,
      publicURL: PUBLIC_URL,
      themeColor: THEME_COLOR,
      title: TITLE,
      ...customMetadata,
    },
    stream: (options: RenderToPipeableStreamOptions) => renderToPipeableStream(
      (
        <App>
          <StaticRouterProvider context={context} router={createStaticRouter(handler.dataRoutes, context)}/>
        </App>
      ), options,
    ),
  }
}
