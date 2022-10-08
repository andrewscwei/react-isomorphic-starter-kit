/**
 * @file Express middleware for server-side rendering of React views.
 *
 * @see {@link https://reactjs.org/docs/react-dom-server.html}
 */

import { RequestHandler } from 'express'
import fs from 'fs'
import path from 'path'
import React, { ComponentType } from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import appConf from '../app.conf'
import Layout from '../templates/Layout'
import { markup } from '../utils/dom'
import useDebug from '../utils/useDebug'

const debug = useDebug()

interface RenderOptions {
  /**
   * The Webpack generated bundle ID.
   */
  bundleId?: string
}

/**
 * Resolves an asset path with the fingerprinted equivalent. This only works if an asset manifest
 * file is present.
 *
 * @param pathToResolve - The asset path to resolveAssetPath.
 *
 * @return The resolved path.
 */
function resolveAssetPath(pathToResolve: string): string {
  const { publicPath } = __BUILD_ARGS__
  let out = pathToResolve

  try {
    const assetManifestFile = fs.readFileSync(path.join(publicPath, 'asset-manifest.json'), 'utf-8')
    const manifest = JSON.parse(assetManifestFile)
    const normalizedPath: string = path.join(...pathToResolve.split('/'))

    out = manifest[normalizedPath] ?? manifest[path.join(publicPath, normalizedPath)] ?? normalizedPath
  }
  catch (err) {}

  if (!out.startsWith(publicPath)) out = path.join(publicPath, out)

  return out
}

export function render(Component: ComponentType, options: RenderOptions = {}): RequestHandler {
  return appConf.ssrEnabled ? renderWithMarkup(Component, options) : renderWithoutMarkup(options)
}

/**
 * Renders a React component to string with body markup.
 *
 * @param Component - The React component to render.
 * @param options - @see RenderOptions
 *
 * @return Express middleware.
 */
export function renderWithMarkup(Component: ComponentType, { bundleId }: RenderOptions = {}): RequestHandler {
  return async (req, res) => {
    const body = renderToString(markup(Component, {
      staticRouter: {
        location: req.url,
      },
    }))

    debug(`Rendering <${req.path}> with markup...`, 'OK')

    res.send(`<!DOCTYPE html>${renderToStaticMarkup(
      <Layout
        body={body}
        bundleId={bundleId}
        locals={res.locals}
        resolveAssetPath={resolveAssetPath}
      />,
    )}`)
  }
}

/**
 * Renders a React component to string without body markup.
 *
 * @param options - @see RenderOptions
 *
 * @return Express middleware.
 */
export function renderWithoutMarkup({ bundleId }: RenderOptions = {}): RequestHandler {
  return async (req, res) => {
    debug(`Rendering <${req.path}> without markup...`, 'OK', bundleId, req.query)

    res.send(`<!DOCTYPE html>${renderToStaticMarkup(
      <Layout
        bundleId={bundleId}
        locals={res.locals}
        resolveAssetPath={resolveAssetPath}
      />,
    )}`)
  }
}
