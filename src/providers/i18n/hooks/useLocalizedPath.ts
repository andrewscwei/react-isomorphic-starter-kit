import { useContext } from 'react'
import { I18nContext } from '../I18nProvider'
import { I18nRouterContext } from '../I18nRouterProvider'

/**
 * Hook for retrieving the path localizing function for the current locale.
 *
 * @returns The path localizing function.
 */
export default function useLocalizedPath() {
  const routerContext = useContext(I18nRouterContext)
  const context = useContext(I18nContext)

  if (context) {
    return (path: string) => path
  }
  else if (routerContext) {
    return routerContext.getLocalizedPath
  }
  else {
    throw Error('Cannot fetch the value of any compatible i18n context, is the corresponding provider instated?')
  }
}
