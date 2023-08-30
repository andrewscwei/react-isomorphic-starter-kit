/**
 * @file Server entry file.
 */

import { createElement } from 'react'
import { renderToReadableStream } from 'react-dom/server'
import type { RouteObject } from 'react-router'
import { createStaticHandler } from 'react-router-dom/server'
import type { I18nConfig } from '../i18n'
import { createMetadata, createResolveAssetPath } from '../server/helpers'
import { Layout, type Metadata } from '../templates'
import type { RenderProps } from './types'

type Options = {
  /**
   * Configuration for i18n (see {@link I18nConfig}).
   */
  i18n: I18nConfig

  /**
   * Default metadata to use when rendering the application root.
   */
  metadata?: Metadata

  /**
   * Configuration for routes (see {@link RouteObject}).
   */
  routes: RouteObject[]
}

const { basePath, baseURL, publicPath } = __BUILD_ARGS__

/**
 * Creates a {@link Request} handler that returns a {@link Response} containing
 * the markup for the rendered application root.
 *
 * @param render Render function for the application root.
 * @param options See {@link Options}.
 *
 * @returns The {@link Request} handler.
 */
export function renderRoot(render: (props: RenderProps) => JSX.Element, { metadata, i18n, routes }: Options) {
  return async (request: Request, path: string) => {
    const handler = createStaticHandler(routes, { basename: basePath })
    const context = await handler.query(request)

    if (context instanceof Response) return context

    const resolveAssetPath = createResolveAssetPath({ publicPath, manifest: __ASSET_MANIFEST__ })
    const customMetadata = await createMetadata(context, { baseURL, i18n, routes })
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
