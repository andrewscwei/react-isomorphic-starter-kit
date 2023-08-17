import Locale from './Locale'

type Translation = { [key: string]: Translation | string }

type Translations = Record<Locale, Translation>

export default Translations
