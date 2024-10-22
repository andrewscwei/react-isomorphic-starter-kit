#!/usr/bin/env ts-node

/**
 * @file Generates a static site from the built server application.
 */

import express, { type Express } from 'express'
import { XMLParser } from 'fast-xml-parser'
import minimist from 'minimist'
import fs from 'node:fs'
import path from 'node:path'
import request from 'supertest'
import { ssrMiddleware } from '../../ssr/index.js'
import { debug } from '../../utils/debug.js'
import { joinURL } from '../../utils/joinURL.js'

const cwd = process.cwd()
const {
  e: entry,
  l: locales,
  o = 'build/',
  p: basePath = process.env.BASE_PATH ?? '/',
  t: template,
  u: baseURL = process.env.BASE_URL ?? '',
} = minimist(process.argv.slice(2))

function getSupportedLocales({ localesDir = '' }) {
  const files = fs.readdirSync(localesDir, { recursive: true, withFileTypes: true })
  const supportedLocales = files
    .filter(f => !f.isFile() || path.extname(f.name) === '.json')
    .map(f => f.name.replace('.json', ''))

  return supportedLocales
}

function createServer({ entryPath = '', templatePath = '' }) {
  const server = express()

  server.use(ssrMiddleware({
    entryPath,
    templatePath,
  }, {
    basePath,
  }))

  return server
}

async function generateSitemap(app: Express, { outDir = '' }) {
  try {
    const { text: str } = await request(app).get('/sitemap.xml')
    fs.writeFileSync(path.resolve(outDir, 'sitemap.xml'), str)

    debug('Generating sitemap.xml...', 'OK')
  }
  catch (err) {
    debug('Generating sitemap.xml...', 'ERR', err)
    throw err
  }
}

async function generateRobots(app: Express, { outDir = '' }) {
  try {
    const { text: str } = await request(app).get('/robots.txt')
    fs.writeFileSync(path.resolve(outDir, 'robots.txt'), str)

    debug('Generating robots.txt...', 'OK')
  }
  catch (err) {
    debug('Generating robots.txt...', 'ERR', err)
    throw err
  }
}

async function generatePages(app: Express, { outDir = '', localesDir = '' }) {
  const parser = new XMLParser()
  const sitemapFile = fs.readFileSync(path.resolve(outDir, 'sitemap.xml'), 'utf-8')
  const sitemap = parser.parse(sitemapFile)
  const supportedLocales = getSupportedLocales({ localesDir })
  const pageURLs: string[] = [].concat(sitemap.urlset.url).map((t: Record<string, string | undefined>) => t.loc?.replace(new RegExp(`^${baseURL}`), '')).map(t => t?.startsWith('/') ? t : `/${t}`)
  const notFoundURLs = pageURLs.map(url => new RegExp(`^/(${supportedLocales.join('|')})?/?$`).test(url) ? joinURL(url, '404') : undefined).filter(t => t !== undefined)
  const agent = request(app)
  const writables: Record<string, string> = {}

  for (const url of pageURLs) {
    try {
      const { text: html } = await agent.get(joinURL(basePath, url))
      const file = path.join(outDir, url, ...path.extname(url) ? [] : ['index.html'])
      writables[file] = html

      debug(`Generating ${url}...`, 'OK', file)
    }
    catch (err) {
      debug(`Generating ${url}...`, 'ERR', err)
      throw err
    }
  }

  for (const url of notFoundURLs) {
    try {
      const { text: html } = await agent.get(joinURL(basePath, url))
      const file = path.join(outDir, `${url}.html`)
      writables[file] = html

      debug(`Generating ${url}...`, 'OK', file)
    }
    catch (err) {
      debug(`Generating ${url}...`, 'ERR', err)
      throw err
    }
  }

  for (const [file, html] of Object.entries(writables)) {
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, html)
  }
}

async function cleanup({ outDir = '' }) {
  const files = fs.readdirSync(outDir)
  const removeExtensions = ['.js', '.d.ts']

  files.forEach(file => {
    if (removeExtensions.find(t => file.endsWith(t))) {
      const filePath = path.resolve(outDir, file)

      fs.unlink(filePath, err => {
        if (err) {
          console.error(`Error deleting file ${filePath}: ${err}`)
          return
        }

        debug(`Cleaning up file ${filePath}...`, 'OK')
      })
    }
  })
}

async function main() {
  const outDir = path.resolve(cwd, o)
  const entryPath = path.resolve(cwd, entry)
  const templatePath = path.resolve(cwd, template)
  const localesDir = path.resolve(cwd, locales)

  const app = createServer({ entryPath, templatePath })

  await generateSitemap(app, { outDir })
  await generateRobots(app, { outDir })
  await generatePages(app, { localesDir, outDir })
  await cleanup({ outDir })

  process.exit(0)
}

main()
