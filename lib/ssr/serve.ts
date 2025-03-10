#!/usr/bin/env node

import express, { type ErrorRequestHandler } from 'express'
import minimist from 'minimist'
import { resolve } from 'node:path'
import { getIP } from './utils/index.js'

const PORT = process.env.PORT ?? '8080'
const DEV = process.env.NODE_ENV === 'development'

function getArgs() {
  const cwd = process.cwd()
  const {
    e: entry,
    p: basePath = process.env.BASE_PATH ?? '/',
    s: s = 'static',
    t: template,
  } = minimist(process.argv.slice(2))

  const entryPath = resolve(cwd, entry)
  const staticPath = resolve(cwd, s)
  const templatePath = resolve(cwd, template)

  return {
    basePath,
    entryPath,
    staticPath,
    templatePath,
  }
}

async function createServer({ basePath, entryPath, staticPath, templatePath }: Record<string, string>) {
  const server = express()

  if (DEV) {
    const { devMiddleware } = await import('./middlewares/index.js')

    server.use(await devMiddleware({
      entryPath,
      templatePath,
    }, {
      basePath,
    }))
  }
  else {
    const { default: compression } = await import('compression')
    const { ssrMiddleware } = await import('./middlewares/index.js')

    server.use(compression())

    server.use(ssrMiddleware({
      entryPath,
      templatePath,
    }, {
      basePath,
      staticPath,
    }))
  }

  server.use(((err, req, res) => {
    res.status(err.status || 500).send(err)
  }) as ErrorRequestHandler)

  return server
}

async function main() {
  const { basePath, entryPath, staticPath, templatePath } = getArgs()
  const app = await createServer({ basePath, entryPath, staticPath, templatePath })

  app.listen(PORT)
    .on('error', (error: NodeJS.ErrnoException) => {
      if (error.syscall !== 'listen') throw error

      switch (error.code) {
        case 'EACCES':
          console.error(`Port ${PORT} requires elevated privileges`)
          process.exit(1)
        case 'EADDRINUSE':
          console.error(`Port ${PORT} is already in use`)
          process.exit(1)
        default:
          throw error
      }
    })
    .on('listening', () => {
      // eslint-disable-next-line no-console
      console.log('⛅️ Starting app...', 'OK', `${getIP()}:${PORT}`)
    })
}

main()
