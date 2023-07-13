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
import routesConf from '../../routes.conf'
import Layout from '../components/Layout'
import useAssetPathResolver from '../utils/useAssetPathResolver'

type Params = {
  rootComponent: RootComponentType<'static'>
}

export default function renderLayout({ rootComponent }: Params): RequestHandler {
  const { isDev, publicPath, assetManifestFile } = __BUILD_ARGS__
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
      <Layout
        helmetContext={helmetContext}
        locals={locals}
        inject={!isDev}
        rootComponent={rootComponent}
        routerProps={{ location: req.url }}
        resolveAssetPath={assetPathResolver}
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
