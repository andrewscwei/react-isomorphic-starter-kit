import { useContext } from 'react'

import { I18nContext } from './I18nProvider.js'
import { createResolveLocaleOptions } from './utils/createResolveLocaleOptions.js'

/**
 * Hook for retrieving all supported locales.
 *
 * @returns All supported locales.
 */
export function useSupportedLocales() {
  const context = useContext(I18nContext)
  if (!context) throw Error('Cannot fetch the current i18n context, is the corresponding provider instated?')

  const { supportedLocales } = createResolveLocaleOptions(context.state)

  return supportedLocales
}
