#!/usr/bin/env node

import express, { type ErrorRequestHandler } from 'express'
import minimist from 'minimist'
import os from 'node:os'
import { join } from 'node:path'

const DEV = process.env.NODE_ENV === 'development'

function getArgs() {
  const cwd = process.cwd()
  const {
    base = process.env.BASE_PATH ?? '/',
    entry = 'main.server.js',
    port = '8080',
    root = './build',
    static: _static,
    template = 'index.html',
  } = minimist(process.argv.slice(2), {
    alias: {
      base: ['b'],
      entry: ['e'],
      port: ['p'],
      root: ['r'],
      static: ['s'],
      template: ['t'],
    },
  })

  const basePath = join('/', base.replace(/\/+$/, ''))
  const rootDir = join(cwd, root)
  const entryPath = join(rootDir, entry)
  const staticPath = _static ? join(cwd, _static) : undefined
  const templatePath = join(rootDir, template)

  return {
    basePath,
    entryPath,
    port,
    staticPath,
    templatePath,
  }
}

function getIP() {
  const interfaces = os.networkInterfaces()

  for (const iface of Object.values(interfaces)) {
    if (!iface) continue

    for (const config of iface) {
      if (config.family === 'IPv4' && !config.internal) {
        return config.address
      }
    }
  }

  return '127.0.0.1'
}

async function createServer({ basePath, entryPath, staticPath, templatePath }: { basePath: string; entryPath: string; staticPath?: string; templatePath: string }) {
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
    const { ssrMiddleware } = await import('./middlewares/index.js')

    server.use(await ssrMiddleware({
      entryPath,
      templatePath,
    }, {
      basePath,
      staticPath,
    }))
  }

  server.use(((err, req, res, next) => {
    res.status(err.status || 500).send(err)
  }) as ErrorRequestHandler)

  return server
}

async function main() {
  const { basePath, entryPath, port, staticPath, templatePath } = getArgs()
  const app = await createServer({ basePath, entryPath, staticPath, templatePath })

  app.listen(port)
    .on('error', (error: NodeJS.ErrnoException) => {
      if (error.syscall !== 'listen') throw error

      switch (error.code) {
        case 'EACCES':
          console.error(`Port ${port} requires elevated privileges`)
          process.exit(1)
        case 'EADDRINUSE':
          console.error(`Port ${port} is already in use`)
          process.exit(1)
        default:
          throw error
      }
    })
    .on('listening', () => {
      // eslint-disable-next-line no-console
      console.log('⛅️ Starting app...', 'OK', `${getIP()}:${port}`)
    })
}

main()
