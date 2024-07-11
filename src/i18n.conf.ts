/**
 * @file I18n config.
 */

import { loadTranslations, type I18nConfig } from '@lib/i18n'
import { tryOrUndefined } from '@lib/utils/tryOrUndefined'
import { DEFAULT_LOCALE, LOCALE_CHANGE_STRATEGY } from './app.conf'

const defaultLocale = DEFAULT_LOCALE
let sources: Record<string, any>

if (typeof import.meta.env === 'undefined') {
  const fs = await import('fs')
  const path = await import('path')
  const url = await import('url')
  const __filename = url.fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const dir = path.resolve(__dirname, 'locales')
  const res = fs.readdirSync(dir, { recursive: true })

  sources = res.reduce((acc, key) => {
    const file = tryOrUndefined(() => fs.readFileSync(path.resolve(dir, key as string), 'utf-8'))

    return {
      ...acc,
      ...file ? { [key as string]: { default: JSON.parse(file) } } : {},
    }
  }, {})
}
else {
  sources = import.meta.glob('./locales/**/*.json', { eager: true })
}

export const i18n: I18nConfig = {
  defaultLocale,
  localeChangeStrategy: LOCALE_CHANGE_STRATEGY,
  translations: loadTranslations(sources),
}
