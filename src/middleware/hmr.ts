/**
 * @file Express middleware for development using Webpack dev server HMR
 *       features.
 *
 * @see {@link https://www.npmjs.com/package/webpack-dev-middleware}
 * @see {@link https://www.npmjs.com/package/webpack-hot-middleware}
 */

import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import buildConfig from '../../config/build.client.conf'
import debug from '../utils/debug'

const compiler = webpack(buildConfig)

/**
 * Export configured dev middleware.
 *
 * @return Express middleware.
 */
export function devMiddleware() {
  return webpackDevMiddleware(compiler, {
    publicPath: buildConfig.output?.publicPath?.toString() ?? '/',
  })
}

/**
 * Export configured hot middleware.
 *
 * @return Express middleware.
 */
export function hotMiddleware() {
  return webpackHotMiddleware(compiler as any /* TODO: Fix this when the @types/webpack-hot-middleware is updated */, {
    log: debug,
    heartbeat: 2000,
  })
}
