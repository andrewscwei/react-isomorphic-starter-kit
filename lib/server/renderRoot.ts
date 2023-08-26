/**
 * @file Express middleware for server-side rendering of React views.
 *
 * @see {@link https://reactjs.org/docs/react-dom-server.html}
 */

import { StaticHandlerContext } from '@remix-run/router'
import { RequestHandler } from 'express'
import { createElement } from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { RouteObject } from 'react-router'
import { createStaticHandler } from 'react-router-dom/server'
import { I18nConfig } from '../i18n'
import { Layout, Metadata } from '../templates'
import { createFetchRequest, createMetadata, createResolveAssetPath } from './helpers'

type Params = {
  defaultMetadata?: Metadata
  i18n: I18nConfig
  routes: RouteObject[]
  render?: (props: Props) => JSX.Element
}

export type Props = {
  context: StaticHandlerContext
  routes: RouteObject[]
}

const { baseURL, basePath, publicPath } = __BUILD_ARGS__

export default function renderRoot({ defaultMetadata, i18n, routes, render }: Params): RequestHandler {
  return async (req, res) => {
    const fetchRequest = createFetchRequest(req)
    const handler = createStaticHandler(routes, { basename: basePath })
    const context = await handler.query(fetchRequest)

    if (context instanceof Response) return res.redirect(context.status, context.headers.get('Location') ?? '')

    const resolveAssetPath = createResolveAssetPath({ publicPath, manifest: __ASSET_MANIFEST__ })
    const metadata = await createMetadata(req, { baseURL, i18n })
    const root = render?.({ context, routes: handler.dataRoutes })

    const { pipe } = renderToPipeableStream(createElement(Layout, {
      injectStyles: render !== undefined,
      metadata: {
        ...defaultMetadata,
        baseTitle: defaultMetadata?.baseTitle ?? defaultMetadata?.title,
        ...metadata,
      },
      resolveAssetPath,
    }, root), {
      onShellReady() {
        res.setHeader('content-type', 'text/html')
        pipe(res)
      },
    })
  }
}
