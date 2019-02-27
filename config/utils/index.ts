/* tslint:disable no-reference */
///<reference path='../../src/custom.d.ts' />
/**
 * @file Utility functions for the build process.
 */

import fs from 'fs';
import path from 'path';
import requireDir from 'require-dir';
import buildConf from '../build.conf';

const cwd = path.join(__dirname, '../../');

/**
 * Returns a list of all supported locales by inferring from the translations
 * directory.
 *
 * @param dir Directory to infer locales from.
 *
 * @return List of all supported locales.
 */
export function getLocalesFromDir(dir: string): ReadonlyArray<string> {
  const defaultLocale = buildConf.locales[0];
  const whitelistedLocales = buildConf.locales;
  const t = fs
    .readdirSync(dir)
    .filter((val: string) => !(/(^|\/)\.[^/.]/g).test(val))
    .map((val: string) => path.basename(val, '.json'))
    .filter((val: string) => whitelistedLocales ? ~whitelistedLocales.indexOf(val) : true);

  if (defaultLocale && ~t.indexOf(defaultLocale)) {
    t.splice(t.indexOf(defaultLocale), 1);
    t.unshift(defaultLocale);
  }

  return t;
}

/**
 * Returns a dictionary of React Intl locale data used by the app.
 *
 * @param dir Directory to infer locales from.
 *
 * @return Dictionary of all locale data.
 */
export function getLocaleDataFromDir(dir: string, req?: any): LocaleDataDict {
  const dict: LocaleDataDict = {};
  const locales = getLocalesFromDir(dir);
  const t: { [key: string]: any } = requireDir(path.resolve(cwd, 'node_modules', 'react-intl/locale-data'));

  for (const locale in t) {
    if (~locales.indexOf(locale)) {
      dict[locale] = t[locale];
    }
  }

  return dict;
}

/**
 * Returns a dictionary object of all translations.
 *
 * @param dir Directory to infer translations from.
 *
 * @return Dictionary object of all translations.
 */
export function getTranslationDataDictFromDir(dir: string): Readonly<TranslationDataDict> {
  const dict: TranslationDataDict = {};
  const locales = getLocalesFromDir(dir);
  const t: { [key: string]: any } = requireDir(path.resolve(dir));

  for (const locale in t) {
    if (~locales.indexOf(locale)) {
      dict[locale] = t[locale];
    }
  }

  return dict;
}
