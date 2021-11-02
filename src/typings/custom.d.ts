// Suports importing assets.
declare module '*.svg'
declare module '*.jpg'
declare module '*.png'

// Supports typing for build config.
declare const __BUILD_CONFIG__: typeof import('../../config/build.conf').default

// Supports web workers.
declare module 'worker-loader!*' {
  class WebpackWorker extends Worker {
    constructor()
  }

  export default WebpackWorker
}

// Supports I18n.
interface TranslationData { [key: string]: TranslationData | string }
type TranslationDataDict = Record<string, TranslationData>

declare const __I18N_CONFIG__: Readonly<{
  defaultLocale: string
  locales: string
  dict: TranslationDataDict
}>

// Supports asset manifest file.
declare module 'webpack-manifest-plugin'

type AssetManifest = Record<string, any>

declare const __ASSET_MANIFEST__: AssetManifest

// Supports sitemap generation.
declare module 'sitemap'

// Supports custom error with status code.
interface Error {
  status?: number
}

// Custom window properties.
interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: () => void
  __BUILD_NUMBER__: string
  __INITIAL_STATE__?: Record<string, any>
  __LOCALS__: Record<string, any>
  __VERSION__: string
}
