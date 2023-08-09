/* eslint-disable no-console, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */

import { XMLParser } from 'fast-xml-parser'
import fs from 'fs'
import path from 'path'
import request from 'supertest'
import * as buildArgs from '../config/build.args'
import joinURL from '../src/base/utils/joinURL'

const publicDir = path.join(__dirname, '../build')
const { default: app, config: appConf } = require(publicDir)
const { BASE_PATH, BASE_URL } = appConf

async function generateSitemap() {
  try {
    const { text: str } = await request(app).get(joinURL(BASE_PATH, '/sitemap.xml'))
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), str)

    console.log('Generating sitemap... OK')
  }
  catch (err) {
    console.log(`Generating sitemap... ERR: ${err}`)
    throw err
  }
}

async function generateRobotsTXT() {
  try {
    const { text: str } = await request(app).get(joinURL(BASE_PATH, '/robots.txt'))
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
  const urls = sitemap.urlset.url.map((t: any) => t.loc?.replace(BASE_URL, '')).map((t: string) => t.startsWith('/') ? t : `/${t}`)

  for (const url of urls) {
    try {
      const { text: html } = await request(app).get(joinURL(BASE_PATH, url))
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
  const { text: html } = await request(app).get(joinURL(BASE_PATH, '/404'))
  const file = path.join(publicDir, '404.html')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, html)

  console.log(`Generating <${file}>... OK`)
}

async function cleanup() {
  const files = [buildArgs.assetManifestFile, 'index.js']

  for (const file of files) {
    fs.rmSync(path.join(publicDir, file))
  }
}

async function main() {
  await generateSitemap()
  await generateRobotsTXT()
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
