import { type PropsWithChildren, type Reducer, useMemo, useReducer } from 'react'

import { type I18nAction, I18nContext, type I18nState } from './I18nContext.js'
import { type I18nConfig } from './types/I18nConfig.js'
import { type Locale } from './types/Locale.js'
import { type RouterAdapter } from './types/RouterAdapter.js'
import { createGetLocalizedPath } from './utils/createGetLocalizedPath.js'
import { createGetLocalizedString } from './utils/createGetLocalizedString.js'
import { createResolveLocaleOptions } from './utils/createResolveLocaleOptions.js'
import { resolveLocaleFromURL } from './utils/resolveLocaleFromURL.js'

type ActionProps = PropsWithChildren<{
  initialLocale?: Locale
  localeChangeStrategy: 'action'
  routerAdapter: RouterAdapter
} & I18nConfig>

type PathProps = PropsWithChildren<{
  localeChangeStrategy?: 'path' | 'query'
  routerAdapter: RouterAdapter
} & I18nConfig>

type Props = ActionProps | PathProps

/**
 * Context provider whose value consists of the current i18n state. The method
 * of modifying the locale is specified by `localeChangeStrategy`, as follows:
 *   - If set to `action`, the locale can be modified by dispatching an action
 *   - If set to `path`, the locale is inferred from the current path name
 *   - If set to `query`, the locale is inferred from the search parameter
 *     `locale` in the current path
 *
 * @param props See {@link I18nConfig} and {@link RouterAdapter}.
 *
 * @returns The context provider.
 */
export function I18nProvider(props: Props) {
  const { children, defaultLocale = 'en', routerAdapter, translations = {} } = props

  switch (props.localeChangeStrategy) {
    case 'action':
      return (
        <I18nActionProvider
          defaultLocale={defaultLocale}
          initialLocale={props.initialLocale}
          localeChangeStrategy='action'
          routerAdapter={routerAdapter}
          translations={translations}
        >
          {children}
        </I18nActionProvider>
      )
    case 'path':
    case 'query':
    default:
      return (
        <I18nPathProvider
          defaultLocale={defaultLocale}
          localeChangeStrategy={props.localeChangeStrategy ?? 'path'}
          routerAdapter={routerAdapter}
          translations={translations}
        >
          {children}
        </I18nPathProvider>
      )
  }
}

const I18nActionProvider = ({
  children,
  defaultLocale,
  initialLocale,
  localeChangeStrategy,
  routerAdapter: router,
  translations,
}: ActionProps) => {
  const config = useMemo(() => ({
    defaultLocale,
    localeChangeStrategy,
    translations,
  }), [defaultLocale, localeChangeStrategy, translations])

  const locale = initialLocale && translations[initialLocale] ? initialLocale : defaultLocale

  const [state, dispatch] = useReducer(reducer, {
    defaultLocale,
    locale,
    localeChangeStrategy,
    translations,
    getLocalizedPath: createGetLocalizedPath(defaultLocale, config),
    getLocalizedString: createGetLocalizedString(locale, config),
  })

  const value = useMemo(() => ({
    dispatch,
    router,
    state,
  }), [router, state])

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

const I18nPathProvider = ({
  children,
  defaultLocale,
  localeChangeStrategy,
  routerAdapter: router,
  translations,
}: PathProps) => {
  const config = useMemo(() => ({
    defaultLocale,
    localeChangeStrategy,
    translations,
  }), [defaultLocale, localeChangeStrategy, translations])

  const { hash, pathname, search } = router.useLocation()
  const url = `${pathname}${search}${hash}`
  const res = resolveLocaleFromURL(url, createResolveLocaleOptions(config))
  if (!res) console.warn(`Unable to infer locale from path <${url}>`)

  const locale = res?.locale ?? defaultLocale

  const value = useMemo(() => ({
    router,
    state: {
      defaultLocale,
      locale,
      localeChangeStrategy,
      translations,
      getLocalizedPath: createGetLocalizedPath(locale, config),
      getLocalizedString: createGetLocalizedString(locale, config),
    },
  }), [router, defaultLocale, locale, localeChangeStrategy, translations])

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export const reducer: Reducer<I18nState, I18nAction> = (state, action) => {
  switch (action.type) {
    case '@i18n/CHANGE_LOCALE':
      return {
        ...state,
        locale: action.locale,
        getLocalizedString: createGetLocalizedString(action.locale, state),
      }
    case '@i18n/RESET_LOCALE':
      return {
        ...state,
        locale: state.defaultLocale,
        getLocalizedString: createGetLocalizedString(state.defaultLocale, state),
      }
    default:
      return state
  }
}
