/**
 * @file Express middleware for server-side rendering of React views.
 *
 * @see {@link https://reactjs.org/docs/react-dom-server.html}
 */

import { RequestHandler } from 'express'
import React from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { matchPath } from 'react-router'
import Layout from '../components/Layout'

type Params = {
  rootComponent: RootComponentType<'static'>
  routes: RouteConfig[]
  ssrEnabled?: boolean
  assetPathResolver?: (path: string) => string
}

export default function renderer({ routes, rootComponent, ssrEnabled = false, assetPathResolver }: Params): RequestHandler {
  return async (req, res) => {
    const config = routes.find(t => matchPath(t.path, req.path))
    const prefetched = await config?.prefetch?.()
    const helmetContext = {}
    const locals = { ...res.locals, prefetched }
    const layout = (
      <Layout
        helmetContext={helmetContext}
        locals={locals}
        inject={ssrEnabled}
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
