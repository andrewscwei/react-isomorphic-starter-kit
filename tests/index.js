import assert from 'assert';
import fs from 'fs';
import { before, describe, it } from 'mocha';
import path from 'path';
import request from 'supertest';

const baseDir = path.join(__dirname, '../build');
const app = require(path.join(baseDir, 'server')).default;

describe('app', () => {
  before(() => {
    assert(fs.existsSync(baseDir));
  });

  it('can ping /', async () => {
    const res = await request(app).get('/');
    assert(res.status === 200);
  });
});
