const RTL_SCRIPTS = ['Adlm', 'Arab', 'Hebr', 'Mand', 'Mend', 'Nkoo', 'Rohg', 'Samr', 'Syrc', 'Thaa', 'Yezi']

/**
 * Returns the direction text is written in for a locale.
 *
 * @param locale The locale.
 *
 * @returns `rtl` for locales written right to left, e.g. `ar` or `he`, `ltr`
 *          otherwise.
 */
export function getTextDirection(locale: string): 'ltr' | 'rtl' {
  try {
    const { script } = new Intl.Locale(locale).maximize()

    return script !== undefined && RTL_SCRIPTS.includes(script) ? 'rtl' : 'ltr'
  } catch {
    return 'ltr'
  }
}
