/**
 * @file Server entry file.
 */

import path from 'path'
import React from 'react'
import { generateLocalizedRoutes } from '../lib/i18n'
import { createResolveAssetPath } from '../lib/server'
import i18nConf from './i18n.conf'
import routesConf from './routes.conf'
import App from './ui/App'

const { assetManifestFile, publicPath } = __BUILD_ARGS__

export default async function renderRoot() {
  const routes = generateLocalizedRoutes(routesConf, i18nConf)

  // const handler = createStaticHandler(routes, { basename: basePath })
  // const context = await handler.query(createFetchRequest(req))

  // if (context instanceof Response) return res.redirect(context.status, context.headers.get('Location') ?? '')

  const resolveAssetPath = createResolveAssetPath({ publicPath, manifestFile: path.join(__dirname, assetManifestFile) })
  // const metadata = await createMetadata(req, { baseURL, i18n })
  const root = (
    <App>
      {/* <StaticRouterProvider router={createStaticRouter(routes, context)} context={context}/> */}
    </App>
  )

  // const layout = createElement(Layout, {
  //   injectStyles: true,
  //   metadata: {
  //     baseTitle: TITLE,
  //     description: DESCRIPTION,
  //     maskIconColor: MASK_ICON_COLOR,
  //     themeColor: THEME_COLOR,
  //     title: TITLE,
  //     // ...metadata,
  //   },
  //   resolveAssetPath,
  // }, root)

  return 'foo'

  // const { pipe } = renderToPipeableStream(layout, {
  //   onShellReady() {
  //     res.setHeader('content-type', 'text/html')
  //     pipe(res)
  //   },
  // })
}
