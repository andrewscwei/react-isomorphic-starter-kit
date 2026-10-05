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

import { ssrMiddleware } from './middlewares/ssrMiddleware.js'

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
    out = './build/',
    routes,
    template,
  } = minimist(process.argv.slice(2), {
    alias: {
      base: ['b'],
      baseURL: ['u'],
      config: ['c'],
      entry: ['e'],
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
  const requiredRoutes = typeof routes === 'string' ? routes.split(',').map(r => r.trim()).filter(r => r) : []

  return {
    basePath,
    baseURL,
    configPath,
    entryPath,
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
  const result: Record<string, any> = await build({ build: { ssr: entryPath }, configFile: configPath })
  const outputFiles = result.output as any[] || []

  const out = outputFiles.reduce((acc, file) => {
    if (file.isEntry === true) {
      acc.entryFile = file.fileName
    } else {
      acc.chunkFiles.push(file.fileName)
    }
    return acc
  }, { chunkFiles: [] as string[], entryFile: undefined })

  if (!out.entryFile) {
    throw new Error(`Failed to build SSR module with entry '${entryPath}'`)
  }

  return out
}

async function getLocales(entryPath: string): Promise<string[]> {
  const module = await import(entryPath)

  return module.locales ?? []
}

async function request(server: http.Server, path: string): Promise<string> {
  const info = server.address()
  let address: string
  let port: number

  if (typeof info === 'string') {
    address = info
  } else if (info) {
    address = info.address
    port = info.port
  } else {
    throw Error('Server address is not available')
  }

  return new Promise((_resolve, reject) => {
    const req = http.request({
      hostname: address,
      method: 'GET',
      path,
      port,
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
  } catch (err) {
    console.error(`${red('⚠︎')} ${route}`)
    console.error(err)

    throw err
  }
}

async function generatePages(server: http.Server, { basePath, baseURL, entryPath, outDir, requiredRoutes }: { basePath: string; baseURL: string; entryPath: string; outDir: string; requiredRoutes: string[] }) {
  const parser = new XMLParser()
  const sitemapFile = await readFile(join(outDir, basePath, 'sitemap.xml'), 'utf-8')
  const sitemap = parser.parse(sitemapFile)
  const locales = await getLocales(entryPath)
  const urls: string[] = [].concat(sitemap.urlset.url).map((u: any) => u.loc).filter(u => u)
  const escapedBaseURL = baseURL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const escapedLocales = locales.map(l => l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const paths = urls.map(u => u.replace(new RegExp(`^${escapedBaseURL}`), '')).map(u => `/${u.replace(/^\/+|\/+$/, '')}`)
  const indexPaths = paths.map(p => new RegExp(`^/(${escapedLocales.join('|')})?/?$`).test(p) ? p : undefined).filter(p => p !== undefined)
  const requiredPaths = indexPaths.flatMap(p => requiredRoutes.map(r => join(p, r)))
  const pagePaths = Array.from(new Set([...paths, ...requiredPaths]))
  const notFoundPaths = indexPaths.map(p => join(p, '404'))
  const outFiles: Record<string, string> = {}

  const maxChars = [...pagePaths, ...notFoundPaths].reduce((max, url) => Math.max(max, url.length), 0)

  await Promise.all(pagePaths.map(async path => {
    const route = join(basePath, path)

    try {
      const res = await request(server, route)
      const outFile = join(outDir, route, ...extname(route) ? [] : ['index.html'])
      outFiles[outFile] = res

      console.log(`${green('✓')} ${cyan(route.padEnd(maxChars))}`, '→', `${grey(relative(cwd, outDir))}${green(relative(outDir, outFile))}`)
    } catch (err) {
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
    } catch (err) {
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

async function cleanUp(files: string[], { exts, outDir }: { exts: string[]; outDir: string }) {
  const res = await readdir(outDir, { recursive: false })
  const removing = [...res.filter(f => exts.find(ext => extname(f) === ext)), ...files]

  if (removing.length === 0) return

  await Promise.all(removing.map(async file => {
    const removeFile = resolve(outDir, file)

    try {
      await unlink(removeFile)
      console.log(`${green('✕')} removed ${grey(relative(cwd, outDir))}${green(relative(outDir, removeFile))}`)
    } catch (err) {
      console.error(`${red('⚠︎')} Error removing ${grey(relative(cwd, outDir))}${green(relative(outDir, removeFile))}`)
      console.error(err)
    }
  }))
}

async function main() {
  console.log(green('Prerendering for production...'))

  const startTime = performance.now()
  const { basePath, baseURL, configPath, entryPath, outDir, requiredRoutes, templatePath } = getArgs()
  const { chunkFiles, entryFile } = await createSSRModule(entryPath, { configPath })
  const builtEntryPath = resolve(outDir, entryFile)
  const app = await createApp(builtEntryPath, templatePath, { basePath })
  const server = app.listen()

  console.log('generating sitemap...')
  await generateSitemap(server, { basePath, outDir })

  console.log('rendering routes...')
  await generatePages(server, { basePath, baseURL, entryPath: builtEntryPath, outDir, requiredRoutes })

  console.log('cleaning files...')
  await cleanUp([entryFile, ...chunkFiles], { exts: [], outDir })

  const endTime = performance.now()
  console.log(green(`✓ prerendered in ${(endTime - startTime).toFixed(0)}ms`))

  // Terminate process immediately instead of waiting for server to close.
  process.exit(0)
}

main()
