/* tslint:disable no-reference */
///<reference path='../../src/custom.d.ts' />
/**
 * @file Utility functions for the build process.
 */

import fs from 'fs';
import path from 'path';
import appConfig from '../app.conf';

/**
 * Returns a list of all supported locales by inferring from the translations
 * directory.
 *
 * @param dir Directory to infer locales from.
 *
 * @return List of all supported locales.
 */
export function getLocalesFromDir(dir: string): ReadonlyArray<string> {
  const defaultLocale = appConfig.locales[0];
  const whitelistedLocales = appConfig.locales;
  const t = fs
    .readdirSync(dir)
    .filter((val: string) => !(/(^|\/)\.[^/.]/g).test(val))
    .map((val: string) => path.basename(val, `.json`))
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
export function getLocaleDataFromDir(dir: string): LocaleDataDict {
  const locales = getLocalesFromDir(dir);

  return locales.reduce((dict: LocaleDataDict, locale: string) => {
    try {
      const data: ReactIntl.LocaleData = require(`react-intl/locale-data/${locale}`);
      dict[locale] = data;
    }
    catch (err) {}
    return dict;
  }, {});
}

/**
 * Returns a dictionary object of all translations.
 *
 * @param dir Directory to infer translations from.
 *
 * @return Dictionary object of all translations.
 */
export function getTranslationDataDictFromDir(dir: string): Readonly<TranslationDataDict> {
  const locales = getLocalesFromDir(dir);

  return locales.reduce((dict: TranslationDataDict, locale: string) => {
    const translations: TranslationData = require(path.resolve(dir, `${locale}.json`));
    dict[locale] = translations;
    return dict;
  }, {});
}
