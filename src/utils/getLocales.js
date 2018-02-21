import config from '../../config/app.conf';
import path from 'path';
import fs from 'fs';

export default function getLocales() {
  let locales = fs.readdirSync(path.join(config.cwd, `config/locales`))
    .filter(v => !(/(^|\/)\.[^/.]/g).test(v))
    .map(val => path.basename(val, `.json`));
  return locales;
}