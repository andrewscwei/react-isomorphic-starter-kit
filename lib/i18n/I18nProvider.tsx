import React, { createContext, Dispatch, PropsWithChildren, Reducer, useReducer } from 'react'
import { useDocumentLocale } from '../dom'
import { createGetLocalizedPath, createGetLocalizedString, createResolveLocaleOptions, resolveLocaleFromURL } from './helpers'
import { GetLocalizedPath, GetLocalizedString, I18nConfig, Locale } from './types'

type I18nState = I18nConfig & {
  getLocalizedPath: GetLocalizedPath
  getLocalizedString: GetLocalizedString
  locale: string
}

type I18nContextValue = {
  dispatch: Dispatch<I18nChangeLocaleAction>
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
 * @param props - See {@link I18nProviderProps}.
 *
 * @returns The context provider.
 */
export default function I18nProvider({
  children,
  defaultLocale = 'en',
  localeChangeStrategy = 'path',
  translations = {},
}: I18nProviderProps) {
  const config = { defaultLocale, localeChangeStrategy, translations }

  let locale: Locale = defaultLocale

  if (localeChangeStrategy !== 'action') {
    const { pathname, search, hash } = window.location
    const url = `${pathname}${search}${hash}`
    const res = resolveLocaleFromURL(url, createResolveLocaleOptions(config))
    if (!res) console.warn(`Unable to infer locale from path <${url}>`)

    locale = res?.locale ?? defaultLocale
  }

  const [state, dispatch] = useReducer(reducer, {
    ...config,
    locale,
    getLocalizedPath: createGetLocalizedPath(locale, config),
    getLocalizedString: createGetLocalizedString(locale, config),
  })

  useDocumentLocale(state.locale)

  return (
    <I18nContext.Provider value={{ state, dispatch }}>
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
