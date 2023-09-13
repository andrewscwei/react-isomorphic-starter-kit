import { type GetLocalizedPath, type I18nConfig, type Locale } from '../types'
import { createResolveLocaleOptions } from './createResolveLocaleOptions'
import { getLocalizedURL } from './getLocalizedURL'

/**
 * Creates a function for getting the localized version of a URL in the target
 * locale.
 *
 * @param locale The target locale.
 * @param config See {@link I18nConfig}.
 *
 * @returns A function for getting the localized URL of any URL in the target
 *          locale.
 */
export function createGetLocalizedPath(locale: Locale, config: I18nConfig): GetLocalizedPath {
  return (path: string) => getLocalizedURL(path, locale, createResolveLocaleOptions(config))
}
