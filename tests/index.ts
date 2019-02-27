import assert from 'assert';
import fs from 'fs';
import { describe, it } from 'mocha';
import path from 'path';
import request from 'supertest';

const baseDir = path.join(__dirname, '../build');
const app = require(path.join(baseDir, 'server')).default;
const debug = require('debug')('test');

describe('app', () => {
  before(() => {
    debug(`Verifying built files at ${baseDir}...`);
    assert(fs.existsSync(baseDir));
    debug(`Verifying built files at ${baseDir}... OK`);
  });

  it('can ping /', async () => {
    const res = await request(app).get('/');
    assert(res.status === 200);
  });
});
