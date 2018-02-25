/**
 * @file Resolves fingerprinted asset paths using the generated asset manifest
 *       file.
 */

import config from '@/../config/app.conf';
import path from 'path';

/**
 * Fetches the fingerprinted path of an asset using the provided manifest
 * object. If no manifest object is provided, the path is simply normalized and
 * returned.
 *
 * @param {string} pathToResolve - The asset path to resolve.
 * @param {Object} [manifest] - The manifest object.
 *
 * @return {string} The resolved path.
 */
export default function resolveAssetPath(pathToResolve, manifest = undefined) {
  const publicPath = process.env.NODE_ENV === `production` ? config.build.publicPath : `/`;
  const normalizedPath = path.join.apply(null, pathToResolve.split(`/`));

  let output = `${publicPath}${normalizedPath}`;

  if (manifest && manifest.hasOwnProperty(normalizedPath)) {
    output = `${publicPath}${manifest[normalizedPath]}`;
  }
  else if (manifest && manifest.hasOwnProperty(`${publicPath}${normalizedPath}`)) {
    output = `${publicPath}${manifest[`${publicPath}${normalizedPath}`]}`;
  }

  return output;
}