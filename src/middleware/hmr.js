/**
 * @file Webpack dev server middleware.
 */

import config from '../../config/build.conf';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

const compiler = webpack(config);

export function dev() {
  return webpackDevMiddleware(compiler, {
    quiet: false,
    noInfo: true,
    inline: false,
    publicPath: config.output.publicPath,
    stats: { colors: true }
  });
}

export function hot() {
  return webpackHotMiddleware(compiler, {
    log: false,
    heartbeat: 2000,
    multistep: false
  });
}
