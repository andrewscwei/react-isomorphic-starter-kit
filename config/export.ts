/* eslint-disable no-console, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */

import fs, { createReadStream } from 'fs'
import path from 'path'
import { parseSitemap } from 'sitemap'
import request from 'supertest'

const publicDir = path.join(__dirname, '../build')
const { default: app, config } = require(publicDir)

async function generateSitemap() {
  const { text: str } = await request(app).get('/sitemap.xml')
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), str)
}

async function generatePages() {
  const res = await parseSitemap(createReadStream(path.join(publicDir, 'sitemap.xml')))
  const urls = res.map(t => t.url?.replace(config.url, '')).filter(Boolean)

  for (const url of urls) {
    const { text: html } = await request(app).get(url)
    const file = path.join(publicDir, url, ...path.extname(url) ? [] : ['index.html'])
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, html)

    console.log(`Generating <${file}>... OK`)
  }
}

async function generate404() {
  const { text: html } = await request(app).get('/404')
  const file = path.join(publicDir, '404.html')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, html)

  console.log(`Generating <${file}>... OK`)
}

async function reconcile() {
  const files = ['asset-manifest.json', 'index.js']

  for (const file of files) {
    fs.rmSync(path.join(publicDir, file))
  }
}

async function main() {
  await generateSitemap()
  await generatePages()
  await generate404()
  await reconcile()

  process.exit()
}

process.on('unhandledRejection', reason => {
  console.error('Prerendering app... ERR:', reason)
  process.exit(1)
})

main()
