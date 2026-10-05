import { type PropsWithChildren, type Reducer, useMemo, useReducer, useState } from 'react'

import { type I18nAction, I18nContext } from './I18nContext.js'
import { type I18nConfig } from './types/I18nConfig.js'
import { type RouterAdapter } from './types/RouterAdapter.js'
import { createGetLocalizedPath } from './utils/createGetLocalizedPath.js'
import { createGetLocalizedString } from './utils/createGetLocalizedString.js'
import { getTextDirection } from './utils/getTextDirection.js'
import { negotiateLocale } from './utils/negotiateLocale.js'
import { resolveLocaleFromURL } from './utils/resolveLocaleFromURL.js'

type ActionProps = PropsWithChildren<{
  initialLocale?: string
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
 *   - If set to `path`, the locale is inferred from the current pathname
 *   - If set to `query`, the locale is inferred from the search parameter
 *     `locale` in the current path
 *
 * @param props See {@link I18nConfig} and {@link RouterAdapter}.
 *
 * @returns The context provider.
 */
export function I18nProvider(props: Props) {
  const { children, defaultLocale, routerAdapter, supportedLocales, translations } = props

  switch (props.localeChangeStrategy) {
    case 'action':
      return (
        <I18nActionProvider
          defaultLocale={defaultLocale}
          initialLocale={props.initialLocale}
          localeChangeStrategy='action'
          routerAdapter={routerAdapter}
          supportedLocales={supportedLocales}
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
          supportedLocales={supportedLocales}
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
  supportedLocales,
  translations,
}: ActionProps) => {
  const config = useMemo(() => ({
    defaultLocale,
    localeChangeStrategy,
    supportedLocales,
    translations,
  }), [defaultLocale, localeChangeStrategy, translations, supportedLocales])

  const [requestedLocale, dispatch] = useReducer(reducer, initialLocale)
  const [prevInitialLocale, setPrevInitialLocale] = useState(initialLocale)

  // If the initial locale has changed, update the previous initial locale and
  // dispatch the appropriate action.
  if (initialLocale !== prevInitialLocale) {
    setPrevInitialLocale(initialLocale)

    dispatch(initialLocale === undefined ? { type: '@i18n/RESET_LOCALE' } : { locale: initialLocale, type: '@i18n/CHANGE_LOCALE' })
  }

  const state = useMemo(() => {
    const locale = negotiateLocale(requestedLocale ?? [], supportedLocales) ?? defaultLocale

    return {
      defaultLocale,
      direction: getTextDirection(locale),
      locale,
      localeChangeStrategy,
      supportedLocales,
      translations,
      getLocalizedPath: createGetLocalizedPath(defaultLocale, config),
      getLocalizedString: createGetLocalizedString(locale, config),
    }
  }, [config, requestedLocale, defaultLocale, localeChangeStrategy, supportedLocales, translations])

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
  supportedLocales,
  translations,
}: PathProps) => {
  const config = useMemo(() => ({
    defaultLocale,
    localeChangeStrategy,
    supportedLocales,
    translations,
  }), [defaultLocale, localeChangeStrategy, translations, supportedLocales])

  const { hash, pathname, search } = router.useLocation()
  const url = `${pathname}${search}${hash}`
  const locale = resolveLocaleFromURL(url, config) ?? defaultLocale

  const value = useMemo(() => ({
    router,
    state: {
      defaultLocale,
      direction: getTextDirection(locale),
      locale,
      localeChangeStrategy,
      supportedLocales,
      translations,
      getLocalizedPath: createGetLocalizedPath(locale, config),
      getLocalizedString: createGetLocalizedString(locale, config),
    },
  }), [locale, router, defaultLocale, localeChangeStrategy, translations, supportedLocales])

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export const reducer: Reducer<string | undefined, I18nAction> = (state, action) => {
  switch (action.type) {
    case '@i18n/CHANGE_LOCALE':
      return action.locale
    case '@i18n/RESET_LOCALE':
      return undefined
    default:
      return state
  }
}
