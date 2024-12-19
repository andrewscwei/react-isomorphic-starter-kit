import { type Locale } from './Locale.js'

/**
 * A unit translation.
 */
export type Translation = { [key: string]: Translation | string }

/**
 * Dictionary of translations.
 */
export type Translations = Partial<Record<Locale, Translation>>
