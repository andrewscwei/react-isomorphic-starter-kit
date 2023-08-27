import compression from 'compression'
import express from 'express'
import helmet from 'helmet'
import ip from 'ip'
import morgan from 'morgan'
import { RouteObject } from 'react-router'
import { I18nConfig, generateLocalizedRoutes } from '../i18n'
import { SEOConfig } from '../seo'
import { Metadata } from '../templates'
import { useDebug } from '../utils'
import handle500 from './handle500'
import renderRoot from './renderRoot'
import serveRobots from './serveRobots'
import serveSitemap from './serveSitemap'
import serveStatic from './serveStatic'
import { RenderProps } from './types'

type Config = {
  defaultMetadata?: Metadata
  i18n: I18nConfig
  routes: RouteObject[]
  seo?: SEOConfig
}

const debug = useDebug(undefined, 'server')
const { port } = __BUILD_ARGS__
const isDev = process.env.NODE_ENV === 'development'
const isTest = process.env.NODE_ENV === 'test'

export default function initServer(render: (props: RenderProps) => JSX.Element, {
  defaultMetadata,
  i18n,
  routes,
  seo = {},
}: Config) {
  const app = express()

  app.use(morgan('dev'))

  app.use(compression())

  app.use(helmet({
    contentSecurityPolicy: false,
  }))

  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  if (isDev) app.use(require('../dev').hmr())
  if (!isDev) app.use(serveStatic())

  const localizedRoutes = generateLocalizedRoutes(routes, i18n)

  app.use(serveRobots({
    seo,
  }))



  app.use(serveSitemap({
    routes: localizedRoutes,
    seo,
  }))

  app.use(renderRoot(isDev ? undefined : render, {
    defaultMetadata,
    i18n,
    routes: localizedRoutes,
  }))

  app.use(handle500())

  if (!isTest) {
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
  }

  process.on('unhandledRejection', reason => {
    console.error('Unhandled Promise rejection:', reason)
    process.exit(1)
  })

  return app
}
