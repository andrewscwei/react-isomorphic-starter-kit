import { RouteObject, matchRoutes } from 'react-router'
import { I18nConfig, createGetLocalizedString, createResolveLocaleOptions, resolveLocaleFromURL } from '../../i18n'
import { joinURL } from '../../utils'

type Options = {
  baseURL: string
  i18n: I18nConfig
  routes: RouteObject[]
}

export default async function createMetadata(url: string, { baseURL, i18n, routes }: Options) {
  const resolveResult = resolveLocaleFromURL(url, createResolveLocaleOptions(i18n))
  const matchedRouteObject = matchRoutes(routes, url)?.[0]?.route as RouteObject
  const metadata = await matchedRouteObject?.metadata?.(createGetLocalizedString(resolveResult?.locale, i18n))

  return {
    ...metadata ?? {},
    locale: resolveResult?.locale,
    url: joinURL(baseURL, url),
  }
}
