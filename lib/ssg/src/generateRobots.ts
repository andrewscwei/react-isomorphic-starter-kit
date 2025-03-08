import { type Express } from 'express'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import request from 'supertest'
import { debug } from '../../utils/debug.js'

type Options = {
  outDir: string
}

export async function generateRobots(app: Express, { outDir }: Options) {
  try {
    const { text: str } = await request(app).get('/robots.txt')
    await writeFile(resolve(outDir, 'robots.txt'), str)

    debug('Generating robots.txt...', 'OK')
  }
  catch (err) {
    debug('Generating robots.txt...', 'ERR', err)
    throw err
  }
}
