import compression from 'compression'
import express from 'express'
import helmet from 'helmet'
import ip from 'ip'
import morgan from 'morgan'
import { ComponentType } from 'react'
import { RouteObject } from 'react-router'
import { I18nConfig } from '../i18n'
import { useDebug } from '../utils'
import handle404 from './handle404'
import handle500 from './handle500'
import renderLayout from './renderLayout'
import renderRobots from './renderRobots'
import renderSitemap from './renderSitemap'
import serveLocalStatic from './serveLocalStatic'

type Options = {
  layoutComponent: ComponentType<LayoutComponentProps>
  rootComponent: ComponentType<RootComponentProps>
  routes: RouteObject[]
  i18n: I18nConfig
  port?: number
}

const debug = useDebug(undefined, 'server')

export default function createServer({
  layoutComponent,
  rootComponent,
  routes,
  i18n,
  port,
}: Options) {
  const app = express()
  app.use(morgan('dev'))
  app.use(compression())
  app.use(helmet({ contentSecurityPolicy: false }))

  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  if (process.env.NODE_ENV === 'development') app.use(require('../dev').hmr())
  if (process.env.NODE_ENV !== 'development') app.use(serveLocalStatic())

  app.use(renderRobots())
  app.use(renderSitemap({ routes }))
  app.use(renderLayout({
    layoutComponent,
    rootComponent,
    routes,
    i18n,
  }))

  app.use(handle404())
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
