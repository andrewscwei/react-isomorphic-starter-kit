import { GetLocalizedPath, I18nConfig, Locale } from '../types'
import createResolveLocaleOptions from './createResolveLocaleOptions'
import getLocalizedURL from './getLocalizedURL'

export default function createGetLocalizedPath(locale: Locale, config: I18nConfig): GetLocalizedPath {
  return (path: string) => getLocalizedURL(path, locale, createResolveLocaleOptions(config))
}
