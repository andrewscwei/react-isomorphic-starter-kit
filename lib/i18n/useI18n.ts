import { use } from 'react'

import { I18nContext } from './I18nContext.js'
import { type GetLocalizedPath } from './types/GetLocalizedPath.js'
import { type GetLocalizedString } from './types/GetLocalizedString.js'

type Output = {
  direction: 'ltr' | 'rtl'
  locale: string

  l: GetLocalizedPath
  t: GetLocalizedString
}

/**
 * Hook for retrieving the current locale and the text and path localizing
 * functions.
 *
 * @returns Object containing the current `locale` and its text `direction`,
 *          text localizing function `t` and path localizing function `l`.
 */
export function useI18n(): Output {
  const context = use(I18nContext)
  if (!context) {
    return {
      direction: 'ltr',
      locale: 'en',
      l: v => v,
      t: v => v,
    }
  }

  return {
    direction: context.state.direction,
    locale: context.state.locale,

    l: context.state.getLocalizedPath,
    t: context.state.getLocalizedString,
  }
}
