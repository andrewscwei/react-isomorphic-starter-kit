/**
 * @file Resolves fingerprinted asset paths using the generated asset manifest
 *       file.
 */

import config from '@/../config/app.conf';
import debug from 'debug';
import path from 'path';

const log = debug(`app:utils:resolveAssetPath`);

// Store the manifest file if it exists.
let manifest = undefined;

try {
  manifest = require(path.join(config.cwd, `build/public/asset-manifest.json`));
}
catch (err) {
  log(err.message);
}

export default function resolveAssetPath(p) {
  const publicPath = config.env === `production` ? config.build.publicPath : `/`;
  const normalizedPath = path.join.apply(null, p.split(`/`));

  let output = `${publicPath}${normalizedPath}`;

  if (manifest && manifest.hasOwnProperty(normalizedPath)) {
    output = `${publicPath}${manifest[normalizedPath]}`;
  }
  else if (manifest && manifest.hasOwnProperty(`${publicPath}${normalizedPath}`)) {
    output = `${publicPath}${manifest[`${publicPath}${normalizedPath}`]}`;
  }

  return output;
}