import type { RouteObject } from 'react-router'
import { matchRoutes } from 'react-router'
import type { I18nConfig } from '../../i18n'
import { createGetLocalizedString, createResolveLocaleOptions, resolveLocaleFromURL } from '../../i18n'
import type { Metadata } from '../../templates'
import { joinURL } from '../../utils'

type Options = {
  /**
   * The base URL of the application (i.e. `https://example.com`).
   */
  baseURL: string

  /**
   * Configuration for i18n (see {@link I18nConfig}).
   */
  i18n: I18nConfig

  /**
   * Configuration for routes (see {@link RouteObject}).
   */
  routes: RouteObject[]
}

/**
 * Creates URL specific metadata.
 *
 * @param url The URL.
 * @param options See {@link Options}.
 *
 * @returns The {@link Metadata}.
 */
export async function createMetadata(url: string, { baseURL, i18n, routes }: Options): Promise<Metadata> {
  const resolveResult = resolveLocaleFromURL(url, createResolveLocaleOptions(i18n))
  const matchedRouteObject = matchRoutes(routes, url)?.[0]?.route as RouteObject
  const metadata = await matchedRouteObject?.metadata?.(createGetLocalizedString(resolveResult?.locale, i18n))

  return {
    ...metadata ?? {},
    locale: resolveResult?.locale,
    url: joinURL(baseURL, url),
  }
}
