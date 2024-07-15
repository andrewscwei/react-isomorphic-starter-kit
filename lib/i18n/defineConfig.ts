import { loadTranslations } from './loadTranslations.js'
import { type I18nConfig } from './types/I18nConfig.js'
import { type Locale } from './types/Locale.js'

type Params = {
  defaultLocale?: Locale
  localeChangeStrategy?: 'action' | 'path' | 'query'
  sources: Record<string, any>
}

export function defineConfig({
  defaultLocale = 'en',
  localeChangeStrategy = 'path',
  sources,
}: Params): I18nConfig {
  return {
    defaultLocale,
    localeChangeStrategy,
    translations: loadTranslations(sources),
  }
}
