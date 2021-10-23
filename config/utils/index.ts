/// <reference path='../../src/typings/custom.d.ts' />
/**
 * @file Utility functions for the build process.
 */

import fs from 'fs'
import path from 'path'
import requireDir from 'require-dir'
import buildConf from '../build.conf'

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

/**
 * Returns a list of all supported locales by inferring from the translations directory.
 *
 * @param dir Directory to infer locales from.
 *
 * @return List of all supported locales.
 */
export function getLocalesFromDir(dir: string): readonly string[] {
  const defaultLocale = buildConf.locales[0]
  const whitelistedLocales = buildConf.locales
  const t = fs
    .readdirSync(dir)
    .filter((val: string) => !(/(^|\/)\.[^/.]/g).test(val))
    .map((val: string) => path.basename(val, '.json'))
    .filter((val: string) => whitelistedLocales ? ~whitelistedLocales.indexOf(val) : true)

  if (defaultLocale && ~t.indexOf(defaultLocale)) {
    t.splice(t.indexOf(defaultLocale), 1)
    t.unshift(defaultLocale)
  }

  return t
}

/**
 * Returns a dictionary object of all translations.
 *
 * @param dir Directory to infer translations from.
 *
 * @return Dictionary object of all translations.
 */
export function getTranslationDataDictFromDir(dir: string): Readonly<TranslationDataDict> {
  const dict: TranslationDataDict = {}
  const locales = getLocalesFromDir(dir)
  const t: { [key: string]: any } = requireDir(path.resolve(dir))

  for (const locale in t) {
    if (~locales.indexOf(locale)) {
      dict[locale] = t[locale]
    }
  }

  return dict
}
