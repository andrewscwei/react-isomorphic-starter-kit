import type { Express } from 'express'
import fs from 'fs'
import path from 'path'
import request from 'supertest'

describe('server', () => {
  let app: Express

  beforeAll(async () => {
    const baseDir = path.join(__dirname, '../../build')
    expect(fs.existsSync(baseDir)).toBeTruthy()
    app = (await import(baseDir)).server
  })

  it('can ping /', async () => {
    const res = await request(app).get('/')
    expect(res.status).toEqual(200)
  })
})
