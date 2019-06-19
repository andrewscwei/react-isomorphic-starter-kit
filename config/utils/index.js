/**
 * @file Utility functions for the build process.
 */

import fs from 'fs';
import path from 'path';
import requireDir from 'require-dir';
import buildConf from '../build.conf';

/**
 * Returns a list of all supported locales by inferring from the translations
 * directory.
 *
 * @param dir Directory to infer locales from.
 *
 * @return List of all supported locales.
 */
export function getLocalesFromDir(dir) {
  const defaultLocale = buildConf.locales[0];
  const whitelistedLocales = buildConf.locales;
  const t = fs
    .readdirSync(dir)
    .filter((val) => !(/(^|\/)\.[^/.]/g).test(val))
    .map((val) => path.basename(val, '.json'))
    .filter((val) => whitelistedLocales ? ~whitelistedLocales.indexOf(val) : true);

  if (defaultLocale && ~t.indexOf(defaultLocale)) {
    t.splice(t.indexOf(defaultLocale), 1);
    t.unshift(defaultLocale);
  }

  return t;
}

/**
 * Returns a dictionary object of all translations.
 *
 * @param dir Directory to infer translations from.
 *
 * @return Dictionary object of all translations.
 */
export function getTranslationDataDictFromDir(dir) {
  const dict = {};
  const locales = getLocalesFromDir(dir);
  const t = requireDir(path.resolve(dir));

  for (const locale in t) {
    if (~locales.indexOf(locale)) {
      dict[locale] = t[locale];
    }
  }

  return dict;
}
