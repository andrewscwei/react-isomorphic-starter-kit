import { type Express } from 'express'
import fs from 'node:fs'
import path from 'node:path'
import request from 'supertest'
import { debug } from '../../utils/debug.js'

type Options = {
  outDir: string
}

export async function generateRobots(app: Express, { outDir }: Options) {
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
