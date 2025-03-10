#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * @file Generates a static site from the built server application.
 */

import express, { type Express } from 'express'
import { XMLParser } from 'fast-xml-parser'
import minimist from 'minimist'
import { mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises'
import { dirname, extname, join, resolve } from 'node:path'
import request from 'supertest'
import { ssrMiddleware } from './middlewares/index.js'

function getArgs() {
  const cwd = process.cwd()
  const {
    e: entry,
    l: locales,
    o = 'build/',
    p: basePath = process.env.BASE_PATH ?? '/',
    t: template,
    u: baseURL = process.env.BASE_URL ?? '',
  } = minimist(process.argv.slice(2))

  const outDir = resolve(cwd, o)
  const entryPath = resolve(cwd, entry)
  const templatePath = resolve(cwd, template)
  const localesDir = resolve(cwd, locales)

  return {
    basePath,
    baseURL,
    entryPath,
    localesDir,
    outDir,
    templatePath,
  }
}

async function createServer({ basePath, entryPath, templatePath }: Record<string, string>) {
  const server = express()

  server.use(ssrMiddleware({
    entryPath,
    templatePath,
  }, {
    basePath,
  }))

  return server
}

async function getLocales(localesDir: string) {
  const files = await readdir(localesDir, { recursive: true, withFileTypes: true })
  const locales = files
    .filter(f => !f.isFile() || extname(f.name) === '.json')
    .map(f => f.name.replace('.json', ''))

  return locales
}

async function generatePages(app: Express, { basePath, baseURL, outDir, localesDir }: Record<string, string>) {
  const parser = new XMLParser()
  const sitemapFile = await readFile(resolve(outDir, 'sitemap.xml'), 'utf-8')
  const sitemap = parser.parse(sitemapFile)
  const locales = await getLocales(localesDir)
  const pageURLs: string[] = [].concat(sitemap.urlset.url).map((t: Record<string, string | undefined>) => t.loc?.replace(new RegExp(`^${baseURL}`), '')).map(t => t?.startsWith('/') ? t : `/${t}`)
  const notFoundURLs = pageURLs.map(url => new RegExp(`^/(${locales.join('|')})?/?$`).test(url) ? join(url, '404') : undefined).filter(t => t !== undefined)
  const agent = request(app)
  const writables: Record<string, string> = {}

  for (const url of pageURLs) {
    try {
      const { text: html } = await agent.get(join(basePath, url))
      const file = join(outDir, url, ...extname(url) ? [] : ['index.html'])
      writables[file] = html

      console.log(`✓ Generating ${url}...`, 'OK', file)
    }
    catch (err) {
      console.error(`⚠︎ Generating ${url}...`, 'ERR', err)
      throw err
    }
  }

  for (const url of notFoundURLs) {
    try {
      const { text: html } = await agent.get(join(basePath, url))
      const file = join(outDir, `${url}.html`)
      writables[file] = html

      console.log(`✓ Generating ${url}...`, 'OK', file)
    }
    catch (err) {
      console.error(`⚠︎ Generating ${url}...`, 'ERR', err)
      throw err
    }
  }

  for (const [file, html] of Object.entries(writables)) {
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, html)
  }
}

async function generateRobots(app: Express, { outDir }: Record<string, string>) {
  try {
    const { text: str } = await request(app).get('/robots.txt')
    await writeFile(resolve(outDir, 'robots.txt'), str)

    console.log('✓ Generating robots.txt...', 'OK')
  }
  catch (err) {
    console.error('⚠︎ Generating robots.txt...', 'ERR', err)
    throw err
  }
}

async function generateSitemap(app: Express, { outDir }: Record<string, string>) {
  try {
    const { text: str } = await request(app).get('/sitemap.xml')
    await writeFile(resolve(outDir, 'sitemap.xml'), str)

    console.log('✓ Generating sitemap.xml...', 'OK')
  }
  catch (err) {
    console.error('⚠︎ Generating sitemap.xml...', 'ERR', err)
    throw err
  }
}

async function cleanup({ outDir }: Record<string, string>) {
  const files = await readdir(outDir, { recursive: false })
  const removeExtensions = ['.js', '.d.ts']

  Promise.all(files.map(async file => {
    if (!removeExtensions.find(t => extname(file) === t)) return

    const filePath = resolve(outDir, file)

    try {
      await unlink(filePath)
      console.log(`✓ Cleaning up file ${filePath}...`, 'OK')
    }
    catch (err) {
      console.error(`⚠︎ Error deleting file ${filePath}: ${err}`)
    }
  }))
}

async function main() {
  const { basePath, baseURL, entryPath, localesDir, outDir, templatePath } = getArgs()
  const app = await createServer({ basePath, entryPath, templatePath })

  await generateSitemap(app, { outDir })
  await generateRobots(app, { outDir })
  await generatePages(app, { basePath, baseURL, localesDir, outDir })
  await cleanup({ outDir })

  process.exit(0)
}

main()
