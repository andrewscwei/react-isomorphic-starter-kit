import { Outlet, type RouteObject } from 'react-router'
import { defineConfig } from './defineConfig.js'
import { I18nProvider } from './I18nProvider.js'
import { type I18nConfig } from './types/index.js'
import { createResolveLocaleOptions } from './utils/index.js'

/**
 * Returns an array of {@link RouteObject} containing the localized version of
 * each {@link RouteObject} (specified by the `routes` argument). The locales to
 * generate are specified by `config`.
 *
 * @param routes An array of {@link RouteObject} to localize.
 * @param configOrDescriptor {@link I18nConfig} or the descriptor to define it.
 *
 * @returns The localized array of {@link RouteObject}.
 */
export function defineRoutes(routes: RouteObject[], configOrDescriptor: I18nConfig | Parameters<typeof defineConfig>[0]): RouteObject[] {
  const config = !('sources' in configOrDescriptor) ? configOrDescriptor as I18nConfig : defineConfig(configOrDescriptor)

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
