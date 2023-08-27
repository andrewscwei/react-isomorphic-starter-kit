import type { Locale } from './Locale'

export type Translation = { [key: string]: Translation | string }

export type Translations = Record<Locale, Translation>
