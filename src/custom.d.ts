declare module 'webpack-manifest-plugin'
declare module 'sitemap'
declare module '*.svg'

declare const __BUILD_CONFIG__: Record<string, any>
declare const __ASSET_MANIFEST__: AssetManifest
declare const __I18N_CONFIG__: Readonly<{
  defaultLocale: string
  locales: string
  dict: TranslationDataDict
}>

declare module 'worker-loader!*' {
  class WebpackWorker extends Worker {
    constructor()
  }

  export default WebpackWorker
}

type TranslationData = { [key: string]: string | TranslationData }
type TranslationDataDict = Record<string, TranslationData>
type AssetManifest = Record<string, any>

interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: () => void
  __BUILD_NUMBER__: string
  __INITIAL_STATE__?: Record<string, any>
  __LOCALS__: Record<string, any>
  __VERSION__: string
}

interface Error {
  status?: number
}
