/**
 * @file Express middleware for development using Webpack dev server HMR features.
 *
 * @see {@link https://www.npmjs.com/package/webpack-dev-middleware}
 * @see {@link https://www.npmjs.com/package/webpack-hot-middleware}
 */

import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import clientBuildConfig from '../../config/build.client.conf'

const compiler = webpack(clientBuildConfig)

export function devMiddleware() {
  return webpackDevMiddleware(compiler, {
    publicPath: __BUILD_ARGS__.publicPath,
  })
}

export function hotMiddleware() {
  return webpackHotMiddleware(compiler)
}
