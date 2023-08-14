import getLocalizedURL, { ResolveLocalizedURLOptions } from './getLocalizedURL'
import getUnlocalizedURL from './getUnlocalizedURL'

type Params = Required<Pick<ResolveLocalizedURLOptions, 'resolveStrategy' | 'supportedLocales' | 'defaultLocale'>>

type LocalizePathFunction = (path: string) => string

export default function createLocalizePathFunction(locale: string, { defaultLocale, resolveStrategy, supportedLocales }: Params): LocalizePathFunction {
  return (path: string) => {
    if (locale === defaultLocale) {
      return getUnlocalizedURL(path, { resolveStrategy, supportedLocales })
    }
    else {
      return getLocalizedURL(path, locale, { defaultLocale, resolveStrategy, supportedLocales })
    }
  }
}
