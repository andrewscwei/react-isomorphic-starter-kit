import { Router } from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import clientBuildConfig from '../../config/build.client.conf'

/**
 * Express middleware that builds, serves and watches the client bundle with hot
 * module reloading configured. Intended for development use only.
 *
 * @see {@link https://www.npmjs.com/package/webpack-dev-middleware}
 * @see {@link https://www.npmjs.com/package/webpack-hot-middleware}
 */
export function hmr() {
  const compiler = webpack(clientBuildConfig)
  const router = Router()

  router.use(webpackDevMiddleware(compiler, {
    publicPath: clientBuildConfig.output?.publicPath,
  }))

  router.use(webpackHotMiddleware(compiler, {
    log: false,
    heartbeat: 2000,
  }))

  return router
}
