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
import Layout from '../templates/Layout'
import App from '../ui/App'

type RenderOptions = {
  ssrEnabled?: boolean
}

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

export default function render({ ssrEnabled = false }: RenderOptions = {}): RequestHandler {
  return async (req, res) => {
    const helmetContext = {}
    const body = !ssrEnabled ? undefined : renderToString(
      <App
        helmetContext={helmetContext}
        routerType='static'
        routerProps={{ location: req.url }}
      />
    )

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
