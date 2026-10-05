/**
 * Picks the best locale from `available` for one or more preferred locales. A
 * locale is equivalent to a BCP 47 tag.
 *
 * Matching is restricted to the given `available` list, so the result is always
 * one of its entries.
 *
 * @param preferred The preferred locale, or locales most preferred first.
 * @param available The locales to choose from.
 *
 * @returns The best matching tag as it appears in `available`, or `undefined`
 *          when nothing matches.
 */
export function negotiateLocale(preferred: string | string[], available: string[]): string | undefined {
  const locales = typeof preferred === 'string' ? [preferred] : preferred

  for (const locale of locales) {
    const match = matchLocale(locale.toLowerCase(), available)
    if (match !== undefined) return match
  }

  return undefined
}

/**
 * Finds the entry of `available` that best matches a single requested locale,
 * in order of priority:
 *
 * 1. An exact match.
 * 2. The locale's language subtag alone, e.g. a requested `de-DE` matching an
 *    available `de`.
 * 3. A locale with the same language and script, e.g. a requested `zh-TW`
 *    matching an available `zh-Hant`.
 * 4. Any locale with the same language subtag, e.g. a requested `pt-BR`
 *    matching an available `pt-PT`.
 */
function matchLocale(locale: string, available: string[]): string | undefined {
  const language = languageOf(locale)

  const exact = available.find(l => l.toLowerCase() === locale)
  if (exact !== undefined) return exact

  const languageOnly = available.find(l => l.toLowerCase() === language)
  if (languageOnly !== undefined) return languageOnly

  const normalized = normalizeLocale(locale)

  if (normalized !== undefined) {
    const sameScript = available.find(l => normalizeLocale(l) === normalized)
    if (sameScript !== undefined) return sameScript
  }

  return available.find(l => languageOf(l.toLowerCase()) === language)
}

/**
 * Returns a locale containing the language and script subtags, filling in the
 * likely script when the tag omits it, e.g. `zh-Hant` for `zh-TW`.
 *
 * @param locale The locale to extract the language and script subtags from.
 *
 * @returns The locale containing language and script subtags, or `undefined` if
 *          they cannot be determined.
 */
function normalizeLocale(locale: string): string | undefined {
  try {
    const { language, script } = new Intl.Locale(locale).maximize()

    return script === undefined ? undefined : `${language}-${script}`
  } catch {
    return undefined
  }
}

/**
 * Returns the language subtag of a locale, e.g. `de` for `de-DE`.
 *
 * @param locale The locale to extract the language subtag from.
 *
 * @returns The language subtag.
 */
function languageOf(locale: string): string {
  return locale.split('-')[0] ?? locale
}
