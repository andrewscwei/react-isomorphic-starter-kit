/**
 * Checks whether a value is a canonical BCP 47 tag.
 *
 * @param value The value to check.
 *
 * @returns `true` if the value is a canonical BCP 47 tag.
 */
export function isLocale(value: string): boolean {
  try {
    return Intl.getCanonicalLocales(value)[0] === value
  } catch {
    return false
  }
}
