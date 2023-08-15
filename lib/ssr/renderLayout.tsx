/**
 * @file Express middleware for server-side rendering of React views.
 *
 * @see {@link https://reactjs.org/docs/react-dom-server.html}
 */

import { RequestHandler } from 'express'
import path from 'path'
import { ComponentType, createElement } from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { matchPath } from 'react-router'
import { getLocaleInfoFromURL, getUnlocalizedURL } from '../i18n'
import { joinURL } from '../utils'
import createResolveAssetPathFunction from './createResolveAssetPathFunction'

type Params = {
  layoutComponent: ComponentType<LayoutComponentProps>
  localeChangeStrategy: string
  rootComponent: ComponentType<RootComponentProps>
  routes: RouteConfig[]
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
    const resolveStrategy = localeChangeStrategy === 'path' ? 'path' : 'query'
    const supportedLocales = Object.keys(translations)
    const localeInfo = getLocaleInfoFromURL(req.url, { defaultLocale, resolveStrategy, supportedLocales })
    const locale = localeInfo?.locale ?? defaultLocale
    const config = routes.find(t => matchPath(t.path, getUnlocalizedURL(req.path, { defaultLocale, resolveStrategy, supportedLocales })))
    const prefetched = await config?.prefetch?.(req.url, locale)
    const locals = { ...res.locals, prefetched }

    const root = createElement(rootComponent, {
      locals,
      staticURL: req.url,
    })

    const layout = createElement(layoutComponent, {
      injectScripts: !isDev,
      locale,
      url: joinURL(baseURL, req.url),
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
