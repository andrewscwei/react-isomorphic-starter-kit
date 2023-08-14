import React, { createContext, Dispatch, PropsWithChildren, useEffect, useReducer } from 'react'
import { useLocation } from 'react-router'
import { updateElementAttributes } from '../dom'
import createLocalizedPathResolver from './createLocalizePathFunction'
import createTranslationResolver from './createTranslateFunction'
import getLocaleInfoFromURL from './getLocaleInfoFromURL'

type I18nState = {
  defaultLocale: string
  locale: string
  localeChangeStrategy: 'action' | 'path' | 'query'
  supportedLocales: string[]
  translations: Record<string, any>
  getLocalizedPath: ReturnType<typeof createLocalizedPathResolver>
  getLocalizedString: ReturnType<typeof createTranslationResolver>
}

type I18nContextValue = {
  dispatch?: Dispatch<I18nChangeLocaleAction>
  state: I18nState
}

type I18nProviderProps = PropsWithChildren<{
  defaultLocale?: I18nState['defaultLocale']
  localeChangeStrategy?: I18nState['localeChangeStrategy']
  translations: Record<string, any>
}>

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
  translations,
}: I18nProviderProps) {
  const { pathname, search, hash } = useLocation()
  const url = `${pathname}${search}${hash}`
  const supportedLocales = Object.keys(translations)

  if (supportedLocales.indexOf(defaultLocale) < 0) {
    console.warn(`Provided supported locales do not contain the default locale <${defaultLocale}>`)
    supportedLocales.push(defaultLocale)
  }

  switch (localeChangeStrategy) {
    case 'action': {
      const [state, dispatch] = useReducer(reducer, {
        localeChangeStrategy,
        defaultLocale,
        locale: defaultLocale,
        supportedLocales,
        translations,
        getLocalizedPath: path => path,
        getLocalizedString: createTranslationResolver(defaultLocale, { translations }),
      })

      if (typeof document !== 'undefined') {
        useEffect(() => updateElementAttributes('meta', [{
          name: 'property',
          value: 'og:locale',
          key: true,
        }, {
          name: 'content',
          value: state.locale,
        }], {
          parent: document.head,
          autoCreate: false,
        }))

        useEffect(() => {
          const prevVal = document.documentElement.getAttribute('lang')
          const newVal = state.locale

          document.documentElement.setAttribute('lang', newVal)

          return () => {
            if (prevVal) {
              document.documentElement.setAttribute('lang', prevVal)
            }
            else {
              document.documentElement.removeAttribute('lang')
            }
          }
        }, [state.locale])
      }

      return (
        <I18nContext.Provider value={{ state, dispatch }}>
          {children}
        </I18nContext.Provider>
      )
    }
    default: {
      const resolveStrategy = localeChangeStrategy === 'path' ? 'path' : 'query'
      const localeInfo = getLocaleInfoFromURL(url, { defaultLocale, resolveStrategy, supportedLocales })
      if (!localeInfo) console.warn(`Unable to infer locale from path <${url}>`)

      const locale = localeInfo?.locale ?? defaultLocale

      if (typeof document !== 'undefined') {
        useEffect(() => updateElementAttributes('meta', [{
          name: 'property',
          value: 'og:locale',
          key: true,
        }, {
          name: 'content',
          value: locale,
        }], {
          parent: document.head,
          autoCreate: false,
        }))

        useEffect(() => {
          const prevVal = document.documentElement.getAttribute('lang')
          const newVal = locale

          document.documentElement.setAttribute('lang', newVal)

          return () => {
            if (prevVal) {
              document.documentElement.setAttribute('lang', prevVal)
            }
            else {
              document.documentElement.removeAttribute('lang')
            }
          }
        }, [locale])
      }

      const state: I18nState = {
        localeChangeStrategy,
        defaultLocale,
        locale,
        translations,
        supportedLocales,
        getLocalizedPath: createLocalizedPathResolver(locale, { defaultLocale, resolveStrategy, supportedLocales }),
        getLocalizedString: createTranslationResolver(locale, { translations }),
      }

      return (
        <I18nContext.Provider value={{ state }}>
          {children}
        </I18nContext.Provider>
      )
    }
  }
}

const reducer = (state: I18nState, action: I18nChangeLocaleAction): I18nState => {
  switch (action.type) {
    case '@i18n/CHANGE_LOCALE':
      return {
        ...state,
        locale: action.locale,
        getLocalizedString: createTranslationResolver(action.locale, { translations: state.translations }),
      }
    default:
      return state
  }
}

export const I18nContext = createContext<I18nContextValue | undefined>(undefined)
