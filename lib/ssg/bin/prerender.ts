#!/usr/bin/env ts-node

/**
 * @file Generates a static site from the built server application.
 */

import minimist from 'minimist'
import path from 'node:path'
import { cleanup, createServer, generatePages, generateRobots, generateSitemap } from '../src/index.js'

const cwd = process.cwd()
const {
  e: entry,
  l: locales,
  o = 'build/',
  p: basePath = process.env.BASE_PATH ?? '/',
  t: template,
  u: baseURL = process.env.BASE_URL ?? '',
} = minimist(process.argv.slice(2))

async function main() {
  const outDir = path.resolve(cwd, o)
  const entryPath = path.resolve(cwd, entry)
  const templatePath = path.resolve(cwd, template)
  const localesDir = path.resolve(cwd, locales)

  const app = createServer({ basePath, entryPath, templatePath })

  await generateSitemap(app, { outDir })
  await generateRobots(app, { outDir })
  await generatePages(app, { basePath, baseURL, localesDir, outDir })
  await cleanup({ outDir })

  process.exit(0)
}

main()
