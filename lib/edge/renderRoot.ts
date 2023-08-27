/**
 * @file Server entry file.
 */

import { createElement } from 'react'
import { renderToReadableStream } from 'react-dom/server'
import type { RouteObject } from 'react-router'
import { createStaticHandler } from 'react-router-dom/server'
import type { I18nConfig } from '../i18n'
import { createMetadata, createResolveAssetPath } from '../server/helpers'
import type { Metadata } from '../templates'
import { Layout } from '../templates'
import type { RenderProps } from './types'

type Options = {
  i18n: I18nConfig
  metadata?: Metadata
  routes: RouteObject[]
}

const { basePath, baseURL, publicPath } = __BUILD_ARGS__

export default function renderRoot(render: (props: RenderProps) => JSX.Element, { metadata, i18n, routes }: Options) {
  return async (request: Request, path: string) => {
    const handler = createStaticHandler(routes, { basename: basePath })
    const context = await handler.query(request)

    if (context instanceof Response) return context

    const resolveAssetPath = createResolveAssetPath({ publicPath, manifest: __ASSET_MANIFEST__ })
    const customMetadata = await createMetadata(path, { baseURL, i18n, routes })
    const root = createElement(Layout, {
      injectStyles: render !== undefined,
      metadata: {
        ...metadata,
        baseTitle: metadata?.baseTitle ?? metadata?.title,
        ...customMetadata,
      },
      resolveAssetPath,
    }, render?.({ context, routes: handler.dataRoutes }))

    const stream = await renderToReadableStream(root)

    await stream.allReady

    return new Response(stream, {
      headers: { 'content-type': 'text/html' },
    })
  }
}
