/**
 * @file Generates a static site from the built server application.
 */

/* eslint-disable no-console, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */

import { XMLParser } from 'fast-xml-parser'
import fs from 'fs'
import path from 'path'
import request from 'supertest'
import * as buildArgs from '../config/build.args'

const { assetManifestFile, baseURL } = buildArgs
const publicDir = path.join(__dirname, '../build')
const { default: app } = require(publicDir)

async function generateSitemap() {
  try {
    const { text: str } = await request(app).get('/sitemap.xml')
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), str)

    console.log('Generating sitemap... OK')
  }
  catch (err) {
    console.log(`Generating sitemap... ERR: ${err}`)
    throw err
  }
}

async function generateRobots() {
  try {
    const { text: str } = await request(app).get('/robots.txt')
    fs.writeFileSync(path.join(publicDir, 'robots.txt'), str)

    console.log('Generating robots.txt... OK')
  }
  catch (err) {
    console.log(`Generating robots.txt... ERR: ${err}`)
    throw err
  }
}

async function generatePages() {
  const parser = new XMLParser()
  const sitemapFile = fs.readFileSync(path.join(publicDir, 'sitemap.xml'), 'utf-8')
  const sitemap = parser.parse(sitemapFile)
  const urls = sitemap.urlset.url.map((t: any) => t.loc?.replace(baseURL, '')).map((t: string) => t.startsWith('/') ? t : `/${t}`)

  for (const url of urls) {
    try {
      const { text: html } = await request(app).get(url)
      const file = path.join(publicDir, url, ...path.extname(url) ? [] : ['index.html'])
      fs.mkdirSync(path.dirname(file), { recursive: true })
      fs.writeFileSync(file, html)

      console.log(`Generating ${url}... OK: ${file}`)
    }
    catch (err) {
      console.log(`Generating ${url}... ERR: ${err}`)
      throw err
    }
  }
}

async function generate404() {
  const { text: html } = await request(app).get('/404')
  const file = path.join(publicDir, '404.html')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, html)

  console.log(`Generating <${file}>... OK`)
}

async function cleanup() {
  const files = [assetManifestFile, 'index.js']

  for (const file of files) {
    fs.rmSync(path.join(publicDir, file))
  }
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
