import { sprintf } from 'sprintf-js'

type Params = {
  translations: Record<string, any>
}

type TranslateFunction = (keyPath: string, ...args: any[]) => string

export default function createTranslateFunction(locale: string, { translations }: Params): TranslateFunction {
  const dict = translations[locale]

  return (keyPath: string, ...args) => {
    if (!dict) {
      console.warn(`No translations found for locale "${locale}"`)

      return keyPath
    }

    const keys = keyPath.split('.')

    let str = dict

    try {
      while (keys.length > 0) {
        const key = keys.shift()
        if (!key || typeof key !== 'string') throw Error(`Invalid key "${key}"`)
        str = str[key]
      }
    }
    catch (err) {
      return keyPath
    }

    if (typeof str !== 'string') return keyPath

    return sprintf(str, ...args)
  }
}
