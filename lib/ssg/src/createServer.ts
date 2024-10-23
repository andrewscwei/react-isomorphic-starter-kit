import express from 'express'
import { ssrMiddleware } from '../../ssr/index.js'

type Options = {
  basePath: string
  entryPath: string
  templatePath: string
}

export function createServer({ basePath, entryPath, templatePath }: Options) {
  const server = express()

  server.use(ssrMiddleware({
    entryPath,
    templatePath,
  }, {
    basePath,
  }))

  return server
}
