import express, { type RequestHandler } from 'express'
import { type RouteObject } from 'react-router'
import { generateLocalizedRoutes, type I18nConfig } from '../i18n'
import { type Metadata } from '../layouts'
import { type SEOConfig } from '../seo'
import { createDebug } from '../utils/createDebug'
import { handle500 } from './handle500'
import { renderRoot } from './renderRoot'
import { serveRobots } from './serveRobots'
import { serveSitemap } from './serveSitemap'
import { serveStatic } from './serveStatic'
import { type RenderProps } from './types'

type Config = {
  /**
   * Custom scripts to inject into the application root.
   */
  customScripts?: (props: RenderProps) => JSX.Element | undefined

  /**
   * Configuration for i18n (see {@link I18nConfig}).
   */
  i18n?: I18nConfig

  /**
   * Defualt {@link Metadata} for the rendered application.
   */
  metadata?: Metadata

  /**
   * Optional Express middleware.
   */
  middleware?: RequestHandler[]

  /**
   * Configuration for routes (see {@link RouteObject}).
   */
  routes?: RouteObject[]

  /**
   * Configuration for SEO (see {@link SEOConfig}).
   */
  seo?: SEOConfig
}

const debug = createDebug(undefined, 'server')
const { defaultLocale, port } = __BUILD_ARGS__
const isDev = process.env.NODE_ENV === 'development'
const isTest = process.env.NODE_ENV === 'test'

/**
 * Initializes, configures and returns the Express server for serving the
 * application.
 *
 * @param render Function for rendering the application.
 * @param config See {@link Config}.
 *
 * @returns The Express server.
 */
export function initServer(render?: (props: RenderProps) => JSX.Element, {
  customScripts,
  i18n = { defaultLocale, localeChangeStrategy: 'path', translations: { [defaultLocale]: {} } },
  middleware = [],
  metadata = {},
  routes = [],
  seo = {},
}: Config = {}) {
  const app = express()

  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  if (isDev) app.use(require('../dev').hmr())
  if (!isDev) app.use(serveStatic())

  const localizedRoutes = generateLocalizedRoutes(routes, i18n)

  app.use(serveRobots({
    routes: localizedRoutes,
    seo,
  }))

  app.use(serveSitemap({
    routes: localizedRoutes,
    seo,
  }))

  if (middleware.length > 0) {
    app.use(...middleware)
  }

  app.use(renderRoot((!__BUILD_ARGS__.forceHydration && isDev) ? undefined : render, {
    customScripts,
    metadata,
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
        debug('Starting app...', 'OK')
      })
  }

  process.on('unhandledRejection', reason => {
    console.error('Unhandled Promise rejection:', reason)
    process.exit(1)
  })

  return app
}
