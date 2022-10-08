/**
 * @file Express middleware for server-side rendering of React views.
 *
 * @see {@link https://reactjs.org/docs/react-dom-server.html}
 */

import { RequestHandler } from 'express'
import fs from 'fs'
import path from 'path'
import React from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import appConf from '../app.conf'
import Layout from '../templates/Layout'
import App from '../ui/App'
import useDebug from '../utils/useDebug'

const debug = useDebug()

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
    const assetManifestFile = fs.readFileSync(path.join(__dirname, publicPath, 'asset-manifest.json'), 'utf-8')
    const manifest = JSON.parse(assetManifestFile)
    const normalizedPath: string = path.join(...pathToResolve.split('/'))

    out = manifest[normalizedPath] ?? manifest[path.join(publicPath, normalizedPath)] ?? normalizedPath
  }
  catch (err) {}

  if (!out.startsWith(publicPath)) out = path.join(publicPath, out)

  return out
}

export function render(): RequestHandler {
  return appConf.ssrEnabled ? renderWithMarkup() : renderWithoutMarkup()
}

/**
 * Renders a React component to string with body markup.
 *
 * @return Express middleware.
 */
export function renderWithMarkup(): RequestHandler {
  return async (req, res) => {
    const helmetContext = {}
    const body = renderToString(
      <App
        helmetContext={helmetContext}
        routerType='static'
        routerProps={{ location: req.url }}
      />
    )

    debug(`Rendering <${req.path}> with markup...`, 'OK', req.query)

    res.send(`<!DOCTYPE html>${renderToStaticMarkup(
      <Layout
        body={body}
        helmetContext={helmetContext}
        locals={res.locals}
        resolveAssetPath={resolveAssetPath}
      />,
    )}`)
  }
}

/**
 * Renders a React component to string without body markup.
 *
 * @return Express middleware.
 */
export function renderWithoutMarkup(): RequestHandler {
  return async (req, res) => {
    debug(`Rendering <${req.path}> without markup...`, 'OK', req.query)

    res.send(`<!DOCTYPE html>${renderToStaticMarkup(
      <Layout
        locals={res.locals}
        resolveAssetPath={resolveAssetPath}
      />,
    )}`)
  }
}
