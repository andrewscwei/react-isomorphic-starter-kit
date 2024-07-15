import { loadTranslations } from './loadTranslations.js'
import { type I18nConfig } from './types/I18nConfig.js'
import { type Locale } from './types/Locale.js'

type Params = {
  /**
   * @see {@link I18nConfig.defaultLocale}
   */
  defaultLocale?: Locale

  /**
   * @see {@link I18nConfig.localeChangeStrategy}
   */
  localeChangeStrategy?: 'action' | 'path' | 'query'

  /**
   * Dictionary of locale file sources.
   */
  sources: Record<string, any>
}

export function defineConfig({
  defaultLocale = 'en',
  localeChangeStrategy = 'path',
  sources,
}: Params): I18nConfig {
  const translations = loadTranslations(sources)

  return {
    defaultLocale,
    localeChangeStrategy,
    translations: Object.keys(translations).length > 0 ? translations : { [defaultLocale]: {} },
  }
}
