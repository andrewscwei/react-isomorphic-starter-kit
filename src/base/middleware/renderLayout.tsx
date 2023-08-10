/**
 * @file Express middleware for server-side rendering of React views.
 *
 * @see {@link https://reactjs.org/docs/react-dom-server.html}
 */

import { RequestHandler } from 'express'
import path from 'path'
import React from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import { matchPath } from 'react-router'
import routesConf from '../../routes.conf'
import Layout from '../components/Layout'
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
    const prefetched = await config?.prefetch?.()
    const helmetContext = {}
    const locals = { ...res.locals, prefetched }

    const layout = (
      <HelmetProvider context={helmetContext}>
        <Layout
          helmetContext={helmetContext}
          locals={locals}
          inject={!isDev}
          rootComponent={rootComponent}
          routerProps={{ location: req.url }}
          resolveAssetPath={assetPathResolver}
        />
      </HelmetProvider>
    )

    const { pipe } = renderToPipeableStream(layout, {
      onShellReady() {
        res.setHeader('content-type', 'text/html')
        pipe(res)
      },
    })
  }
}
