import { use } from 'react'

import { I18nContext } from './I18nContext.js'

/**
 * Hook for retrieving the text and path localizing functions for the current
 * locale.
 *
 * @returns Object containing the current locale, text localizing function `t`
 *          and path localizing function `l`.
 */
export function useI18n() {
  const context = use(I18nContext)
  if (!context) throw new Error('Cannot fetch the current i18n context, is the corresponding provider instated?')

  return {
    l: context.state.getLocalizedPath,
    locale: context.state.locale,
    t: context.state.getLocalizedString,
  }
}
