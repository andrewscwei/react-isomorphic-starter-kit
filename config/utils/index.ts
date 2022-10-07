/// <reference path='../../src/typings.d.ts' />
/**
 * @file Utility functions for the build process.
 */

import fs from 'fs'
import path from 'path'

/**
 * Scans a directory and returns an array of file paths (extensions included) relative to that
 * directory, with each path supposedly corresponding to a bundle entry file.
 *
 * @param dir - The directory to scan.
 * @param baseDir - The directory to resolve relative paths against.
 *
 * @returns An array of file paths.
 */
export function getBundlesFromDir(dir: string, baseDir: string = dir): readonly string[] {
  const files = fs.readdirSync(dir)
  const bundles = []

  for (const fileName of files) {
    const filePath = path.join(dir, fileName)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      bundles.push(...getBundlesFromDir(filePath, dir))
    }
    else if (!(/(^|\/)\.[^/.]/g).test(fileName)) {
      bundles.push(path.relative(baseDir, filePath))
    }
  }

  return bundles
}
