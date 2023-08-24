/**
 * @file I18n config.
 */

import { I18nConfig, loadTranslations } from '../lib/i18n'
import { tryOrUndefined } from '../lib/utils'

const { defaultLocale } = __BUILD_ARGS__

const i18n: I18nConfig = {
  defaultLocale,
  localeChangeStrategy: 'path',
  translations: process.env.NODE_ENV === 'test'
    ? { [defaultLocale]: {} }
    : tryOrUndefined(() => loadTranslations(require.context('./locales', true, /^.*\.json$/))) ?? {},
}

export default i18n
