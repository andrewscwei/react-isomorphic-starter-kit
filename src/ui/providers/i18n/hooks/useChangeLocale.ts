import { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { I18nContext } from '../I18nProvider'
import { I18nRouterContext } from '../I18nRouterProvider'
import { getLocalizedURL, getUnlocalizedURL } from '../utils/urls'

/**
 * Hook for retrieving the change locale function.
 *
 * @returns The change locale function.
 */
export default function useChangeLocale() {
  const routerContext = useContext(I18nRouterContext)
  const context = useContext(I18nContext)

  if (context) {
    return (locale: string) => context.dispatch({
      locale,
      type: '@i18n/CHANGE_LOCALE',
    })
  }
  else if (routerContext) {
    const { defaultLocale, location, supportedLocales } = routerContext
    const { pathname, search, hash } = useLocation()
    const path = `${pathname}${search}${hash}`
    const navigate = useNavigate()

    return (locale: string) => {
      const newPath = locale === defaultLocale
        ? getUnlocalizedURL(path, { location, supportedLocales })
        : getLocalizedURL(path, locale, { defaultLocale, location, supportedLocales })

      navigate(newPath)
    }
  }
  else {
    throw Error('Cannot fetch the value of any compatible i18n context, is the corresponding provider instated?')
  }
}
