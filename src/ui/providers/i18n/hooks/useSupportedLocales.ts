import { useContext } from 'react'
import { I18nContext } from '../I18nProvider'
import { I18nRouterContext } from '../I18nRouterProvider'

/**
 * Hook for retrieving all supported locales.
 *
 * @returns All supported locales.
 */
export default function useSupportedLocales() {
  const routerContext = useContext(I18nRouterContext)
  const context = useContext(I18nContext)

  if (context) {
    return context.state.supportedLocales
  }
  else if (routerContext) {
    return routerContext.supportedLocales
  }
  else {
    throw Error('Cannot fetch the value of any compatible i18n context, is the corresponding provider instated?')
  }
}
