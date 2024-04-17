import { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { I18nContext } from './I18nProvider'
import { createResolveLocaleOptions, getLocalizedURL } from './helpers'

/**
 * Hook for retrieving the reset locale function.
 *
 * @returns The reset locale function.
 */
export function useResetLocale() {
  const context = useContext(I18nContext)
  if (!context) throw Error('Cannot fetch the current i18n context, is the corresponding provider instated?')

  const navigate = useNavigate()
  const { pathname, search, hash } = useLocation()
  const { localeChangeStrategy } = context.state

  switch (localeChangeStrategy) {
    case 'action': {
      return () => context.dispatch?.({
        type: '@i18n/RESET_LOCALE',
      })
    }
    case 'path':
    case 'query':
    default: {
      const path = `${pathname}${search}${hash}`

      return () => {
        const newPath = getLocalizedURL(path, context.state.defaultLocale, createResolveLocaleOptions(context.state))

        navigate(newPath)
      }
    }
  }
}
