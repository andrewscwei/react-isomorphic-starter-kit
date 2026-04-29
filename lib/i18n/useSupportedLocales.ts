import { use } from 'react'

import { I18nContext } from './I18nContext.js'
import { createResolveLocaleOptions } from './utils/createResolveLocaleOptions.js'

/**
 * Hook for retrieving all supported locales.
 *
 * @returns All supported locales.
 */
export function useSupportedLocales() {
  const context = use(I18nContext)
  if (!context) throw Error('Cannot fetch the current i18n context, is the corresponding provider instated?')

  const { supportedLocales } = createResolveLocaleOptions(context.state)

  return supportedLocales
}
