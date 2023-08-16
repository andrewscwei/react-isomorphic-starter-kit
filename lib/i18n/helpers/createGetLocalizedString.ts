import { sprintf } from 'sprintf-js'

type Options = {
  translations: Record<string, any>
}

type Output = (keyPath: string, ...args: any[]) => string

export default function createGetLocalizedString(locale: string, {
  translations,
}: Options): Output {
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
