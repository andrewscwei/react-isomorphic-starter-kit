/**
 * @file Resolves fingerprinted asset paths using the generated asset manifest
 *       file.
 */

import appConfig from '@/../config/app.conf';
import path from 'path';

const publicPath = process.env.NODE_ENV === `production` ? appConfig.build.publicPath : `/`;
const manifest = process.env.ASSET_MANIFEST;



/**
 * Fetches the fingerprinted path of an asset using the provided manifest
 * object. If no manifest object is provided, the path is simply normalized and
 * returned.
 *
 * @param pathToResolve The asset path to resolve.
 *
 * @return The resolved path.
 */
export default function resolveAssetPath(pathToResolve: string): string {
  const normalizedPath = path.join.apply(null, pathToResolve.split(`/`));

  let output = normalizedPath;

  if (manifest && manifest.hasOwnProperty(normalizedPath)) {
    output = manifest[normalizedPath];
  }
  else if (manifest && manifest.hasOwnProperty(`${publicPath}${normalizedPath}`)) {
    output = manifest[`${publicPath}${normalizedPath}`];
  }

  if (!output.startsWith(publicPath)) output = `${publicPath}${output}`;

  return output;
}
