/**
 * @file Server entry file.
 */

import { createElement } from 'react'
import { renderToReadableStream } from 'react-dom/server'
import { RouteObject } from 'react-router'
import { createStaticHandler } from 'react-router-dom/server'
import { I18nConfig } from '../i18n'
import { createMetadata, createResolveAssetPath } from '../server/helpers'
import { Layout, Metadata } from '../templates'
import { RenderProps } from './types'

type Options = {
  defaultMetadata?: Metadata
  i18n: I18nConfig
  routes: RouteObject[]
}

const { basePath, baseURL, publicPath } = __BUILD_ARGS__

export default function renderRoot(render: (props: RenderProps) => JSX.Element, { defaultMetadata, i18n, routes }: Options) {
  return async (request: Request, path: string) => {
    const handler = createStaticHandler(routes, { basename: basePath })
    const context = await handler.query(request)

    if (context instanceof Response) return context

    const resolveAssetPath = createResolveAssetPath({ publicPath, manifest: __ASSET_MANIFEST__ })
    const metadata = await createMetadata(path, { baseURL, i18n, routes })
    const root = createElement(Layout, {
      injectStyles: render !== undefined,
      metadata: {
        ...defaultMetadata,
        baseTitle: defaultMetadata?.baseTitle ?? defaultMetadata?.title,
        ...metadata,
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
