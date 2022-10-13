import { Router } from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import clientBuildConfig from '../../config/build.client.conf'

/**
 * Middleware for development only, sets up Webpack dev server and HMR features.
 *
 * @see {@link https://www.npmjs.com/package/webpack-dev-middleware}
 * @see {@link https://www.npmjs.com/package/webpack-hot-middleware}
 */
export default function dev() {
  const compiler = webpack(clientBuildConfig)
  const router = Router()

  router.use(webpackDevMiddleware(compiler, {
    publicPath: __BUILD_ARGS__.publicPath,
  }))

  router.use(webpackHotMiddleware(compiler, {
    log: false,
    heartbeat: 2000,
  }))

  return router
}
