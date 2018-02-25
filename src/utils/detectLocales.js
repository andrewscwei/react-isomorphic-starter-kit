import fs from 'fs';
import path from 'path';

export default function detectLocales(dir) {
  try {
    return fs
      .readdirSync(dir)
      .filter(v => !(/(^|\/)\.[^/.]/g).test(v))
      .map(val => path.basename(val, `.json`));
  }
  catch (err) {
    return [];
  }
}