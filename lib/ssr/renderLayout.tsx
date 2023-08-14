/**
 * @file Express middleware for server-side rendering of React views.
 *
 * @see {@link https://reactjs.org/docs/react-dom-server.html}
 */

import { RequestHandler } from 'express'
import path from 'path'
import { createElement } from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { matchPath } from 'react-router'
import { createTranslationResolver, getLocaleInfoFromURL, getUnlocalizedURL } from '../i18n'
import { joinURL } from '../utils'
import createResolveAssetPathFunction from './createResolveAssetPathFunction'

type Params = {
  layoutComponent: LayoutComponentType
  localeChangeStrategy: string
  rootComponent: RootComponentType<'static'>
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
    const config = routes.find(t => matchPath(t.path, getUnlocalizedURL(req.path, { defaultLocale, resolveStrategy, supportedLocales})))
    const prefetched = await config?.prefetch?.(req.url, locale)
    const metaTags = config?.metaTags?.(prefetched, createTranslationResolver(locale, { translations }))
    const locals = { ...res.locals, prefetched }
    const routerProps = { location: req.url }

    const bar = config?.component as any
    bar.foo?.()

    const app = createElement(rootComponent, {
      locals,
      routerProps,
      routerType: 'static',
    })

    const layout = createElement(layoutComponent, {
      injectScripts: !isDev,
      locale,
      locals,
      url: joinURL(baseURL, req.url),
      resolveAssetPath,
    }, !isDev && app)

    const { pipe } = renderToPipeableStream(layout, {
      onShellReady() {
        res.setHeader('content-type', 'text/html')
        pipe(res)
      },
    })
  }
}
