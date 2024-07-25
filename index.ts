/**
 * @file Server.
 */

import debug from 'debug'
import express, { type ErrorRequestHandler } from 'express'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const BASE_PATH = process.env.BASE_PATH ?? '/'
const PORT = process.env.PORT ?? '8080'

const __dirname = dirname(fileURLToPath(import.meta.url))
const log = debug('server')

export const app = express()

if (process.env.NODE_ENV === 'development') {
  const { devMiddleware } = await import('./lib/ssr/index.js')

  app.use(await devMiddleware({
    entryPath: resolve(__dirname, 'src/main.server.tsx'),
    templatePath: resolve(__dirname, 'src/index.html'),
  }, {
    basePath: BASE_PATH,
  }))
}
else {
  const { ssrMiddleware } = await import('./lib/ssr/index.js')

  app.use(ssrMiddleware({
    entryPath: resolve(__dirname, 'main.server.js'),
    templatePath: resolve(__dirname, 'index.html'),
  }, {
    basePath: BASE_PATH,
    staticPath: __dirname,
  }))
}

app.use(((err, req, res) => {
  res.status(err.status || 500).send(err)
}) as ErrorRequestHandler)

app.listen(PORT)
  .on('error', (error: NodeJS.ErrnoException) => {
    if (error.syscall !== 'listen') throw error

    switch (error.code) {
      case 'EACCES':
        log(`Port ${PORT} requires elevated privileges`)
        process.exit(1)
      case 'EADDRINUSE':
        log(`Port ${PORT} is already in use`)
        process.exit(1)
      default:
        throw error
    }
  })
  .on('listening', () => {
    log('Starting app...', 'OK')
  })

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))
