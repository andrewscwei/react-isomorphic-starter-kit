/* eslint-disable no-console, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */

import fs from 'fs'
import path from 'path'
import request from 'supertest'

const baseDir = path.join(__dirname, '../build')
const app = require(path.join(baseDir, 'app')).default

describe('app', () => {
  beforeAll(() => {
    expect(fs.existsSync(baseDir)).toBeTruthy()
  })

  it('can ping /', async () => {
    const res = await request(app).get('/')
    expect(res.status).toEqual(200)
  })
})
