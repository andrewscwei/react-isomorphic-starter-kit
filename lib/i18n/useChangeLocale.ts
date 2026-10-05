import { use, useCallback } from 'react'

import { I18nContext } from './I18nContext.js'
import { getLocalizedURL } from './utils/getLocalizedURL.js'

/**
 * Hook for retrieving the change locale function.
 *
 * @returns The change locale function.
 */
export function useChangeLocale() {
  const context = use(I18nContext)
  if (!context) throw Error('Cannot fetch the current i18n context, is the corresponding provider instated?')

  const navigate = context.router.useNavigate()
  const { hash, pathname, search } = context.router.useLocation()
  const { dispatch, state } = context

  return useCallback((locale: string) => {
    switch (state.localeChangeStrategy) {
      case 'action':
        dispatch?.({ locale, type: '@i18n/CHANGE_LOCALE' })
        break
      case 'path':
      case 'query':
      default:
        navigate(getLocalizedURL(`${pathname}${search}${hash}`, locale, state))
    }
  }, [dispatch, hash, navigate, pathname, search, state])
}
