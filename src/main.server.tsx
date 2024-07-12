/**
 * @file Server entry file.
 */

import { generateLocalizedRoutes } from '@lib/i18n'
import { type RenderFunction } from '@lib/server'
import { renderToPipeableStream } from 'react-dom/server'
import { StaticRouterProvider, createStaticHandler, createStaticRouter } from 'react-router-dom/server'
import { BASE_PATH } from './app.conf'
import { i18n } from './i18n.conf'
import { routes } from './routes.conf'
import { App } from './ui/App'

const localizedRoutes = generateLocalizedRoutes(routes, i18n)
const handler = createStaticHandler(localizedRoutes, { basename: BASE_PATH })

export const render: RenderFunction = async (req, options) => {
  const context = await handler.query(req)
  if (context instanceof Response) throw Error('Redirect response from static handler')

  // const customMetadata = await createMetadata(context, { baseURL: BASE_URL, i18n, routes: localizedRoutes })

  return renderToPipeableStream(
    (
      <App>
        <StaticRouterProvider context={context} router={createStaticRouter(handler.dataRoutes, context)}/>
      </App>
    ), options,
  )
}
