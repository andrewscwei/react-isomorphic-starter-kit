import Polyglot from 'node-polyglot'
import React, { createContext, Dispatch, PropsWithChildren, useContext, useMemo, useReducer } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router'

interface Translation { [key: string]: Translation | string }

type I18nState = {
  changeLocaleStrategy: 'action' | 'path' | 'query'
  defaultLocale: string
  locale: string
  polyglots: Record<string, Polyglot>
  supportedLocales: string[]
  getLocalizedPath?: (path: string) => string
  getLocalizedString: typeof Polyglot.prototype.t
}

type I18nContextValue = {
  state: I18nState
  dispatch?: Dispatch<I18nChangeLocaleAction>
}

type I18nProviderProps = PropsWithChildren<{
  changeLocaleStrategy?: I18nState['changeLocaleStrategy']
  defaultLocale?: I18nState['defaultLocale']
  translations: Record<string, Translation>
}>

type I18nChangeLocaleAction = {
  type: '@i18n/CHANGE_LOCALE'
  locale: string
}

const reducer = (state: I18nState, action: I18nChangeLocaleAction): I18nState => {
  switch (action.type) {
    case '@i18n/CHANGE_LOCALE':
      return {
        ...state,
        locale: action.locale,
        getLocalizedString: (...args) => state.polyglots[action.locale]?.t(...args) ?? args[0],
      }
    default:
      return state
  }
}

export const I18nContext = createContext<I18nContextValue | undefined>(undefined)

/**
 * Context provider whose value consists of the current i18n state. The method of modifying the
 * locale is specified by `changeLocaleStrategy`, as follows:
 *   - If set to `action`, the locale can be modified by dispatching an action
 *   - If set to `path`, the locale is inferred from the current path name
 *   - If set to `query`, the locale is inferred from the search parameter `locale` in the current
 *     path
 *
 * @param props - See {@link I18nProviderProps}.
 *
 * @returns The context provider.
 */
export default function I18nProvider({
  children,
  defaultLocale = 'en',
  translations,
  changeLocaleStrategy = 'path',
}: I18nProviderProps) {
  const { pathname, search, hash } = useLocation()
  const url = `${pathname}${search}${hash}`
  const supportedLocales = Object.keys(translations)

  if (supportedLocales.indexOf(defaultLocale) < 0) {
    console.warn(`Provided supported locales do not contain the default locale <${defaultLocale}>`)
    supportedLocales.push(defaultLocale)
  }

  const polyglots = useMemo<Record<string, Polyglot>>(() => supportedLocales.reduce((out, locale) => ({
    ...out,
    [locale]: new Polyglot({ locale, phrases: translations[locale] }),
  }), {}), [translations])

  switch (changeLocaleStrategy) {
    case 'action': {
      const [state, dispatch] = useReducer(reducer, {
        changeLocaleStrategy,
        defaultLocale,
        locale: defaultLocale,
        polyglots,
        supportedLocales,
        getLocalizedString: (...args) => polyglots[defaultLocale]?.t(...args) ?? args[0],
      })

      return (
        <I18nContext.Provider value={{ state, dispatch }}>
          {children}
        </I18nContext.Provider>
      )
    }
    default: {
      const resolveStrategy = changeLocaleStrategy === 'path' ? 'path' : 'query'
      const localeInfo = getLocaleFromURL(url, { defaultLocale, resolveStrategy, supportedLocales })
      if (!localeInfo) console.warn(`Unable to infer locale from path <${url}>`)

      const locale = localeInfo?.locale ?? defaultLocale

      const polyglot = polyglots[locale]
      if (!polyglot) console.warn(`Missing transtions for locale <${locale}>`)

      const state: I18nState = {
        changeLocaleStrategy,
        defaultLocale,
        locale,
        polyglots,
        supportedLocales,
        getLocalizedPath: path => locale === defaultLocale ? getUnlocalizedURL(path, { resolveStrategy, supportedLocales }) : getLocalizedURL(path, locale, { defaultLocale, resolveStrategy: changeLocaleStrategy, supportedLocales }),
        getLocalizedString: (...args) => polyglot?.t(...args) ?? args[0],
      }

      return (
        <I18nContext.Provider value={{ state }}>
          {children}
        </I18nContext.Provider>
      )
    }
  }
}

/** @namespace Components */

/**
 * Custom {@link Routes} container that generates child {@link Route} components for all locales
 * supported by {@link I18nProvider}.
 */
export function I18nRoutes({ children }: PropsWithChildren) {
  const context = useContext(I18nContext)
  if (!context) throw Error('Cannot fetch the value of I18nContext, is the corresponding provider instated?')

  const { defaultLocale, supportedLocales, changeLocaleStrategy } = context.state

  switch (changeLocaleStrategy) {
    case 'path':
      return (
        <Routes>
          {supportedLocales.map(locale => (
            <Route key={locale} path={locale === defaultLocale ? '/' : locale}>
              {children}
            </Route>
          ))}
        </Routes>
      )
    default:
      return (
        <Routes>
          <Route path={'/'}>
            {children}
          </Route>
        </Routes>
      )
  }
}

/** @namespace Hooks */

/**
 * Hook for retrieving the change locale function.
 *
 * @returns The change locale function.
 */
export function useChangeLocale() {
  const context = useContext(I18nContext)
  if (!context) throw Error('Cannot fetch the current i18n context, is the corresponding provider instated?')

  if (context.state.changeLocaleStrategy === 'action') {
    return (locale: string) => context.dispatch?.({
      locale,
      type: '@i18n/CHANGE_LOCALE',
    })
  }
  else {
    const { defaultLocale, changeLocaleStrategy, supportedLocales } = context.state
    const { pathname, search, hash } = useLocation()
    const path = `${pathname}${search}${hash}`
    const navigate = useNavigate()
    const resolveStrategy = changeLocaleStrategy === 'path' ? 'path' : 'query'

    return (locale: string) => {
      const newPath = locale === defaultLocale
        ? getUnlocalizedURL(path, { resolveStrategy, supportedLocales })
        : getLocalizedURL(path, locale, { defaultLocale, resolveStrategy, supportedLocales })

      navigate(newPath)
    }
  }
}

/**
 * Hook for retrieving the current locale.
 *
 * @returns The current locale.
 */
export function useLocale() {
  const context = useContext(I18nContext)
  if (!context) throw Error('Cannot fetch the current i18n context, is the corresponding provider instated?')

  return context.state.locale
}

/**
 * Hook for retrieving the path localizing function for the current locale.
 *
 * @returns The path localizing function.
 */
export function useLocalizedPath() {
  const context = useContext(I18nContext)
  if (!context) throw Error('Cannot fetch the current i18n context, is the corresponding provider instated?')

  return context.state.getLocalizedPath ?? ((path: string) => path)
}

/**
 * Hook for retrieving the string localizing function for the current locale.
 *
 * @returns The string localizing function.
 */
export function useLocalizedString() {
  const context = useContext(I18nContext)
  if (!context) throw Error('Cannot fetch the current i18n context, is the corresponding provider instated?')

  return context.state.getLocalizedString
}

/**
 * Hook for retrieving all supported locales.
 *
 * @returns All supported locales.
 */
export function useSupportedLocales() {
  const context = useContext(I18nContext)
  if (!context) throw Error('Cannot fetch the current i18n context, is the corresponding provider instated?')

  return context.state.supportedLocales
}

/** @namespace Utilities */

type URLParts = {
  base?: string
  hash?: string
  host?: string
  path?: string
  port?: string
  protocol?: string
  query?: string
}

type ResolveLocaleOptions = {
  /**
   * The locale to fallback to if one cannot be inferred from the provided URL.
   */
  defaultLocale?: string

  /**
   * An array of supported locales to validate the inferred locale against. If it doesn't exist in
   * the list of supported locales, the default locale (if specified) or `undefined` will be
   * returned.
   */
  supportedLocales?: string[]
}

type ResolveLocalizedURLOptions = ResolveLocaleOptions & {
  /**
   * Specifies where in the URL the locale should be matched. If `resolver` is provided, this option
   * is ignored.
   */
  resolveStrategy?: 'auto' | 'domain' | 'path' | 'query'

  /**
   * Custom resolver function.
   *
   * @param protocol - The matched protocol of the provided url, if available.
   * @param host - The matched host of the provided url, if available.
   * @param port - The matched port of the provided url, if available.
   * @param path - The matched path of the provided url, if available.
   *
   * @returns The resolved locale.
   */
  resolver?: (urlParts: URLParts) => string | undefined
}

type LocalizedURLInfo = {
  /**
   * The matched locale.
   */
  locale: string

  /**
   * Specifies where in the URL the locale was matched.
   */
  resolveStrategy: ResolveLocalizedURLOptions['resolveStrategy'] | 'custom'
}

/**
 * Parses a URL into parts.
 *
 * @param url - The URL to parse.
 *
 * @returns The parsed result.
 */
function parseURL(url: string): URLParts {
  const regex = /((?:(.*):\/\/)?((?:[A-Za-z0-9-]+\.?)+)?(?::([0-9]+))?)([^?#]*)(?:\?([^#]*))?(?:#(.*))?/
  const parts = url.match(regex)

  if (!parts) return {}

  return {
    base: parts[1],
    hash: parts[7],
    host: parts[3],
    path: parts[5],
    port: parts[4],
    protocol: parts[2],
    query: parts[6],
  }
}

/**
 * Constructs a URL from {@link URLParts}.
 *
 * @param parts - See {@link URLParts}.
 *
 * @returns The constructed URL.
 */
function constructURL(parts: URLParts): string {
  const protocol = parts.protocol?.concat('://') ?? ''
  const host = parts.host?.concat('/') ?? ''
  const port = parts.port ? `:${parts.port}` : ''
  const path = parts.path ? `/${parts.path.split('/').filter(t => t).join('/')}` : ''
  const query = parts.query ? `?${parts.query}` : ''
  const hash = parts.hash ? `#${parts.hash}` : ''

  return `${protocol}${host}${port}${path}${query}${hash}`
}

/**
 * Resolves the specified locale with the provided options. All parameters are optional.
 *
 * @param locale - The locale to resolve.
 * @param options - See {@link ResolveLocaleOptions}.
 *
 * @returns - The resolved locale.
 */
export function resolveLocale(locale?: string, { defaultLocale, supportedLocales }: ResolveLocaleOptions = {}): string | undefined {
  if (supportedLocales) {
    if (locale && supportedLocales.indexOf(locale) >= 0) return locale
    if (defaultLocale && supportedLocales.indexOf(defaultLocale) >= 0) return defaultLocale

    return undefined
  }

  return locale ?? defaultLocale
}

/**
 * Retrieves the locale identifier from a URL. The default behavior of this function to look for the
 * locale identifier in the domain first followed by the first directory of the path. You can
 * provide a custom resolver.
 *
 * @param url - The URL, can be a full URL or a valid path.
 * @param options - See {@link ResolveLocalizedURLOptions}.
 *
 * @returns The inferred locale if it exists.
 */
export function getLocaleFromURL(url: string, { defaultLocale, resolveStrategy = 'auto', resolver, supportedLocales }: ResolveLocalizedURLOptions = {}): LocalizedURLInfo | undefined {
  const parts = parseURL(url)

  if (resolver) {
    const matchedLocale = resolver(parts)

    if (matchedLocale && (!supportedLocales || supportedLocales.indexOf(matchedLocale) >= 0)) return { locale: matchedLocale, resolveStrategy: 'custom' }
    if (defaultLocale && (!supportedLocales || supportedLocales.indexOf(defaultLocale) >= 0)) return { locale: defaultLocale, resolveStrategy: 'auto' }

    return undefined
  }
  else {
    const matchedLocaleFromHost = parts.host?.split('.').filter(t => t)[0]
    const matchedLocaleFromPath = parts.path?.split('/').filter(t => t)[0]
    const matchedLocaleFromQuery = new URLSearchParams(parts.query).get('locale')

    if (matchedLocaleFromHost && (resolveStrategy === 'auto' || resolveStrategy === 'domain') && (!supportedLocales || supportedLocales.indexOf(matchedLocaleFromHost) >= 0)) return { locale: matchedLocaleFromHost, resolveStrategy: 'domain' }
    if (matchedLocaleFromPath && (resolveStrategy === 'auto' || resolveStrategy === 'path') && (!supportedLocales || supportedLocales.indexOf(matchedLocaleFromPath) >= 0)) return { locale: matchedLocaleFromPath, resolveStrategy: 'path' }
    if (matchedLocaleFromQuery && (resolveStrategy === 'auto' || resolveStrategy === 'query') && (!supportedLocales || supportedLocales.indexOf(matchedLocaleFromQuery) >= 0)) return { locale: matchedLocaleFromQuery, resolveStrategy: 'query' }
    if (defaultLocale && (!supportedLocales || supportedLocales.indexOf(defaultLocale) >= 0)) return { locale: defaultLocale, resolveStrategy: 'auto' }

    return undefined
  }
}

/**
 * Returns the unlocalized version of a URL.
 *
 * @param url - The URL.
 * @param options - See {@link ResolveLocalizedURLOptions}.
 *
 * @returns The unlocalized URL.
 */
export function getUnlocalizedURL(url: string, { resolveStrategy = 'auto', resolver, supportedLocales }: ResolveLocalizedURLOptions = {}): string {
  const currLocaleInfo = getLocaleFromURL(url, { resolveStrategy, resolver, supportedLocales })
  const parts = parseURL(url)

  if (!currLocaleInfo) return url

  switch (currLocaleInfo.resolveStrategy) {
    case 'domain':
      return constructURL({ ...parts, host: parts.host ? parts.host.split('.').filter(t => t).slice(1).join('.') : undefined })
    case 'query': {
      if (!parts.query) return url

      const searchParams = new URLSearchParams(parts.query)
      searchParams.delete('locale')

      return constructURL({ ...parts, query: searchParams.toString() })
    }
    case 'path':
    case 'auto':
    default:
      return constructURL({ ...parts, path: parts.path ? [...parts.path.split('/').filter(t => t).slice(1)].join('/') : undefined })
  }
}

/**
 * Returns the localized version of a URL.
 *
 * @param url - The URL.
 * @param locale - The target locale.
 * @param options - See {@link ResolveLocalizedURLOptions}.
 *
 * @returns The localized URL.
 */
export function getLocalizedURL(url: string, locale: string, { defaultLocale, resolveStrategy = 'auto', resolver, supportedLocales }: ResolveLocalizedURLOptions = {}): string {
  const currLocaleInfo = getLocaleFromURL(url, { resolveStrategy, resolver, supportedLocales })
  const parts = parseURL(url)
  const targetLocale = resolveLocale(locale, { defaultLocale, supportedLocales })

  if (!targetLocale) return url

  if (targetLocale === defaultLocale) return getUnlocalizedURL(url, { resolveStrategy, resolver, supportedLocales })

  if (currLocaleInfo) {
    switch (currLocaleInfo.resolveStrategy) {
      case 'domain':
        return constructURL({ ...parts, host: parts.host ? `${targetLocale}.${parts.host.split('.').filter(t => t).slice(1).join('.')}` : undefined })
      case 'query': {
        if (!parts.query) return url

        const searchParams = new URLSearchParams(parts.query)
        if (searchParams.get('locale')) {
          searchParams.set('locale', targetLocale)
        }
        else {
          searchParams.set('locale', targetLocale)
        }

        return constructURL({ ...parts, query: searchParams.toString() })
      }
      case 'path':
      case 'auto':
      default:
        return constructURL({ ...parts, path: parts.path ? [targetLocale, ...parts.path.split('/').filter(t => t).slice(1)].join('/') : undefined })
    }
  }
  else {
    switch (resolveStrategy) {
      case 'domain':
        return constructURL({ ...parts, host: parts.host ? `${targetLocale}.${parts.host}` : undefined })
      case 'query': {
        const searchParams = new URLSearchParams(parts.query)

        if (targetLocale === defaultLocale) {
          searchParams.delete('locale')
        }
        else {
          searchParams.set('locale', targetLocale)
        }

        return constructURL({ ...parts, query: searchParams.toString() })
      }
      case 'path':
      case 'auto':
      default:
        return constructURL({ ...parts, path: parts.path ? [targetLocale, ...parts.path.split('/').filter(t => t)].join('/') : undefined })
    }
  }
}

/**
 * Returns all localized versions of a URL based on the specified `supportedLocales`.
 *
 * @param url - The URL.
 * @param options - See {@link ResolveLocalizedURLOptions}.
 *
 * @returns The localized URLs.
 */
export function getLocalizedURLs(url: string, { defaultLocale, resolveStrategy = 'auto', resolver, supportedLocales }: ResolveLocalizedURLOptions = {}): string[] {
  if (!supportedLocales) return []

  return supportedLocales.map(locale => getLocalizedURL(url, locale, { defaultLocale, resolveStrategy, resolver, supportedLocales }))
}
