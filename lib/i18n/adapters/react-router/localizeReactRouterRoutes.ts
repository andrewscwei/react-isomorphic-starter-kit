import { type RouteObject } from 'react-router'

import { type I18nConfig } from '../../types/I18nConfig.js'
import { createResolveLocaleOptions } from '../../utils/createResolveLocaleOptions.js'

/**
 * Returns the provided routes with a locale-prefixed variant generated for each
 * supported locale. Only the `path` resolve strategy produces variants; every
 * other strategy returns the routes unchanged.
 *
 * @param routes The routes to localize.
 * @param config See {@link I18nConfig}.
 *
 * @returns The localized routes.
 */
export function localizeReactRouterRoutes(routes: RouteObject[], config: I18nConfig): RouteObject[] {
  return routes.flatMap(r => localizeRoute(r, config))
}

function localizeRoute(route: RouteObject, config: I18nConfig): RouteObject[] {
  const { defaultLocale, resolveStrategy, supportedLocales } = createResolveLocaleOptions(config)
  const { children, path } = route

  if (path !== undefined) {
    switch (resolveStrategy) {
      case 'path': {
        const localizedRoutes = supportedLocales
          .filter(l => l !== defaultLocale)
          .map(l => ({
            ...route,
            path: `/${l}/${path.replace(/^\/+/, '')}`.replace(/\/+$/, ''),
          }))

        return [
          route,
          ...localizedRoutes,
        ]
      }
      case 'auto':
      case 'custom':
      case 'domain':
      case 'none':
      case 'query':
      default:
        return [route]
    }
  } else if (children !== undefined) {
    return [{
      ...route,
      children: children.flatMap(v => localizeRoute(v, config)),
    }]
  } else {
    return [route]
  }
}
