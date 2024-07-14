import { devMiddleware, ssrMiddleware } from '@lib/ssr'
import { createDebug } from '@lib/utils/createDebug'
import express, { type ErrorRequestHandler } from 'express'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BASE_PATH, PUBLIC_PATH } from './app.conf'

const __dirname = dirname(fileURLToPath(import.meta.url))
const debug = createDebug(undefined, 'server')
const port = process.env.PORT ?? '8080'
const app = express()

if (process.env.NODE_ENV !== 'production') {
  app.use(await devMiddleware({
    entryPath: resolve(__dirname, 'main.server.tsx'),
    templatePath: resolve(__dirname, 'index.html'),
  }, {
    basePath: BASE_PATH,
  }))
}
else {
  app.use(ssrMiddleware({
    entryPath: resolve(__dirname, '../build/main.server.js'),
    templatePath: resolve(__dirname, '../build/index.html'),
  }, {
    publicPath: PUBLIC_PATH,
    staticPath: resolve(__dirname, '../build'),
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

process.on('unhandledRejection', reason => {
  console.error('Unhandled Promise rejection:', reason)
  process.exit(1)
})
