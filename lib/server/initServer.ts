import compression from 'compression'
import express from 'express'
import helmet from 'helmet'
import ip from 'ip'
import morgan from 'morgan'
import { I18nConfig, generateLocalizedRoutes } from '../i18n'
import { useDebug } from '../utils'
import handle500 from './handle500'
import renderLayout from './renderLayout'
import renderRobots from './renderRobots'
import renderSitemap from './renderSitemap'
import serveLocalStatic from './serveLocalStatic'

type Config = {
  routes: RouteObjectWithMetadata[]
  i18n: I18nConfig
  port?: number
}

const debug = useDebug(undefined, 'server')

export default function initServer(render: Parameters<typeof renderLayout>[0]['render'], {
  routes: routesConf,
  i18n: i18nConf,
  port,
}: Config) {
  const app = express()
  app.use(morgan('dev'))
  app.use(compression())
  app.use(helmet({ contentSecurityPolicy: false }))

  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  if (process.env.NODE_ENV === 'development') app.use(require('../dev').hmr())
  if (process.env.NODE_ENV !== 'development') app.use(serveLocalStatic())

  const routes = generateLocalizedRoutes(routesConf, i18nConf)

  app.use(renderRobots())
  app.use(renderSitemap({ routes }))
  app.use(renderLayout({ routes, i18n: i18nConf, render }))
  app.use(handle500())

  if (port !== undefined) {
    app.listen(port)
      .on('error', (error: NodeJS.ErrnoException) => {
        if (error.syscall !== 'listen') throw error

        switch (error.code) {
          case 'EACCES':
            debug(`Port ${port} requires elevated privileges`)
            process.exit(1)
          case 'EADDRINUSE':
            debug(`Port ${port} is already in use`)
            process.exit(1)
          default:
            throw error
        }
      })
      .on('listening', () => {
        debug(`App is listening on ${ip.address()}:${port}`)
      })

    process.on('unhandledRejection', reason => {
      console.error('Unhandled Promise rejection:', reason)
      process.exit(1)
    })
  }

  return app
}
