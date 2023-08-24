import { Request } from 'express'
import { matchRoutes } from 'react-router'
import routes from '../../../src/routes.conf'
import { I18nConfig, createGetLocalizedString, createResolveLocaleOptions, resolveLocaleFromURL } from '../../i18n'
import { joinURL } from '../../utils'

type Options = {
  i18n: I18nConfig
  baseURL: string
}

export default async function createMetadata(req: Request, { baseURL, i18n }: Options) {
  const resolveResult = resolveLocaleFromURL(req.url, createResolveLocaleOptions(i18n))
  const matchedRouteObject = matchRoutes(routes, req.url)?.[0]?.route as RouteObjectWithMetadata
  const metadata = await matchedRouteObject?.metadata?.(createGetLocalizedString(resolveResult?.locale, i18n))

  return {
    ...metadata ?? {},
    locale: resolveResult?.locale,
    url: joinURL(baseURL, req.url),
  }
}
