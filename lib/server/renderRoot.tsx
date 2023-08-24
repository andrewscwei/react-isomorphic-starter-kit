/**
 * @file Express middleware for server-side rendering of React views.
 *
 * @see {@link https://reactjs.org/docs/react-dom-server.html}
 */

import { StaticHandlerContext } from '@remix-run/router'
import { RequestHandler } from 'express'
import path from 'path'
import { renderToPipeableStream } from 'react-dom/server'
import { RouteObject } from 'react-router'
import { I18nConfig } from '../i18n'
import { createMetadata, createResolveAssetPath, createStaticHandlerAndContext } from './helpers'
import { ComponentType, createElement } from 'react'

type Params = {
  i18n: I18nConfig
  layout: ComponentType<LayoutComponentProps>
  routes: RouteObject[]
  render?: (props: RenderProps) => JSX.Element
}

type RenderProps = LayoutComponentProps & {
  context: StaticHandlerContext
  routes: RouteObject[]
}

const { baseURL, publicPath, assetManifestFile } = __BUILD_ARGS__

export default function renderRoot({ i18n, layout, routes, render }: Params): RequestHandler {
  return async (req, res) => {
    const { handler, context } = await createStaticHandlerAndContext(req, { routes })
    if (context instanceof Response) return res.redirect(context.status, context.headers.get('Location') ?? '')

    const resolveAssetPath = createResolveAssetPath({ publicPath, manifestFile: path.join(__dirname, assetManifestFile) })
    const metadata = await createMetadata(req, { baseURL, i18n })
    const root = render?.({ context, metadata, routes: handler.dataRoutes, resolveAssetPath })

    const { pipe } = renderToPipeableStream(createElement(layout, {
      injectStyles: process.env.NODE_ENV !== 'development',
      metadata,
      resolveAssetPath,
    }, root), {
      onShellReady() {
        res.setHeader('content-type', 'text/html')
        pipe(res)
      },
    })
  }
}
