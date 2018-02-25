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

const log = debug(`app:hmr`);
const compiler = webpack(buildConfig);

export function devMiddleware() {
  return webpackDevMiddleware(compiler, {
    quiet: false,
    noInfo: true,
    inline: false,
    publicPath: buildConfig.output.publicPath,
    stats: { colors: true }
  });
}

export function hotMiddleware() {
  return webpackHotMiddleware(compiler, {
    log: log,
    heartbeat: 2000,
    multistep: false
  });
}
