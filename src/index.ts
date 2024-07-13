import { devMiddleware, handle500, ssrMiddleware } from '@lib/server'
import { createDebug } from '@lib/utils/createDebug'
import express from 'express'
import path from 'node:path'
import url from 'node:url'
import { BASE_PATH, PUBLIC_PATH } from './app.conf'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const debug = createDebug(undefined, 'server')
const port = process.env.PORT ?? '8080'
const app = express()

if (process.env.NODE_ENV !== 'production') {
  app.use(await devMiddleware({
    basePath: BASE_PATH,
    entryPath: path.resolve(__dirname, 'main.server.tsx'),
    templatePath: path.resolve(__dirname, 'index.html'),
  }))
}
else {
  app.use(ssrMiddleware({
    entryPath: path.resolve(__dirname, '../build/server/main.server.js'),
    publicPath: PUBLIC_PATH,
    staticPath: path.resolve(__dirname, '../build/client'),
    templatePath: path.resolve(__dirname, '../build/client/index.html'),
  }))
}

app.use(handle500())

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
