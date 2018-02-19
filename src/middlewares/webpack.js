/**
 * @file Webpack dev server middleware.
*/

const config = require(`../../config/build.conf`);
const webpack = require(`webpack`);
const webpackDevMiddleware = require(`webpack-dev-middleware`);
const webpackHotMiddleware = require(`webpack-hot-middleware`);

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
