/**
 * @file Express middleware for server-side rendering of React views.
 *
 * @see {@link https://reactjs.org/docs/react-dom-server.html}
 */

import { type RequestHandler } from 'express'
import { createElement } from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { type RouteObject } from 'react-router'
import { createStaticHandler } from 'react-router-dom/server'
import { type I18nConfig } from '../i18n'
import { Layout, createMetadata, createResolveAssetPath, type Metadata } from '../layouts'
import { createFetchRequest } from './helpers'
import { type RenderProps } from './types'

type Options = {
  /**
   * Custom scripts to inject into the application root.
   */
  customScripts?: (props: RenderProps) => JSX.Element | undefined

  /**
   * Configuration for i18n (see {@link I18nConfig}).
   */
  i18n: I18nConfig

  /**
   * Default {@link Metadata} for the rendered application.
   */
  metadata?: Metadata

  /**
   * Configuration for routes (see {@link RouteObject}).
   */
  routes: RouteObject[]
}

const { baseURL, basePath, publicPath } = __BUILD_ARGS__

/**
 * Creates an Express request handler for rendering the applicaiton root.
 *
 * @param render Function for rendering the application.
 * @param options See {@link Options}.
 *
 * @returns The request handler.
 */
export function renderRoot(render: ((props: RenderProps) => JSX.Element) | undefined, { customScripts, metadata, i18n, routes }: Options): RequestHandler {
  return async (req, res) => {
    const handler = createStaticHandler(routes, { basename: basePath })
    const context = await handler.query(createFetchRequest(req))

    if (context instanceof Response) return res.redirect(context.status, context.headers.get('Location') ?? '')

    const resolveAssetPath = createResolveAssetPath({ publicPath, manifest: __ASSET_MANIFEST__ })
    const customMetadata = await createMetadata(context, { baseURL, i18n, routes })
    const root = createElement(Layout, {
      customScripts: customScripts?.({ context, request: req, routes: handler.dataRoutes }),
      injectStyles: render !== undefined,
      metadata: {
        ...metadata,
        baseTitle: metadata?.baseTitle ?? metadata?.title,
        ...customMetadata,
      },
      resolveAssetPath,
    }, render?.({ context, request: req, routes: handler.dataRoutes }))

    const { pipe } = renderToPipeableStream(root, {
      onShellReady() {
        res.setHeader('content-type', 'text/html')
        pipe(res)
      },
    })
  }
}
