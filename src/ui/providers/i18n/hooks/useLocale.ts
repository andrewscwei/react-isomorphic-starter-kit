import { useContext } from 'react'
import { I18nContext } from '../I18nProvider'
import { I18nRouterContext } from '../I18nRouterProvider'

/**
 * Hook for retrieving the current locale.
 *
 * @returns The current locale.
 */
export default function useLocale() {
  const routerContext = useContext(I18nRouterContext)
  const context = useContext(I18nContext)

  if (context) {
    return context.state.locale
  }
  else if (routerContext) {
    return routerContext.locale
  }
  else {
    throw Error('Cannot fetch the value of any compatible i18n context, is the corresponding provider instated?')
  }
}
