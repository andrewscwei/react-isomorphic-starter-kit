import { type RouteObject } from 'react-router'

import { type ResolveLocaleOptions } from '../../types/ResolveLocaleOptions.js'

/**
 * Returns the provided routes with a locale-prefixed variant generated for each
 * URL locale.
 *
 * Only the `path` locale change strategy produces variants; every other
 * strategy returns the routes unchanged.
 *
 * @param routes The routes to localize.
 * @param options See {@link ResolveLocaleOptions}.
 *
 * @returns The localized routes.
 */
export function localizeReactRouterRoutes(routes: RouteObject[], options: ResolveLocaleOptions): RouteObject[] {
  return routes.flatMap(r => localizeRoute(r, options))
}

function localizeRoute(route: RouteObject, options: ResolveLocaleOptions): RouteObject[] {
  const { defaultLocale, localeChangeStrategy, supportedLocales } = options
  const { children, path } = route

  if (path !== undefined) {
    switch (localeChangeStrategy) {
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
      case 'action':
      case 'query':
      default:
        return [route]
    }
  } else if (children !== undefined) {
    return [{
      ...route,
      children: children.flatMap(v => localizeRoute(v, options)),
    }]
  } else {
    return [route]
  }
}
