/**
 * @file I18n config.
 */

import type { I18nConfig } from '../lib/i18n'
import { loadTranslations } from '../lib/i18n'
import { tryOrUndefined } from '../lib/utils'
import { LOCALE_CHANGE_STRATEGY } from './app.conf'

const { defaultLocale } = __BUILD_ARGS__

const i18n: I18nConfig = {
  defaultLocale,
  localeChangeStrategy: LOCALE_CHANGE_STRATEGY,
  translations: tryOrUndefined(() => loadTranslations(require.context('./locales', true, /^.*\.json$/))) ?? { [defaultLocale]: {} },
}

export default i18n
