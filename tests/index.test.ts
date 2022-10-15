import fs from 'fs'
import path from 'path'
import request from 'supertest'

describe('app', () => {
  let app: any

  beforeAll(async () => {
    const baseDir = path.join(__dirname, '../build')
    expect(fs.existsSync(baseDir)).toBeTruthy()
    app = (await import(baseDir)).default
  })

  it('can ping /', async () => {
    const res = await request(app).get('/')
    expect(res.status).toEqual(200)
  })
})
