import { type Express } from 'express'
import fs from 'node:fs'
import path from 'node:path'
import request from 'supertest'
import { debug } from '../../utils/debug.js'

type Options = {
  outDir: string
}

export async function generateSitemap(app: Express, { outDir }: Options) {
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
