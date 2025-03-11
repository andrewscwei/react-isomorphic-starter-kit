#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * @file Generates a static site from the built server application.
 */

import express, { type Express } from 'express'
import { XMLParser } from 'fast-xml-parser'
import minimist from 'minimist'
import { mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises'
import { dirname, extname, join, relative, resolve } from 'node:path'
import request from 'supertest'
import { ssrMiddleware } from './middlewares/index.js'

const resetColor = '\x1b[0m'
const greyColor = '\x1b[90m'
const redColor = '\x1b[31m'
const greenColor = '\x1b[32m'
const cyanColor = '\x1b[36m'
const cwd = process.cwd()

function getArgs() {
  const {
    e: entry,
    l: locales,
    o = 'build/',
    p: basePath = process.env.BASE_PATH ?? '/',
    r,
    t: template,
    u: baseURL = process.env.BASE_URL ?? '',
  } = minimist(process.argv.slice(2))

  const outDir = resolve(cwd, o)
  const entryPath = resolve(cwd, entry)
  const templatePath = resolve(cwd, template)
  const localesDir = resolve(cwd, locales)
  const additionalRoutes = typeof r === 'string' ? r.split(',').map(t => t.trim()).filter(t => t) : []

  return {
    additionalRoutes,
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

async function generateSitemap(app: Express, { outDir = '' } = {}) {
  const route = '/sitemap.xml'

  try {
    const { text: str } = await request(app).get(route)
    const outFile = resolve(outDir, 'sitemap.xml')
    await writeFile(outFile, str)

    console.log(`${greenColor}✓${resetColor} ${cyanColor}${route}${resetColor}`, '→', `${greyColor}${relative(cwd, outDir)}${resetColor}${greenColor}${relative(outDir, outFile)}${resetColor}`)
  }
  catch (err) {
    console.error(`${redColor}⚠︎${resetColor} ${route}`)
    console.error(err)
    throw err
  }
}

async function generatePages(app: Express, { additionalRoutes = [] as string[], basePath = '', baseURL = '', outDir = '', localesDir = '' } = {}) {
  const parser = new XMLParser()
  const sitemapFile = await readFile(resolve(outDir, 'sitemap.xml'), 'utf-8')
  const sitemap = parser.parse(sitemapFile)
  const locales = await getLocales(localesDir)
  const sitemapURLs = [].concat(sitemap.urlset.url).map((t: Record<string, string | undefined>) => t.loc?.replace(new RegExp(`^${baseURL}`), '')).map(t => t?.startsWith('/') ? t : `/${t}`)
  const localeRootURLs = sitemapURLs.map(url => new RegExp(`^/(${locales.join('|')})?/?$`).test(url) ? url : undefined).filter(t => t !== undefined)
  const additionalURLs = localeRootURLs.flatMap(url => additionalRoutes.map(route => join(url, route)))
  const notFoundURLs = localeRootURLs.map(url => join(url, '404'))
  const pageURLs = Array.from(new Set([...sitemapURLs, ...additionalURLs]))
  const agent = request(app)
  const outFiles: Record<string, string> = {}

  const maxCharacters = [...pageURLs, ...notFoundURLs].reduce((max, url) => Math.max(max, url.length), 0)

  await Promise.all(pageURLs.map(async url => {
    try {
      const { text: html } = await agent.get(join(basePath, url))
      const outFile = join(outDir, url, ...extname(url) ? [] : ['index.html'])
      outFiles[outFile] = html

      console.log(`${greenColor}✓${resetColor} ${cyanColor}${url.padEnd(maxCharacters)}${resetColor}`, '→', `${greyColor}${relative(cwd, outDir)}${resetColor}${greenColor}${relative(outDir, outFile)}${resetColor}`)
    }
    catch (err) {
      console.error(`${redColor}⚠︎${resetColor} ${cyanColor}${url.padEnd(maxCharacters)}${resetColor}`, '→', err)
      throw err
    }
  }))

  await Promise.all(notFoundURLs.map(async url => {
    try {
      const { text: html } = await agent.get(join(basePath, url))
      const outFile = join(outDir, `${url}.html`)
      outFiles[outFile] = html

      console.log(`${greenColor}✓${resetColor} ${cyanColor}${url.padEnd(maxCharacters)}${resetColor}`, '→', `${greyColor}${relative(cwd, outDir)}${resetColor}${greenColor}${relative(outDir, outFile)}${resetColor}`)
    }
    catch (err) {
      console.error(`${redColor}⚠︎${resetColor} ${cyanColor}${url.padEnd(maxCharacters)}${resetColor}`)
      console.error(err)

      throw err
    }
  }))

  await Promise.all(Object.entries(outFiles).map(async ([file, html]) => {
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, html)
  }))
}

async function cleanup({ outDir = '' } = {}) {
  const files = await readdir(outDir, { recursive: false })
  const removeExtensions = ['.js', '.d.ts']
  const filtered = files.filter(file => removeExtensions.find(ext => extname(file) === ext))

  if (filtered.length === 0) return

  await Promise.all(filtered.map(async file => {
    const removeFile = resolve(outDir, file)

    try {
      await unlink(removeFile)
      console.log(`${greenColor}✓${resetColor} Removed ${greyColor}${relative(cwd, outDir)}${resetColor}${greenColor}${relative(outDir, removeFile)}${resetColor}`)
    }
    catch (err) {
      console.error(`${redColor}⚠︎${resetColor} Error removing ${greyColor}${relative(cwd, outDir)}${resetColor}${greenColor}${relative(outDir, removeFile)}${resetColor}`)
      console.error(err)
    }
  }))
}

async function main() {
  const { additionalRoutes, basePath, baseURL, entryPath, localesDir, outDir, templatePath } = getArgs()
  const app = await createServer({ basePath, entryPath, templatePath })

  console.log('\nGenerating sitemap...')
  await generateSitemap(app, { outDir })

  console.log('\nPrerendering routes...')
  await generatePages(app, { additionalRoutes, basePath, baseURL, localesDir, outDir })

  console.log('\nCleaning up files...')
  await cleanup({ outDir })

  process.exit(0)
}

main()
