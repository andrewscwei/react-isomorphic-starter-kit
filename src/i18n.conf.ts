/**
 * @file I18n config.
 */

import { loadTranslations, type I18nConfig } from '@lib/i18n'
import { DEFAULT_LOCALE, LOCALE_CHANGE_STRATEGY } from './app.conf'

const sources = import.meta.glob('./locales/**/*.json', { eager: true })

export const i18n: I18nConfig = {
  defaultLocale: DEFAULT_LOCALE,
  localeChangeStrategy: LOCALE_CHANGE_STRATEGY,
  translations: loadTranslations(sources),
}
