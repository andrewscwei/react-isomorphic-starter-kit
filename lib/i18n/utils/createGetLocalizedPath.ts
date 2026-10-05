import { type GetLocalizedPath } from '../types/GetLocalizedPath.js'
import { type ResolveLocaleOptions } from '../types/ResolveLocaleOptions.js'
import { getLocalizedURL } from './getLocalizedURL.js'

/**
 * Creates a function for getting the localized version of a URL in the target
 * locale.
 *
 * @param locale The target locale.
 * @param options See {@link ResolveLocaleOptions}.
 *
 * @returns A function for getting the localized URL of any URL in the target
 *          locale.
 */
export function createGetLocalizedPath(locale: string, options: ResolveLocaleOptions): GetLocalizedPath {
  return (path: string) => getLocalizedURL(path, locale, options)
}
