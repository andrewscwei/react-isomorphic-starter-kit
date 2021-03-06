/**
 * @file Server entry file.
 */

import compression from 'compression'
import express from 'express'
import fs from 'fs'
import helmet from 'helmet'
import http from 'http'
import ip from 'ip'
import 'isomorphic-fetch'
import morgan from 'morgan'
import path from 'path'
import appConf from './app.conf'
import { generateSitemap } from './middleware/sitemap'
import routes from './routes'
import debug from './utils/debug'

const app = express()

app.use(morgan('dev'))

app.use(compression())
app.use(helmet({
  contentSecurityPolicy: false,
}))

/**
 * Serve assets from Webpack dev server in development to enable hot module
 * reloading.
 */
if (process.env.NODE_ENV === 'development') {
  app.use(require('./middleware/hmr').devMiddleware())
  app.use(require('./middleware/hmr').hotMiddleware())
}

/**
 * Serve static files and add expire headers.
 * @see {@link https://expressjs.com/en/starter/static-files.html}
 */
if (process.env.NODE_ENV !== 'development' && fs.existsSync(path.join(__dirname, __BUILD_CONFIG__.build.publicPath))) {
  app.use(__BUILD_CONFIG__.build.publicPath, express.static(path.join(__dirname, __BUILD_CONFIG__.build.publicPath), {
    setHeaders(res) {
      const duration = 1000 * 60 * 60 * 24 * 365 * 10
      res.setHeader('Expires', (new Date(Date.now() + duration)).toUTCString())
      res.setHeader('Cache-Control', `max-age=${duration / 1000}`)
    },
  }))
}

/**
 * Sitemap generator.
 */
app.use('/sitemap.xml', generateSitemap())

/**
 * Handle server routes.
 */
app.use('/', routes)

/**
 * Server 404 error, when the requested URI is not found.
 */
app.use((req, _, next) => {
  const err = new Error(`${req.method} ${req.path} is not handled.`)
  err.status = 404
  next(err)
})

/**
 * Final point of error handling. Any error that was previously thrown will
 * skip all intermediate middleware and go straight to here, where the server
 * will first render an error view if the request accepts html, or respond with
 * the error info in a JSON payload. If the error that ends up here does not
 * have a status code, it will default to 500.
 */
app.use((err: Error, _: express.Request, res: express.Response) => {
  res.status(err.status || 500).send(err)
})

http
  .createServer(app)
  .listen(appConf.port)
  .on('error', (error: NodeJS.ErrnoException) => {
    if (error.syscall !== 'listen') throw error

    switch (error.code) {
    case 'EACCES':
      debug(`Port ${appConf.port} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      debug(`Port ${appConf.port} is already in use`)
      process.exit(1)
      break
    default:
      throw error
    }
  })
  .on('listening', () => {
    debug(`App is listening on ${ip.address()}:${appConf.port}`)
  })

// Handle unhandled rejections.
process.on('unhandledRejection', reason => {
  console.error('Unhandled Promise rejection:', reason) // eslint-disable-line no-console
  process.exit(1)
})

export default app
