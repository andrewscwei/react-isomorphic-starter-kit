import { useContext } from 'react'

import { I18nContext } from './I18nProvider.js'
import { createResolveLocaleOptions } from './utils/createResolveLocaleOptions.js'
import { getLocalizedURL } from './utils/getLocalizedURL.js'

/**
 * Hook for retrieving the reset locale function.
 *
 * @returns The reset locale function.
 */
export function useResetLocale() {
  const context = useContext(I18nContext)
  if (!context) throw Error('Cannot fetch the current i18n context, is the corresponding provider instated?')

  const navigate = context.router.useNavigate()
  const { hash, pathname, search } = context.router.useLocation()
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
