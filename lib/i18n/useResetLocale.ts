import { use, useCallback } from 'react'

import { I18nContext } from './I18nContext.js'
import { getLocalizedURL } from './utils/getLocalizedURL.js'

/**
 * Hook for retrieving the reset locale function.
 *
 * @returns The reset locale function.
 */
export function useResetLocale() {
  const context = use(I18nContext)
  if (!context) throw Error('Cannot fetch the current i18n context, is the corresponding provider instated?')

  const navigate = context.router.useNavigate()
  const { hash, pathname, search } = context.router.useLocation()
  const { dispatch, state } = context

  return useCallback(() => {
    switch (state.localeChangeStrategy) {
      case 'action':
        dispatch?.({ type: '@i18n/RESET_LOCALE' })
        break
      case 'path':
      case 'query':
      default:
        navigate(getLocalizedURL(`${pathname}${search}${hash}`, state.defaultLocale, state))
    }
  }, [hash, pathname, search, state, dispatch, navigate])
}
