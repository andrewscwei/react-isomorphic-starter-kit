/**
 * @file Express middleware for server-side rendering of React views.
 *
 * @see {@link https://reactjs.org/docs/react-dom-server.html}
 */

import { RequestHandler } from 'express'
import _ from 'lodash'
import path from 'path'
import React, { ComponentType } from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import { matchPath } from 'react-router'
import appConf from '../app.conf'
import routesConf from '../routes.conf'
import Layout from '../templates/Layout'
import debug from '../utils/debug'
import { markup } from '../utils/dom'

interface RenderOptions {
  /**
   * The Webpack generated bundle ID.
   */
  bundleId?: string

  /**
   * The browser window title ID (for localization) of the rendered page. If provided, this title
   * will take precedence.
   */
  titleId?: string
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
  const { publicPath } = appConf
  let out = pathToResolve

  try {
    const outputDir = path.join(__dirname, '../../', 'build')
    const assetManifestFile = 'asset-manifest.json'
    const manifest = require(path.join(outputDir, 'static', assetManifestFile))
    const normalizedPath: string = path.join(...pathToResolve.split('/').filter(Boolean))

    out = manifest[normalizedPath] ?? manifest[`${publicPath}${normalizedPath}`] ?? normalizedPath
  }
  catch (err) {}

  if (!out.startsWith(publicPath)) out = `${publicPath}${out}`

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
export function renderWithMarkup(Component: ComponentType, { bundleId, titleId }: RenderOptions = {}): RequestHandler {
  return async (req, res) => {
    const matches = _.compact(routesConf.map(config => matchPath(req.path, config.path) ? config : undefined))

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
export function renderWithoutMarkup({ bundleId, titleId }: RenderOptions = {}): RequestHandler {
  return async (req, res) => {
    const matches = _.compact(routesConf.map(config => matchPath(req.path, config.path) ? config : undefined))

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
