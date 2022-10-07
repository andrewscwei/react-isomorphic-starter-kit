declare module '*.jpg'
declare module '*.jpeg'
declare module '*.png'
declare module '*.gif'
declare module '*.svg'
declare module '*.mp4'
declare module '*.webm'
declare module '*.ogg'
declare module '*.mp3'
declare module '*.wav'
declare module '*.flac'
declare module '*.aac'
declare module '*.woff'
declare module '*.woff2'
declare module '*.eot'
declare module '*.ttf'
declare module '*.otf'
declare module '*.module.css'

declare const __CONFIG__: typeof import('./app.conf').default

declare module 'worker-loader!*' {
  class WebpackWorker extends Worker {
    constructor()
  }

  export default WebpackWorker
}

declare module 'webpack-manifest-plugin'

type AssetManifest = Record<string, any>

declare const __ASSET_MANIFEST__: AssetManifest

declare module 'sitemap'

interface Error {
  status?: number
}

interface Window {
  __LOCALS__: Record<string, any>
}
