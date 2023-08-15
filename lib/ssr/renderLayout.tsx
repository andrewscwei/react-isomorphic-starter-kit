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
import { DEFAULT_LOCALE, LOCALE_CHANGE_STRATEGY } from '../../src/app.conf'
import { I18nProvider, getLocaleInfoFromURL } from '../i18n'
import { joinURL } from '../utils'
import createResolveAssetPathFunction from './createResolveAssetPath'
import createStaticRouterProvider from './createStaticRouterProvider'

type Params = {
  layoutComponent: ComponentType<LayoutComponentProps>
  localeChangeStrategy: string
  rootComponent: ComponentType<RootComponentProps>
  routes: RouteObject[]
  translations: Record<string, any>
}

export default function renderLayout({
  layoutComponent,
  localeChangeStrategy,
  rootComponent,
  routes,
  translations,
}: Params): RequestHandler {
  const { baseURL, publicPath, assetManifestFile, defaultLocale } = __BUILD_ARGS__
  const isDev = process.env.NODE_ENV === 'development'
  const resolveAssetPath = createResolveAssetPathFunction({
    publicPath,
    manifestFile: path.join(__dirname, publicPath, assetManifestFile),
  })

  return async (req, res) => {
    const Container = () => (
      <I18nProvider defaultLocale={DEFAULT_LOCALE} translations={translations} localeChangeStrategy={LOCALE_CHANGE_STRATEGY}>
        <Outlet/>
      </I18nProvider>
    )

    const resolveStrategy = localeChangeStrategy === 'path' ? 'path' : 'query'
    const supportedLocales = Object.keys(translations)
    const localeInfo = getLocaleInfoFromURL(req.url, { defaultLocale, resolveStrategy, supportedLocales })
    const routerProvider = await createStaticRouterProvider(req, { container: Container, routes })

    const layout = createElement(layoutComponent, {
      injectScripts: !isDev,
      metadata: {
        locale: localeInfo?.locale ?? defaultLocale,
        url: joinURL(baseURL, req.url),
      },
      resolveAssetPath,
    }, !isDev && createElement(rootComponent, { routerProvider }))

    const { pipe } = renderToPipeableStream(layout, {
      onShellReady() {
        res.setHeader('content-type', 'text/html')
        pipe(res)
      },
    })
  }
}
