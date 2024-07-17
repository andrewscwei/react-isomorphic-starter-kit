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

const __dirname = dirname(fileURLToPath(import.meta.url))
const baseURL = process.env.BASE_URL ?? ''
const basePath = process.env.BASE_PATH ?? '/'
const outDir = path.resolve(__dirname, '../build')
const { default: app } = await import(path.resolve(outDir, 'index.js'))

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
  const urls = sitemap.urlset.url.map((t: Record<string, string | undefined>) => t.loc?.replace(new RegExp(`^${baseURL}`), '')).map((t: string) => t.startsWith('/') ? t : `/${t}`)
  const agent = request(app)
  const outputs: Record<string, string> = {}

  for (const url of urls) {
    try {
      const { text: html } = await agent.get(joinURL(basePath, url))
      const file = path.join(outDir, url, ...path.extname(url) ? [] : ['index.html'])
      outputs[file] = html

      console.log(`Generating ${url}... OK: ${file}`)
    }
    catch (err) {
      console.log(`Generating ${url}... ERR: ${err}`)
      throw err
    }
  }

  for (const [file, html] of Object.entries(outputs)) {
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, html)
  }
}

async function generate404() {
  const { text: html } = await request(app).get(joinURL(basePath, '/404'))
  const file = path.resolve(outDir, '404.html')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, html)

  console.log(`Generating 404.html... OK: ${file}`)
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
  await generate404()
  await cleanup()

  process.exit()
}

process.on('unhandledRejection', reason => {
  console.error('Prerendering app... ERR:', reason)
  process.exit(1)
})

main()
