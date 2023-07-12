/**
 * @file Server entry file.
 */

import compression from 'compression'
import express from 'express'
import helmet from 'helmet'
import ip from 'ip'
import morgan from 'morgan'
import appConf from './app.conf'
import renderer from './arch/middleware/renderer'
import robots from './arch/middleware/robots'
import sitemap from './arch/middleware/sitemap'
import staticFiles from './arch/middleware/staticFiles'
import useDebug from './arch/utils/useDebug'
import routesConf from './routes.conf'

const debug = useDebug(undefined, 'server')

const app = express()
app.use(morgan('dev'))
app.use(compression())
app.use(helmet({ contentSecurityPolicy: false }))
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
if (process.env.NODE_ENV === 'development') app.use(require('./arch/middleware/dev').default())
if (process.env.NODE_ENV !== 'development') app.use(staticFiles({ rootDir: __dirname }))
app.use(sitemap({ routes: routesConf }))
app.use(robots({ routes: routesConf }))
app.use(renderer({ routes: routesConf, ssrEnabled: process.env.NODE_ENV !== 'development' }))

/**
 * Server 404 error, when the requested URI is not found.
 */
app.use((req, res, next) => {
  const err = Error(`${req.method} ${req.path} is not handled.`)
  err.status = 404
  next(err)
})

/**
 * Final point of error handling. Any error that was previously thrown will skip all intermediate
 * middleware and go straight to here, where the server will first render an error view if the
 * request accepts html, or respond with the error info in a JSON payload. If
 * the error that ends up
 * here does not have a status code, it will default to 500.
 */
app.use((err: Error, req: express.Request, res: express.Response) => {
  res.status(err.status || 500).send(err)
})

if (!appConf.skipHTTP) {
  app.listen(appConf.port)
    .on('error', (error: NodeJS.ErrnoException) => {
      if (error.syscall !== 'listen') throw error

      switch (error.code) {
        case 'EACCES':
          debug(`Port ${appConf.port} requires elevated privileges`)
          process.exit(1)
        case 'EADDRINUSE':
          debug(`Port ${appConf.port} is already in use`)
          process.exit(1)
        default:
          throw error
      }
    })
    .on('listening', () => {
      debug(`App is listening on ${ip.address()}:${appConf.port}`)
    })

  process.on('unhandledRejection', reason => {
    console.error('Unhandled Promise rejection:', reason)
    process.exit(1)
  })
}

export { appConf as config }

export default app
