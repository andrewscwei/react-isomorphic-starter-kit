import { I18nConfig, loadTranslations } from '../../lib/i18n'
import { tryOrUndefined } from '../../lib/utils'
import { DEFAULT_LOCALE, LOCALE_CHANGE_STRATEGY } from '../app.conf'

export const i18nConfig: I18nConfig = {
  defaultLocale: DEFAULT_LOCALE,
  localeChangeStrategy: LOCALE_CHANGE_STRATEGY,
  translations: tryOrUndefined(() => loadTranslations(require.context('./', true, /^.*\.json$/))) ?? {},
}
