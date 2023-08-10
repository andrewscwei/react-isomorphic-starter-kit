/**
 * @file Express middleware for server-side rendering of React views.
 *
 * @see {@link https://reactjs.org/docs/react-dom-server.html}
 */

import { RequestHandler } from 'express'
import path from 'path'
import React from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { matchPath } from 'react-router'
import { DEFAULT_LOCALE, LOCALE_CHANGE_STRATEGY } from '../../app.conf'
import translations from '../../locales'
import routesConf from '../../routes.conf'
import Layout from '../components/Layout'
import { getLocaleFromURL } from '../providers/I18nProvider'
import useAssetPathResolver from '../utils/useAssetPathResolver'

type Params = {
  rootComponent: RootComponentType<'static'>
}

export default function renderLayout({ rootComponent }: Params): RequestHandler {
  const isDev = process.env.NODE_ENV === 'development'
  const { publicPath, assetManifestFile } = __BUILD_ARGS__
  const routes = routesConf
  const assetPathResolver = useAssetPathResolver({
    publicPath,
    manifestFile: path.join(__dirname, publicPath, assetManifestFile),
  })

  return async (req, res) => {
    const config = routes.find(t => matchPath(t.path, req.path))
    const metaTags = config?.metaTags
    const prefetched = await config?.prefetch?.()
    const locals = { ...res.locals, prefetched }
    const { locale } = getLocaleFromURL(req.url, {
      defaultLocale: DEFAULT_LOCALE,
      resolveStrategy: LOCALE_CHANGE_STRATEGY === 'path' ? 'path' : 'query',
      supportedLocales: Object.keys(translations),
    }) ?? { locale: DEFAULT_LOCALE }

    const layout = (
      <Layout
        injectScripts={!isDev}
        locale={locale}
        locals={locals}
        metaTags={metaTags}
        rootComponent={rootComponent}
        routerProps={{ location: req.url }}
        assetPathResolver={assetPathResolver}
      />
    )

    const { pipe } = renderToPipeableStream(layout, {
      onShellReady() {
        res.setHeader('content-type', 'text/html')
        pipe(res)
      },
    })
  }
}
