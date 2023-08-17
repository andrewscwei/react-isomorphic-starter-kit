/**
 * @file Server entry file.
 */

import compression from 'compression'
import express from 'express'
import helmet from 'helmet'
import ip from 'ip'
import morgan from 'morgan'
import { renderLayout, renderRobots, renderSitemap, serveLocalStatic } from '../lib/ssr'
import { useDebug } from '../lib/utils'
import { DEFAULT_LOCALE, LOCALE_CHANGE_STRATEGY, PORT, SKIP_HTTP } from './app.conf'
import { translations } from './locales'
import handle404 from './middleware/handle404'
import handle500 from './middleware/handle500'
import routesConf from './routes.conf'
import Layout from './templates/Layout'
import App from './ui/App'

const debug = useDebug(undefined, 'server')

const app = express()
app.use(morgan('dev'))
app.use(compression())
app.use(helmet({ contentSecurityPolicy: false }))

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
if (process.env.NODE_ENV === 'development') app.use(require('../lib/dev').hmr())
if (process.env.NODE_ENV !== 'development') app.use(serveLocalStatic())

app.use(renderRobots())
app.use(renderSitemap({ routes: routesConf }))
app.use(renderLayout({
  layoutComponent: Layout,
  rootComponent: App,
  routes: routesConf,
  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    localeChangeStrategy: LOCALE_CHANGE_STRATEGY,
    translations,
  },
}))

app.use(handle404())
app.use(handle500())

if (!SKIP_HTTP) {
  app.listen(PORT)
    .on('error', (error: NodeJS.ErrnoException) => {
      if (error.syscall !== 'listen') throw error

      switch (error.code) {
        case 'EACCES':
          debug(`Port ${PORT} requires elevated privileges`)
          process.exit(1)
        case 'EADDRINUSE':
          debug(`Port ${PORT} is already in use`)
          process.exit(1)
        default:
          throw error
      }
    })
    .on('listening', () => {
      debug(`App is listening on ${ip.address()}:${PORT}`)
    })

  process.on('unhandledRejection', reason => {
    console.error('Unhandled Promise rejection:', reason)
    process.exit(1)
  })
}

export default app
