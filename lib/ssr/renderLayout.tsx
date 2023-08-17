/**
 * @file Express middleware for server-side rendering of React views.
 *
 * @see {@link https://reactjs.org/docs/react-dom-server.html}
 */

import { RequestHandler } from 'express'
import path from 'path'
import React, { ComponentType, createElement } from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { Outlet, RouteObject, matchRoutes } from 'react-router'
import { StaticRouterProvider, createStaticRouter } from 'react-router-dom/server'
import { I18nConfig, I18nProvider, createGetLocalizedString, createResolveLocaleOptions, resolveLocaleFromURL } from '../i18n'
import { joinURL } from '../utils'
import { createResolveAssetPath, createStaticHandlerAndContext } from './helpers'

type Params = {
  layoutComponent: ComponentType<LayoutComponentProps>
  rootComponent: ComponentType<RootComponentProps>
  routes: RouteObject[]
  i18n: I18nConfig
}

const { baseURL, publicPath, assetManifestFile } = __BUILD_ARGS__
const isDev = process.env.NODE_ENV === 'development'

export default function renderLayout({
  i18n,
  layoutComponent,
  rootComponent,
  routes,
}: Params): RequestHandler {
  const resolveAssetPath = createResolveAssetPath({
    publicPath,
    manifestFile: path.join(__dirname, assetManifestFile),
  })

  return async (req, res) => {
    const Container = () => (
      <I18nProvider {...i18n}>
        <Outlet/>
      </I18nProvider>
    )

    const resolveResult = resolveLocaleFromURL(req.url, createResolveLocaleOptions(i18n))
    const { handler, context } = await createStaticHandlerAndContext(req, { container: Container, routes })
    const matchedRouteObject = matchRoutes(routes, req.url)?.[0]?.route as RouteObjectWithMetadata
    const metadata = await matchedRouteObject?.metadata?.(createGetLocalizedString(resolveResult?.locale, i18n))

    if (context instanceof Response) {
      return res.redirect(context.status, context.headers.get('Location') ?? '')
    }

    const root = createElement(rootComponent, {
      routerProvider: <StaticRouterProvider router={createStaticRouter(handler.dataRoutes, context)} context={context}/>,
    })

    const layout = createElement(layoutComponent, {
      injectScripts: !isDev,
      metadata: {
        ...metadata ?? {},
        locale: resolveResult?.locale,
        url: joinURL(baseURL, req.url),
      },
      resolveAssetPath,
    }, !isDev && root)

    const { pipe } = renderToPipeableStream(layout, {
      onShellReady() {
        res.setHeader('content-type', 'text/html')
        pipe(res)
      },
    })
  }
}
