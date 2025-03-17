#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * @file Generates a static site from the built server application.
 */

import express from 'express'
import { XMLParser } from 'fast-xml-parser'
import minimist from 'minimist'
import { mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises'
import http from 'node:http'
import { dirname, extname, join, relative, resolve } from 'node:path'
import { build } from 'vite'
import { ssrMiddleware } from './middlewares/index.js'

const cwd = process.cwd()

const grey = (text: string) => `\x1b[90m${text}\x1b[0m`
const red = (text: string) => `\x1b[31m${text}\x1b[0m`
const green = (text: string) => `\x1b[32m${text}\x1b[0m`
const cyan = (text: string) => `\x1b[36m${text}\x1b[0m`

function getArgs() {
  const {
    base = process.env.BASE_PATH ?? '/',
    baseURL = process.env.BASE_URL ?? '',
    config = './vite.config.ts',
    entry,
    locales,
    out = './build/',
    routes,
    template,
  } = minimist(process.argv.slice(2), {
    alias: {
      base: ['b'],
      baseURL: ['u'],
      config: ['c'],
      entry: ['e'],
      locales: ['l'],
      out: ['o'],
      routes: ['r'],
      template: ['t'],
    },
  })

  const basePath = join('/', base.replace(/\/+$/, ''))
  const outDir = resolve(cwd, out)
  const configPath = resolve(cwd, config)
  const entryPath = resolve(cwd, entry)
  const templatePath = template ? resolve(cwd, template) : resolve(outDir, 'index.html')
  const localesDir = resolve(cwd, locales)
  const requiredRoutes = typeof routes === 'string' ? routes.split(',').map(t => t.trim()).filter(t => t) : []

  return {
    basePath,
    baseURL,
    configPath,
    entryPath,
    localesDir,
    outDir,
    requiredRoutes,
    templatePath,
  }
}

async function createApp(entryPath: string, templatePath: string, { basePath }: { basePath: string }) {
  const app = express()

  app.use(await ssrMiddleware({
    entryPath,
    templatePath,
  }, {
    basePath,
  }))

  return app
}

async function createSSRModule(entryPath: string, { configPath }: { configPath: string }) {
  const result: Record<string, any> = await build({ configFile: configPath, build: { ssr: entryPath } })
  const entryFile = result.output?.find((t: any) => t.isEntry === true)?.fileName

  if (!entryFile) {
    throw Error(`Failed to build SSR module with entry '${entryPath}'`)
  }

  return entryFile
}

async function getLocales(localesDir: string) {
  const files = await readdir(localesDir, { recursive: true, withFileTypes: true })
  const locales = files
    .filter(f => !f.isFile() || extname(f.name) === '.json')
    .map(f => f.name.replace('.json', ''))

  return locales
}

async function request(server: http.Server, path: string): Promise<string> {
  const info = server.address()
  let address: string
  let port: number

  if (typeof info === 'string') {
    address = info
  }
  else if (info) {
    address = info.address
    port = info.port
  }
  else {
    throw Error('Server address is not available')
  }

  return new Promise((_resolve, reject) => {
    const req = http.request({
      hostname: address,
      path,
      port,
      method: 'GET',
    }, res => {
      let data = ''
      res.on('data', chunk => (data += chunk))
      res.on('end', () => _resolve(data))
    })

    req.on('error', reject)
    req.end()
  })
}

async function generateSitemap(server: http.Server, { basePath, outDir }: { basePath: string; outDir: string }) {
  const route = join(basePath, '/sitemap.xml')

  try {
    const res = await request(server, route)
    const outFile = join(outDir, route)
    await writeFile(outFile, res)

    console.log(`${green('✓')} ${cyan(route)}`, '→', `${grey(relative(cwd, outDir))}${green(relative(outDir, outFile))}`)
  }
  catch (err) {
    console.error(`${red('⚠︎')} ${route}`)
    console.error(err)

    throw err
  }
}

async function generatePages(server: http.Server, { basePath, baseURL, localesDir, outDir, requiredRoutes }: { basePath: string; baseURL: string; localesDir: string; outDir: string; requiredRoutes: string[] }) {
  const parser = new XMLParser()
  const sitemapFile = await readFile(join(outDir, basePath, 'sitemap.xml'), 'utf-8')
  const sitemap = parser.parse(sitemapFile)
  const locales = await getLocales(localesDir)
  const urls: string[] = [].concat(sitemap.urlset.url).map((t: any) => t.loc).filter(t => t)
  const paths = urls.map(t => t.replace(new RegExp(`^${baseURL}`), '')).map(t => `/${t.replace(/^\/+|\/+$/, '')}`)
  const indexPaths = paths.map(t => new RegExp(`^/(${locales.join('|')})?/?$`).test(t) ? t : undefined).filter(t => t !== undefined)
  const requiredPaths = indexPaths.flatMap(t => requiredRoutes.map(r => join(t, r)))
  const pagePaths = Array.from(new Set([...paths, ...requiredPaths]))
  const notFoundPaths = indexPaths.map(t => join(t, '404'))
  const outFiles: Record<string, string> = {}

  const maxChars = [...pagePaths, ...notFoundPaths].reduce((max, url) => Math.max(max, url.length), 0)

  await Promise.all(pagePaths.map(async path => {
    const route = join(basePath, path)

    try {
      const res = await request(server, route)
      const outFile = join(outDir, route, ...extname(route) ? [] : ['index.html'])
      outFiles[outFile] = res

      console.log(`${green('✓')} ${cyan(route.padEnd(maxChars))}`, '→', `${grey(relative(cwd, outDir))}${green(relative(outDir, outFile))}`)
    }
    catch (err) {
      console.error(`${red('⚠︎')} ${red(route.padEnd(maxChars))}`)
      console.error(err)

      throw err
    }
  }))

  await Promise.all(notFoundPaths.map(async path => {
    const route = join(basePath, path)

    try {
      const res = await request(server, route)
      const outFile = join(outDir, `${route}.html`)
      outFiles[outFile] = res

      console.log(`${green('✓')} ${cyan(route.padEnd(maxChars))}`, '→', `${grey(relative(cwd, outDir))}${green(relative(outDir, outFile))}`)
    }
    catch (err) {
      console.error(`${red('⚠︎')} ${red(route.padEnd(maxChars))}`)
      console.error(err)

      throw err
    }
  }))

  await Promise.all(Object.entries(outFiles).map(async ([file, html]) => {
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, html)
  }))
}

async function cleanUp({ outDir }: { outDir: string }) {
  const files = await readdir(outDir, { recursive: false })
  const exts = ['.js', '.d.ts']
  const removing = files.filter(file => exts.find(ext => extname(file) === ext))

  if (removing.length === 0) return

  await Promise.all(removing.map(async file => {
    const removeFile = resolve(outDir, file)

    try {
      await unlink(removeFile)
      console.log(`${green('✕')} removed ${grey(relative(cwd, outDir))}${green(relative(outDir, removeFile))}`)
    }
    catch (err) {
      console.error(`${red('⚠︎')} Error removing ${grey(relative(cwd, outDir))}${green(relative(outDir, removeFile))}`)
      console.error(err)
    }
  }))
}

async function main() {
  console.log(green('Prerendering for production...'))

  const startTime = performance.now()
  const { basePath, baseURL, configPath, entryPath, localesDir, outDir, requiredRoutes, templatePath } = getArgs()
  const module = await createSSRModule(entryPath, { configPath })
  const app = await createApp(resolve(outDir, module), templatePath, { basePath })
  const server = app.listen()

  console.log('generating sitemap...')
  await generateSitemap(server, { basePath, outDir })

  console.log('rendering routes...')
  await generatePages(server, { basePath, baseURL, localesDir, outDir, requiredRoutes })

  console.log('cleaning files...')
  await cleanUp({ outDir })

  const endTime = performance.now()
  console.log(green(`✓ prerendered in ${(endTime - startTime).toFixed(0)}ms`))

  // Terminate process immediately instead of waiting for server to close.
  process.exit(0)
}

main()
