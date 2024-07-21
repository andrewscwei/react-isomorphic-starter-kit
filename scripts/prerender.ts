/**
 * @file Generates a static site from the built server application.
 */

/* eslint-disable no-console */

import { XMLParser } from 'fast-xml-parser'
import fs from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import request from 'supertest'
import { joinURL } from '../lib/utils/joinURL.js'
import { DEFAULT_LOCALE } from '../src/app.config.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const baseURL = process.env.BASE_URL ?? ''
const basePath = process.env.BASE_PATH ?? '/'
const outDir = path.resolve(__dirname, '../build')
const { app } = await import(path.resolve(outDir, 'index.js'))

function getLocales() {
  const files = fs.readdirSync(path.resolve(__dirname, '../src/locales'), { recursive: true, withFileTypes: true })
  const locales = files.filter(f => !f.isFile() || path.extname(f.name) === '.json').map(f => f.name.replace('.json', ''))

  return locales
}

async function generateSitemap() {
  try {
    const { text: str } = await request(app).get('/sitemap.xml')
    fs.writeFileSync(path.resolve(outDir, 'sitemap.xml'), str)

    console.log('Generating sitemap.xml... OK')
  }
  catch (err) {
    console.log(`Generating sitemap.xml... ERR: ${err}`)
    throw err
  }
}

async function generateRobots() {
  try {
    const { text: str } = await request(app).get('/robots.txt')
    fs.writeFileSync(path.resolve(outDir, 'robots.txt'), str)

    console.log('Generating robots.txt... OK')
  }
  catch (err) {
    console.log(`Generating robots.txt... ERR: ${err}`)
    throw err
  }
}

async function generatePages() {
  const parser = new XMLParser()
  const sitemapFile = fs.readFileSync(path.resolve(outDir, 'sitemap.xml'), 'utf-8')
  const sitemap = parser.parse(sitemapFile)
  const locales = getLocales()
  const pageURLs = sitemap.urlset.url.map((t: Record<string, string | undefined>) => t.loc?.replace(new RegExp(`^${baseURL}`), '')).map((t: string) => t.startsWith('/') ? t : `/${t}`)
  const notFoundURLs = locales.map(t => t === DEFAULT_LOCALE ? '/404' : `/${t}/404`)
  const agent = request(app)
  const writables: Record<string, string> = {}

  for (const url of pageURLs) {
    try {
      const { text: html } = await agent.get(joinURL(basePath, url))
      const file = path.join(outDir, url, ...path.extname(url) ? [] : ['index.html'])
      writables[file] = html

      console.log(`Generating ${url}... OK: ${file}`)
    }
    catch (err) {
      console.log(`Generating ${url}... ERR: ${err}`)
      throw err
    }
  }

  for (const url of notFoundURLs) {
    try {
      const { text: html } = await agent.get(joinURL(basePath, url))
      const file = path.join(outDir, `${url}.html`)
      writables[file] = html

      console.log(`Generating ${url}... OK: ${file}`)
    }
    catch (err) {
      console.log(`Generating ${url}... ERR: ${err}`)
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

        console.log(`File deleted: ${filePath}`)
      })
    }
  })

  fs.rmdirSync(path.resolve(outDir, 'lib'), { recursive: true })
}

async function main() {
  await generateSitemap()
  await generateRobots()
  await generatePages()
  await cleanup()

  process.exit()
}

process.on('unhandledRejection', reason => {
  console.error('Prerendering app... ERR:', reason)
  process.exit(1)
})

main()
