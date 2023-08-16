import getLocalizedURL from '../getLocalizedURL'
import getUnlocalizedURL from '../getUnlocalizedURL'

type Options = {
  /**
   * The locale to fallback to if one cannot be inferred from the provided URL.
   */
  defaultLocale?: string

  /**
   * An array of supported locales to validate the inferred locale against. If
   * it doesn't exist in the list of supported locales, the default locale (if
   * specified) or `undefined` will be returned.
   */
  supportedLocales?: string[]

  /**
   * Specifies where in the URL the locale should be matched. If `resolver` is
   * provided, this option is ignored.
   */
  resolveStrategy?: 'auto' | 'domain' | 'path' | 'query' | 'custom'
}

type Output = (path: string) => string

export default function createGetLocalizedPath(locale: string, {
  defaultLocale,
  resolveStrategy,
  supportedLocales,
}: Options = {}): Output {
  return (path: string) => {
    if (locale === defaultLocale) {
      return getUnlocalizedURL(path, { resolveStrategy, supportedLocales })
    }
    else {
      return getLocalizedURL(path, locale, { defaultLocale, resolveStrategy, supportedLocales })
    }
  }
}
