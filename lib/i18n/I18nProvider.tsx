import React, { createContext, useMemo, useReducer, type Dispatch, type PropsWithChildren, type Reducer } from 'react'
import { useLocation } from 'react-router'
import { useDocumentLocale } from '../dom'
import { createGetLocalizedPath, createGetLocalizedString, createResolveLocaleOptions, resolveLocaleFromURL } from './helpers'
import { type GetLocalizedPath, type GetLocalizedString, type I18nConfig } from './types'

type I18nState = I18nConfig & {
  getLocalizedPath: GetLocalizedPath
  getLocalizedString: GetLocalizedString
  locale: string
}

type I18nContextValue = {
  dispatch?: Dispatch<I18nChangeLocaleAction>
  state: I18nState
}

type I18nProviderProps = PropsWithChildren<Partial<I18nConfig>>

type I18nChangeLocaleAction = {
  locale: string
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
 * @param props See {@link I18nProviderProps}.
 *
 * @returns The context provider.
 */
export function I18nProvider({
  children,
  defaultLocale = 'en',
  localeChangeStrategy = 'path',
  translations = {},
}: I18nProviderProps) {
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
    localeChangeStrategy,
    defaultLocale,
    locale: defaultLocale,
    translations,
    getLocalizedPath: createGetLocalizedPath(defaultLocale, config),
    getLocalizedString: createGetLocalizedString(defaultLocale, config),
  })

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch])

  useDocumentLocale(state.locale)

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

const I18nPathProvider = ({ children, defaultLocale, localeChangeStrategy, translations }: PropsWithChildren<I18nConfig>) => {
  const config = { defaultLocale, localeChangeStrategy, translations }

  const { pathname, search, hash } = useLocation()
  const url = `${pathname}${search}${hash}`
  const res = resolveLocaleFromURL(url, createResolveLocaleOptions(config))
  if (!res) console.warn(`Unable to infer locale from path <${url}>`)

  const locale = res?.locale ?? defaultLocale

  const state: I18nState = {
    localeChangeStrategy,
    defaultLocale,
    locale,
    translations,
    getLocalizedPath: createGetLocalizedPath(locale, config),
    getLocalizedString: createGetLocalizedString(locale, config),
  }

  const value = useMemo(() => ({ state }), [state])

  useDocumentLocale(state.locale)

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

const reducer: Reducer<I18nState, I18nChangeLocaleAction> = (state, action) => {
  switch (action.type) {
    case '@i18n/CHANGE_LOCALE':
      return {
        ...state,
        locale: action.locale,
        getLocalizedString: createGetLocalizedString(action.locale, state),
      }
    default:
      return state
  }
}

export const I18nContext = createContext<I18nContextValue | undefined>(undefined)

Object.defineProperty(I18nContext, 'displayName', { value: 'I18n' })
