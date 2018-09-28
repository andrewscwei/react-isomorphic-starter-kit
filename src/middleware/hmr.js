/**
 * @file Express middleware for development using Webpack dev server HMR
 *       features.
 *
 * @see {@link https://www.npmjs.com/package/webpack-dev-middleware}
 * @see {@link https://www.npmjs.com/package/webpack-hot-middleware}
 */

import buildConfig from '@/../config/build.client.conf';
import debug from 'debug';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

const log = debug('app:hmr');
const compiler = webpack(buildConfig);

/**
 * Export configured dev middleware.
 *
 * @return Express middleware.
 */
export function devMiddleware() {
  return webpackDevMiddleware(compiler, {
    publicPath: buildConfig && buildConfig.output && buildConfig.output.publicPath || '/',
    stats: { colors: true },
  });
}

/**
 * Export configured hot middleware.
 *
 * @return Express middleware.
 */
export function hotMiddleware() {
  return webpackHotMiddleware(compiler, {
    log,
    heartbeat: 2000,
  });
}
