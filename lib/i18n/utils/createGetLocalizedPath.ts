import { type GetLocalizedPath } from '../types/GetLocalizedPath.js'
import { type I18nConfig } from '../types/I18nConfig.js'
import { type Locale } from '../types/Locale.js'
import { createResolveLocaleOptions } from './createResolveLocaleOptions.js'
import { getLocalizedURL } from './getLocalizedURL.js'

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
