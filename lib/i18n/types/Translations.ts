import { type Locale } from './Locale.js'

/**
 * A unit translation.
 */
export type Translation = { [key: string]: string | Translation }

/**
 * Dictionary of translations.
 */
export type Translations = Partial<Record<Locale, Translation>>
