/**
 * @file Express middleware for server-side rendering of React views.
 *
 * @see {@link https://reactjs.org/docs/react-dom-server.html}
 */

import { RequestHandler } from 'express'
import path from 'path'
import React, { createElement } from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { matchPath } from 'react-router'
import { DEFAULT_LOCALE, LOCALE_CHANGE_STRATEGY } from '../../src/app.conf'
import translations from '../../src/locales'
import routesConf from '../../src/routes.conf'
import Layout from '../../src/templates/Layout'
import { createTranslationResolver, getLocaleInfoFromURL, getUnlocalizedURL } from '../i18n'
import createResolveAssetPathFunction from './createResolveAssetPathFunction'

type Params = {
  rootComponent: RootComponentType<'static'>
}

export default function renderLayout({ rootComponent }: Params): RequestHandler {
  const isDev = process.env.NODE_ENV === 'development'
  const { publicPath, assetManifestFile } = __BUILD_ARGS__
  const routes = routesConf
  const resolveAssetPath = createResolveAssetPathFunction({
    publicPath,
    manifestFile: path.join(__dirname, publicPath, assetManifestFile),
  })

  return async (req, res) => {
    const defaultLocale = DEFAULT_LOCALE
    const resolveStrategy = LOCALE_CHANGE_STRATEGY === 'path' ? 'path' : 'query'
    const supportedLocales = Object.keys(translations)
    const localeInfo = getLocaleInfoFromURL(req.url, { defaultLocale, resolveStrategy, supportedLocales })
    const locale = localeInfo?.locale ?? DEFAULT_LOCALE
    const config = routes.find(t => matchPath(t.path, getUnlocalizedURL(req.path, { defaultLocale, resolveStrategy, supportedLocales})))
    const prefetched = await config?.prefetch?.(req.url, locale)
    const metaTags = config?.metaTags?.(prefetched, createTranslationResolver(locale, { translations }))
    const locals = { ...res.locals, prefetched }
    const routerProps = { location: req.url }

    const app = createElement(rootComponent, {
      locals,
      routerProps,
      routerType: 'static',
    })

    const layout = (
      <Layout
        injectScripts={!isDev}
        locale={locale}
        locals={locals}
        metaTags={metaTags}
        routerProps={routerProps}
        resolveAssetPath={resolveAssetPath}
      >
        {!isDev && app}
      </Layout>
    )

    const { pipe } = renderToPipeableStream(layout, {
      onShellReady() {
        res.setHeader('content-type', 'text/html')
        pipe(res)
      },
    })
  }
}
