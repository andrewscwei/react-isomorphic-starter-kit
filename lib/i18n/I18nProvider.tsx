import { createContext, type Dispatch, type PropsWithChildren, type Reducer, useReducer } from 'react'
import { useLocation } from 'react-router'

import { type GetLocalizedPath } from './types/GetLocalizedPath.js'
import { type GetLocalizedString } from './types/GetLocalizedString.js'
import { type I18nConfig } from './types/I18nConfig.js'
import { type Locale } from './types/Locale.js'
import { createGetLocalizedPath } from './utils/createGetLocalizedPath.js'
import { createGetLocalizedString } from './utils/createGetLocalizedString.js'
import { createResolveLocaleOptions } from './utils/createResolveLocaleOptions.js'
import { resolveLocaleFromURL } from './utils/resolveLocaleFromURL.js'

type I18nState = {
  getLocalizedPath: GetLocalizedPath
  getLocalizedString: GetLocalizedString
  locale: Locale
} & I18nConfig

type I18nContextValue = {
  dispatch?: Dispatch<I18nAction>
  state: I18nState
}

type I18nAction = I18nChangeLocaleAction | I18nResetLocaleAction

type I18nResetLocaleAction = {
  type: '@i18n/RESET_LOCALE'
}

type I18nChangeLocaleAction = {
  locale: Locale
  type: '@i18n/CHANGE_LOCALE'
}

/**
 * Context provider whose value consists of the current i18n state. The method
 * of modifying the locale is specified by `localeChangeStrategy`, as follows:
 *   - If set to `action`, the locale can be modified by dispatching an action
 *   - If set to `path`, the locale is inferred from the current path name
 *   - If set to `query`, the locale is inferred from the search parameter
 *     `locale` in the current path
 *
 * @param props See {@link I18nConfig}.
 *
 * @returns The context provider.
 */
export function I18nProvider({
  children,
  defaultLocale = 'en',
  localeChangeStrategy = 'path',
  translations = {},
}: PropsWithChildren<Partial<I18nConfig>>) {
  switch (localeChangeStrategy) {
    case 'action':
      return I18nActionProvider({ children, defaultLocale, localeChangeStrategy, translations })
    case 'path':
    case 'query':
    default:
      return I18nPathProvider({ children, defaultLocale, localeChangeStrategy, translations })
  }
}

const I18nActionProvider = ({ children, defaultLocale, localeChangeStrategy, translations }: PropsWithChildren<I18nConfig>) => {
  const config = { defaultLocale, localeChangeStrategy, translations }

  const [state, dispatch] = useReducer(reducer, {
    defaultLocale,
    getLocalizedPath: createGetLocalizedPath(defaultLocale, config),
    getLocalizedString: createGetLocalizedString(defaultLocale, config),
    locale: defaultLocale,
    localeChangeStrategy,
    translations,
  })

  return (
    <I18nContext.Provider value={{ dispatch, state }}>
      {children}
    </I18nContext.Provider>
  )
}

const I18nPathProvider = ({ children, defaultLocale, localeChangeStrategy, translations }: PropsWithChildren<I18nConfig>) => {
  const config = { defaultLocale, localeChangeStrategy, translations }

  const { hash, pathname, search } = useLocation()
  const url = `${pathname}${search}${hash}`
  const res = resolveLocaleFromURL(url, createResolveLocaleOptions(config))
  if (!res) console.warn(`Unable to infer locale from path <${url}>`)

  const locale = res?.locale ?? defaultLocale

  const state: I18nState = {
    defaultLocale,
    getLocalizedPath: createGetLocalizedPath(locale, config),
    getLocalizedString: createGetLocalizedString(locale, config),
    locale,
    localeChangeStrategy,
    translations,
  }

  return (
    <I18nContext.Provider value={{ state }}>
      {children}
    </I18nContext.Provider>
  )
}

const reducer: Reducer<I18nState, I18nAction> = (state, action) => {
  switch (action.type) {
    case '@i18n/CHANGE_LOCALE':
      return {
        ...state,
        getLocalizedString: createGetLocalizedString(action.locale, state),
        locale: action.locale,
      }
    case '@i18n/RESET_LOCALE':
      return {
        ...state,
        getLocalizedString: createGetLocalizedString(state.defaultLocale, state),
        locale: state.defaultLocale,
      }
    default:
      return state
  }
}

export const I18nContext = createContext<I18nContextValue | undefined>(undefined)

if (process.env.NODE_ENV === 'development') {
  I18nContext.displayName = 'I18nContext'
}
