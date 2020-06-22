import assert from 'assert';
import fs from 'fs';
import { describe, it } from 'mocha';
import path from 'path';
import request from 'supertest';

const baseDir = path.join(__dirname, '../build');
const app = require(path.join(baseDir, 'server')).default;

describe('app', () => {
  before(() => {
    console.log(`Verifying built files at ${baseDir}...`);
    assert(fs.existsSync(baseDir));
    console.log(`Verifying built files at ${baseDir}... OK`);
  });

  it('can ping /', async () => {
    const res = await request(app).get('/');
    assert(res.status === 200);
  });
});
