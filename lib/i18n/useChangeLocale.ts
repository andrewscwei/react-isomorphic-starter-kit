import { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { I18nContext } from './I18nProvider'
import { createResolveLocaleOptions, getLocalizedURL } from './helpers'

/**
 * Hook for retrieving the change locale function.
 *
 * @returns The change locale function.
 */
export function useChangeLocale() {
  const context = useContext(I18nContext)
  if (!context) throw Error('Cannot fetch the current i18n context, is the corresponding provider instated?')

  const navigate = useNavigate()
  const { pathname, search, hash } = useLocation()
  const { localeChangeStrategy } = context.state

  switch (localeChangeStrategy) {
    case 'action': {
      return (locale: string) => context.dispatch?.({
        locale,
        type: '@i18n/CHANGE_LOCALE',
      })
    }
    case 'path':
    case 'query':
    default: {
      const path = `${pathname}${search}${hash}`

      return (locale: string) => {
        const newPath = getLocalizedURL(path, locale, createResolveLocaleOptions(context.state))

        navigate(newPath)
      }
    }
  }
}
