/* eslint-disable no-console */

import fs from 'fs'
import path from 'path'
import request from 'supertest'

const baseDir = path.join(__dirname, '../build')
const app = require(path.join(baseDir, 'index')).default

describe('app', () => {
  beforeAll(() => {
    expect(fs.existsSync(baseDir)).toBeTruthy()
  })

  it('can ping /', async () => {
    const res = await request(app).get('/')
    expect(res.status).toEqual(200)
  })
})
