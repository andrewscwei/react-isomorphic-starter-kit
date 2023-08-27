/**
 * @file Server entry file.
 */

import React from 'react'
import { renderToReadableStream } from 'react-dom/server'
import { StaticRouterProvider, createStaticHandler, createStaticRouter } from 'react-router-dom/server'
import { generateLocalizedRoutes } from '../lib/i18n'
import { createMetadata, createResolveAssetPath } from '../lib/server/helpers'
import { Layout } from '../lib/templates'
import { DESCRIPTION, MASK_ICON_COLOR, THEME_COLOR, TITLE } from './app.conf'
import i18nConf from './i18n.conf'
import routesConf from './routes.conf'
import App from './ui/App'

const { basePath, baseURL, publicPath } = __BUILD_ARGS__

export default async function renderRoot(request: Request, path: string): Promise<Response> {
  const routes = generateLocalizedRoutes(routesConf, i18nConf)
  const handler = createStaticHandler(routes, { basename: basePath })
  const context = await handler.query(request)

  if (context instanceof Response) return context

  const resolveAssetPath = createResolveAssetPath({ publicPath, manifest: __ASSET_MANIFEST__ })
  const metadata = {
    baseTitle: TITLE,
    description: DESCRIPTION,
    maskIconColor: MASK_ICON_COLOR,
    themeColor: THEME_COLOR,
    title: TITLE,
    ...await createMetadata(path, { baseURL, i18n: i18nConf, routes }),
  }

  const root = (
    <Layout injectStyles={true} metadata={metadata} resolveAssetPath={resolveAssetPath}>
      <App>
        <StaticRouterProvider router={createStaticRouter(handler.dataRoutes, context)} context={context}/>
      </App>
    </Layout>
  )

  const stream = await renderToReadableStream(root)

  await stream.allReady

  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  })
}
