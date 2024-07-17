/**
 * @file Server.
 */

import express, { type ErrorRequestHandler } from 'express'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createDebug } from './lib/utils/createDebug.js'

const BASE_PATH = process.env.BASE_PATH ?? '/'

const __dirname = dirname(fileURLToPath(import.meta.url))
const debug = createDebug(undefined, 'server')
const port = process.env.PORT ?? '8080'
const app = express()

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

process.on('SIGINT', reason => {
  debug(`Received ${reason}, shutting down...`)
  process.exit(0)
})

process.on('unhandledRejection', reason => {
  console.error('Unhandled Promise rejection:', reason)
  process.exit(1)
})

export default app
