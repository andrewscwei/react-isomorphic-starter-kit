import Polyglot from 'node-polyglot'
import React, { ComponentType, createContext, Dispatch, Fragment, FunctionComponent, PropsWithChildren, useReducer } from 'react'
import { RouteComponentProps } from 'react-router'
import debug from './debug'

export type I18nState = {
  locale: string
  ltxt: typeof Polyglot.prototype.t
}

export enum I18nActionType {
  CHANGE_LOCALE = 'i18n/CHANGE_LOCALE'
}

export type I18nAction = {
  type: I18nActionType
  locale: I18nState['locale']
}

export type I18nContextProps = {
  state: I18nState
  dispatch: Dispatch<I18nAction>
}

export type I18nComponentProps = I18nState

export type I18nProviderProps<P = Record<string, never>> = PropsWithChildren<P>

export type I18nRouterProviderProps = I18nProviderProps<{ route: RouteComponentProps }>

export const I18nContext = createContext({} as I18nContextProps)

const defaultLocale = __I18N_CONFIG__.defaultLocale
const locales = __I18N_CONFIG__.locales
const dict = __I18N_CONFIG__.dict
const polyglots: { [locale: string]: Polyglot } = {}

const initialState: I18nState = {
  locale: defaultLocale,
  ltxt: (...args) => getPolyglotByLocale(defaultLocale).t(...args),
}

const reducer = (state: I18nState = initialState, action: I18nAction): I18nState => {
  switch (action.type) {
  case I18nActionType.CHANGE_LOCALE:
    return {
      ...state,
      locale: action.locale,
      ltxt: (...args) => getPolyglotByLocale(action.locale).t(...args),
    }
  }
}

// In development, require context for all locale translation files and add them
// to Polyglot so that they can be watched by Webpack.
if (process.env.APP_ENV === 'client' && process.env.NODE_ENV === 'development') {
  const localeReq = require.context('../../config/locales', true, /^.*\.json$/)
  localeReq.keys().forEach(path => {
    const locale = path.replace('./', '').replace('.json', '')
    if (!~locales.indexOf(locale)) { return }
    dict[locale] = localeReq(path) as TranslationData
  })
}

// Instantiate one polyglot instance per locale.
for (const locale in dict) {
  if (!dict.hasOwnProperty(locale)) continue

  polyglots[locale] = new Polyglot({
    locale,
    phrases: dict[locale],
  })
}

debug('Initializing locale translations...', 'OK', locales)

/**
 * Infers the current locale from a URL.
 *
 * @param path - The URL path.
 *
 * @returns The inferred locale or the default locale if inferrence is not possible.
 */
export function getLocaleFromPath(path: string): string {
  const locales = __I18N_CONFIG__.locales
  const possibleLocale = path.split('/')[1]

  if (~locales.indexOf(possibleLocale)) {
    return possibleLocale
  }
  else {
    return locales[0]
  }
}

/**
 * Returns the localized version of a URL.
 *
 * @param path - The URL path.
 * @param locale - The locale to use for the conversion.
 *
 * @returns The localized URL.
 */
export function getLocalizedPath(path: string, locale: string = __I18N_CONFIG__.defaultLocale): string {
  const t = path.split('/').filter(v => v)

  if (t.length > 0 && __I18N_CONFIG__.locales.indexOf(t[0]) >= 0) {
    t.shift()
  }

  switch (locale) {
  case __I18N_CONFIG__.defaultLocale:
    return `/${t.join('/')}`
  default:
    return `/${locale}/${t.join('/')}`
  }
}

/**
 * Returns the Polyglot instance associated to a locale.
 *
 * @param locale - The locale.
 *
 * @returns The Polyglot instance.
 */
export function getPolyglotByLocale(locale: string): Polyglot {
  const polyglot = polyglots[locale]

  if (!polyglot) throw new Error(`No Polyglot found for locale "${locale}"`)

  return polyglot
}

/**
 * Provider of localization features.
 *
 * @param props - @see I18nProviderProps
 *
 * @returns The provider.
 */
export const I18nProvider: FunctionComponent<I18nProviderProps> = props => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <I18nContext.Provider value={{ state, dispatch }}>
      {props.children}
    </I18nContext.Provider>
  )
}

/**
 * Provider of localization features that automatically infers the current locale from the router
 * route.
 *
 * @param props - @see I18nRouterProviderProps
 *
 * @returns The provider.
 */
export const I18nRouterProvider: FunctionComponent<I18nRouterProviderProps> = ({ route, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const locale = getLocaleFromPath(route.location.pathname)

  return (
    <I18nContext.Provider value={{
      state: {
        ...state,
        locale: locale,
        ltxt: (...args) => getPolyglotByLocale(locale).t(...args),
      },
      dispatch,
    }}>
      {children}
    </I18nContext.Provider>
  )
}

/**
 * HOC for injecting localization properties into a component.
 *
 * @param Component - The component to inject localization properties into.
 *
 * @returns The wrapper component.
 */
export function withI18n<P>(Component: ComponentType<P & I18nComponentProps>): FunctionComponent<P> {
  const WithI18n: FunctionComponent<P> = props => (
    <I18nContext.Consumer>
      {({ state, dispatch }) => (
        <Component locale={state.locale} ltxt={state.ltxt} {...props}/>
      )}
    </I18nContext.Consumer>
  )

  return WithI18n
}

/**
 * Renders a localized string in place.
 *
 * @param args @see Polyglot.prototype.t
 *
 * @returns The rendered element.
 */
export function ltxt(...args: Parameters<typeof Polyglot.prototype.t>): JSX.Element {
  return (
    <I18nContext.Consumer>
      {({ state }) => (
        <Fragment>{state.ltxt(...args)}</Fragment>
      )}
    </I18nContext.Consumer>
  )
}
