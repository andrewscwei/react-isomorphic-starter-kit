import { GetLocalizedPath, I18nOptions, Locale } from '../types'
import createResolveLocaleOptions from './createResolveLocaleOptions'
import getLocalizedURL from './getLocalizedURL'

export default function createGetLocalizedPath(locale: Locale, options: I18nOptions): GetLocalizedPath {
  return (path: string) => getLocalizedURL(path, locale, createResolveLocaleOptions(options))
}
