import { useContext } from 'react'
import { I18nContext } from '../I18nProvider'
import { I18nRouterContext } from '../I18nRouterProvider'

/**
 * Hook for retrieving the string localizing function for the current locale.
 *
 * @returns The string localizing function.
 */
export default function useLocalizedString() {
  const routerContext = useContext(I18nRouterContext)
  const context = useContext(I18nContext)

  if (context) {
    return context.state.getLocalizedString
  }
  else if (routerContext) {
    return routerContext.getLocalizedString
  }
  else {
    throw Error('Cannot fetch the value of any compatible i18n context, is the corresponding provider instated?')
  }
}
