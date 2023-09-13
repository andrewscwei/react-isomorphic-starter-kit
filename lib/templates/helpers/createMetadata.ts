import { matchRoutes, type RouteObject } from 'react-router'
import { type StaticHandlerContext } from 'react-router-dom/server'
import { createGetLocalizedString, createResolveLocaleOptions, resolveLocaleFromURL, type I18nConfig } from '../../i18n'
import { type Metadata } from '../../templates'
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
 * Creates route specific metadata.
 *
 * @param context The {@link StaticHandlerContext}.
 * @param options See {@link Options}.
 *
 * @returns The {@link Metadata}.
 */
export async function createMetadata(context: StaticHandlerContext, { baseURL, i18n, routes }: Options): Promise<Metadata> {
  const url = context.location.pathname
  const resolveResult = resolveLocaleFromURL(url, createResolveLocaleOptions(i18n))
  const matchedRoutes = (matchRoutes(routes, url) ?? []).reverse()
  const metadataPromise = matchedRoutes.find(t => t.route.metadata !== undefined)?.route.metadata
  const metadata = await metadataPromise?.(context, { ltxt: createGetLocalizedString(resolveResult?.locale, i18n) })

  return {
    ...metadata ?? {},
    locale: resolveResult?.locale,
    url: joinURL(baseURL, url),
  }
}
