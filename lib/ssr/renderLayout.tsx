/**
 * @file Express middleware for server-side rendering of React views.
 *
 * @see {@link https://reactjs.org/docs/react-dom-server.html}
 */

import { RequestHandler } from 'express'
import path from 'path'
import React, { ComponentType, createElement } from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { Outlet, RouteObject } from 'react-router'
import { StaticRouterProvider, createStaticRouter } from 'react-router-dom/server'
import { I18nProvider, getLocaleInfoFromURL } from '../i18n'
import { joinURL } from '../utils'
import createResolveAssetPath from './helpers/createResolveAssetPath'
import createStaticHandlerAndContext from './helpers/createStaticHandlerAndContext'

type Params = {
  layoutComponent: ComponentType<LayoutComponentProps>
  localeChangeStrategy: Parameters<typeof I18nProvider>[0]['localeChangeStrategy']
  rootComponent: ComponentType<RootComponentProps>
  routes: RouteObject[]
  translations: Record<string, any>
}

const { baseURL, publicPath, assetManifestFile, defaultLocale } = __BUILD_ARGS__
const isDev = process.env.NODE_ENV === 'development'

export default function renderLayout({
  layoutComponent,
  localeChangeStrategy,
  rootComponent,
  routes,
  translations,
}: Params): RequestHandler {
  const resolveAssetPath = createResolveAssetPath({
    publicPath,
    manifestFile: path.join(__dirname, publicPath, assetManifestFile),
  })

  return async (req, res) => {
    const Container = () => (
      <I18nProvider defaultLocale={defaultLocale} translations={translations} localeChangeStrategy={localeChangeStrategy}>
        <Outlet/>
      </I18nProvider>
    )

    const resolveStrategy = localeChangeStrategy === 'path' ? 'path' : 'query'
    const supportedLocales = Object.keys(translations)
    const localeInfo = getLocaleInfoFromURL(req.url, { defaultLocale, resolveStrategy, supportedLocales })
    const { handler, context } = await createStaticHandlerAndContext(req, { container: Container, routes })

    if (context instanceof Response) {
      return res.redirect(context.status, context.headers.get('Location') ?? '')
    }

    const root = createElement(rootComponent, {
      routerProvider: <StaticRouterProvider router={createStaticRouter(handler.dataRoutes, context)} context={context}/>,
    })

    const layout = createElement(layoutComponent, {
      injectScripts: !isDev,
      metadata: {
        locale: localeInfo?.locale ?? defaultLocale,
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
