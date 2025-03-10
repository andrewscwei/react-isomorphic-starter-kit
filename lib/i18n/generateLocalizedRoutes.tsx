import { Outlet, type RouteObject } from 'react-router'
import { I18nProvider } from './I18nProvider.js'
import { type I18nConfig } from './types/index.js'
import { createResolveLocaleOptions } from './utils/index.js'

/**
 * Returns an array of {@link RouteObject} containing the localized version of
 * each {@link RouteObject} (specified by the `routes` argument). The locales to
 * generate are specified by `config`.
 *
 * @param routes An array of {@link RouteObject} to localize.
 * @param config See {@link I18nConfig}.
 *
 * @returns The localized array of {@link RouteObject}.
 */
export function generateLocalizedRoutes(routes: RouteObject[], config: I18nConfig): RouteObject[] {
  const Container = () => (
    <I18nProvider {...config}>
      <Outlet/>
    </I18nProvider>
  )

  return [{
    Component: Container,
    children: routes.map(t => localizeRoute(t, config)).flat(),
  }]
}

function localizeRoute(route: RouteObject, config: I18nConfig): RouteObject[] {
  const { defaultLocale, resolveStrategy, supportedLocales } = createResolveLocaleOptions(config)
  const { path, children } = route

  if (path !== undefined) {
    switch (resolveStrategy) {
      case 'path': {
        const localizedRoutes = supportedLocales?.filter(l => l !== defaultLocale).map(l => ({ ...route, path: `/${l}${path.startsWith('/') ? path : `/${path}`}` }))

        return [
          route,
          ...localizedRoutes ?? [],
        ]
      }
      case 'query':
      case 'auto':
      case 'domain':
      case 'custom':
      default:
        return [route]
    }
  }
  else if (children !== undefined) {
    return [{
      ...route,
      children: children.map(t => localizeRoute(t, config)).flat(),
    }]
  }
  else {
    return [route]
  }
}
