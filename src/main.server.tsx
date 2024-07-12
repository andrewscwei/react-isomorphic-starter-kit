/**
 * @file Server entry file.
 */

import { generateLocalizedRoutes } from '@lib/i18n'
import { createMetadata, type Metadata } from '@lib/layouts'
import { type RenderFunction } from '@lib/server'
import { renderToPipeableStream } from 'react-dom/server'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom/server'
import { BASE_PATH, BASE_URL, DESCRIPTION, MASK_ICON_COLOR, THEME_COLOR, TITLE } from './app.conf'
import { i18n } from './i18n.conf'
import { routes } from './routes.conf'
import { App } from './ui/App'

const localizedRoutes = generateLocalizedRoutes(routes, i18n)
const handler = createStaticHandler(localizedRoutes, { basename: BASE_PATH })

export const metadata = async (req: Request): Promise<Metadata> => {
  const context = await handler.query(req)
  if (context instanceof Response) throw Error('Redirect response from static handler')

  const customMetadata = await createMetadata(context, { baseURL: BASE_URL, i18n, routes: localizedRoutes })

  return {
    baseTitle: TITLE,
    description: DESCRIPTION,
    maskIconColor: MASK_ICON_COLOR,
    themeColor: THEME_COLOR,
    title: TITLE,
    ...customMetadata,
  }
}

export const render: RenderFunction = async (req, options) => {
  const context = await handler.query(req)
  if (context instanceof Response) throw Error('Redirect response from static handler')

  return renderToPipeableStream(
    (
      <App>
        <StaticRouterProvider context={context} router={createStaticRouter(handler.dataRoutes, context)}/>
      </App>
    ), options,
  )
}
