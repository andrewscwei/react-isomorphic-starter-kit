import { type Locale } from './Locale'

/**
 * A unit translation.
 */
export type Translation = { [key: string]: Translation | string }

/**
 * Dictionary of translations.
 */
export type Translations = { [key in Locale]?: Translation }
