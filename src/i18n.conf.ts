/**
 * @file I18n config.
 */

import { I18nConfig, loadTranslations } from '../lib/i18n'
import { tryOrUndefined } from '../lib/utils'

export default {
  defaultLocale: __BUILD_ARGS__.defaultLocale,
  localeChangeStrategy: 'path',
  translations: process.env.NODE_ENV === 'test'
    ? { [__BUILD_ARGS__.defaultLocale]: {} }
    : tryOrUndefined(() => loadTranslations(require.context('./locales', true, /^.*\.json$/))) ?? {},
} as I18nConfig
