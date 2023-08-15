import { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { I18nContext } from './I18nProvider'
import getLocalizedURL from './getLocalizedURL'
import getUnlocalizedURL from './getUnlocalizedURL'

/**
 * Hook for retrieving the change locale function.
 *
 * @returns The change locale function.
 */
export default function useChangeLocale() {
  const context = useContext(I18nContext)
  if (!context) throw Error('Cannot fetch the current i18n context, is the corresponding provider instated?')

  if (context.state.localeChangeStrategy === 'action') {
    return (locale: string) => context.dispatch?.({
      locale,
      type: '@i18n/CHANGE_LOCALE',
    })
  }
  else {
    const { defaultLocale, localeChangeStrategy, supportedLocales } = context.state
    const { pathname, search, hash } = useLocation()

    const path = `${pathname}${search}${hash}`
    const navigate = useNavigate()
    const resolveStrategy = localeChangeStrategy === 'path' ? 'path' : 'query'

    return (locale: string) => {
      const newPath = locale === defaultLocale
        ? getUnlocalizedURL(path, { resolveStrategy, supportedLocales })
        : getLocalizedURL(path, locale, { defaultLocale, resolveStrategy, supportedLocales })

      navigate(newPath)
    }
  }
}
