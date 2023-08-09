/**
 * @file Server entry file.
 */

import compression from 'compression'
import express from 'express'
import helmet from 'helmet'
import ip from 'ip'
import morgan from 'morgan'
import * as appConf from './app.conf'
import handle404 from './base/middleware/handle404'
import handle500 from './base/middleware/handle500'
import renderLayout from './base/middleware/renderLayout'
import renderRobotsTXT from './base/middleware/renderRobotsTXT'
import renderSitemap from './base/middleware/renderSitemap'
import serveLocalStatic from './base/middleware/serveLocalStatic'
import useDebug from './base/utils/useDebug'
import App from './ui/App'

const debug = useDebug(undefined, 'server')

const app = express()
app.use(morgan('dev'))
app.use(compression())
app.use(helmet({ contentSecurityPolicy: false }))

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
if (process.env.NODE_ENV === 'development') app.use(require('./base/middleware/hmr').default())
if (process.env.NODE_ENV !== 'development') app.use(serveLocalStatic())

app.use(renderSitemap())
app.use(renderRobotsTXT())
app.use(renderLayout({ rootComponent: App }))

app.use(handle404())
app.use(handle500())

if (!appConf.SKIP_HTTP) {
  app.listen(appConf.PORT)
    .on('error', (error: NodeJS.ErrnoException) => {
      if (error.syscall !== 'listen') throw error

      switch (error.code) {
        case 'EACCES':
          debug(`Port ${appConf.PORT} requires elevated privileges`)
          process.exit(1)
        case 'EADDRINUSE':
          debug(`Port ${appConf.PORT} is already in use`)
          process.exit(1)
        default:
          throw error
      }
    })
    .on('listening', () => {
      debug(`App is listening on ${ip.address()}:${appConf.PORT}`)
    })

  process.on('unhandledRejection', reason => {
    console.error('Unhandled Promise rejection:', reason)
    process.exit(1)
  })
}

export { appConf as config }

export default app
