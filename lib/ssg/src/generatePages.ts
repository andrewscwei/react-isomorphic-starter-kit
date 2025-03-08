import { type Express } from 'express'
import { XMLParser } from 'fast-xml-parser'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, extname, join, resolve } from 'node:path'
import request from 'supertest'
import { debug } from '../../utils/debug.js'
import { joinURL } from '../../utils/joinURL.js'

type Options = {
  basePath: string
  baseURL: string
  outDir: string
  localesDir: string
}

async function getLocales(localesDir: string) {
  const files = await readdir(localesDir, { recursive: true, withFileTypes: true })
  const locales = files
    .filter(f => !f.isFile() || extname(f.name) === '.json')
    .map(f => f.name.replace('.json', ''))

  return locales
}

export async function generatePages(app: Express, { basePath, baseURL, outDir, localesDir }: Options) {
  const parser = new XMLParser()
  const sitemapFile = await readFile(resolve(outDir, 'sitemap.xml'), 'utf-8')
  const sitemap = parser.parse(sitemapFile)
  const locales = await getLocales(localesDir)
  const pageURLs: string[] = [].concat(sitemap.urlset.url).map((t: Record<string, string | undefined>) => t.loc?.replace(new RegExp(`^${baseURL}`), '')).map(t => t?.startsWith('/') ? t : `/${t}`)
  const notFoundURLs = pageURLs.map(url => new RegExp(`^/(${locales.join('|')})?/?$`).test(url) ? joinURL(url, '404') : undefined).filter(t => t !== undefined)
  const agent = request(app)
  const writables: Record<string, string> = {}

  for (const url of pageURLs) {
    try {
      const { text: html } = await agent.get(joinURL(basePath, url))
      const file = join(outDir, url, ...extname(url) ? [] : ['index.html'])
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
      const file = join(outDir, `${url}.html`)
      writables[file] = html

      debug(`Generating ${url}...`, 'OK', file)
    }
    catch (err) {
      debug(`Generating ${url}...`, 'ERR', err)
      throw err
    }
  }

  for (const [file, html] of Object.entries(writables)) {
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, html)
  }
}
