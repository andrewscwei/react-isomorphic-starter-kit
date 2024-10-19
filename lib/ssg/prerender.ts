/**
 * @file Generates a static site from the built server application.
 */

import { XMLParser } from 'fast-xml-parser'
import fs from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import request from 'supertest'
import { debug } from '../utils/debug.js'
import { joinURL } from '../utils/joinURL.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const baseURL = process.env.BASE_URL ?? ''
const basePath = process.env.BASE_PATH ?? '/'
const outDir = path.resolve(__dirname, '../../build')
const localesDir = path.resolve(__dirname, '../../src/locales')
const serverFile = path.resolve(__dirname, './', 'server.ts')
const { app } = await import(serverFile)

function getLocales() {
  const files = fs.readdirSync(localesDir, { recursive: true, withFileTypes: true })
  const locales = files.filter(f => !f.isFile() || path.extname(f.name) === '.json').map(f => f.name.replace('.json', ''))

  return locales
}

async function generateSitemap() {
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

async function generateRobots() {
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

async function generatePages() {
  const parser = new XMLParser()
  const sitemapFile = fs.readFileSync(path.resolve(outDir, 'sitemap.xml'), 'utf-8')
  const sitemap = parser.parse(sitemapFile)
  const locales = getLocales()
  const pageURLs: string[] = sitemap.urlset.url.map((t: Record<string, string | undefined>) => t.loc?.replace(new RegExp(`^${baseURL}`), '')).map((t: string) => t.startsWith('/') ? t : `/${t}`)
  const notFoundURLs = pageURLs.map(url => new RegExp(`^/(${locales.join('|')})?/?$`).test(url) ? joinURL(url, '404') : undefined).filter(t => t !== undefined)
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

async function cleanup() {
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
  await generateSitemap()
  await generateRobots()
  await generatePages()
  await cleanup()

  process.exit()
}

main()
