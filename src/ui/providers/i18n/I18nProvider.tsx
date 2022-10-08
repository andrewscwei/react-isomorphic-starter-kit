import Polyglot from 'node-polyglot'
import React, { createContext, Dispatch, PropsWithChildren, useMemo, useReducer } from 'react'

interface Translation { [key: string]: Translation | string }

type I18nChangeLocaleAction = {
  type: '@i18n/CHANGE_LOCALE'
  locale: string
}

type I18nContextValue = {
  state: {
    defaultLocale: string
    locale: string
    polyglots: Record<string, Polyglot>
    supportedLocales: string[]
    getLocalizedString: typeof Polyglot.prototype.t
  }
  dispatch: Dispatch<I18nChangeLocaleAction>
}

type I18nProviderProps = PropsWithChildren<{
  defaultLocale: string
  translations: Record<string, Translation>
}>

export const I18nContext = createContext<I18nContextValue | undefined>(undefined)

const reducer = (state: I18nContextValue['state'], action: I18nChangeLocaleAction): I18nContextValue['state'] => {
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

/**
 * Context provider whose value is the current i18n state and the dispatch function for modifying
 * the i18n state.
 *
 * @param props - See {@link I18nProviderProps}.
 *
 * @returns The context provider.
 */
export default function I18nProvider({
  children,
  defaultLocale,
  translations,
}: I18nProviderProps) {
  const supportedLocales = Object.keys(translations)

  if (supportedLocales.indexOf(defaultLocale) < 0) {
    console.warn(`Provided supported locales do not contain the default locale <${defaultLocale}>`)
    supportedLocales.push(defaultLocale)
  }

  const polyglots = useMemo<Record<string, Polyglot>>(() => supportedLocales.reduce((out, locale) => ({
    ...out,
    [locale]: new Polyglot({ locale, phrases: translations[locale] }),
  }), {}), [translations])

  const [state, dispatch] = useReducer(reducer, {
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
