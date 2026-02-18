/* eslint-disable @typescript-eslint/naming-convention */

import { Outlet, type RouteObject } from 'react-router'

import { defineConfig } from './defineConfig.js'
import { I18nProvider } from './I18nProvider.js'
import { type I18nConfig } from './types/I18nConfig.js'
import { createResolveLocaleOptions } from './utils/createResolveLocaleOptions.js'

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
    children: routes.flatMap(v => localizeRoute(v, config)),
    Component: Container,
    HydrateFallback: () => undefined,
  }]
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
          ...localizedRoutes ?? [],
        ]
      }
      case 'auto':
      case 'custom':
      case 'domain':
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
