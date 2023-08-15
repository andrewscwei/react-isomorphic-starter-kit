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
declare module 'webpack-manifest-plugin'
declare module 'worker-loader!*' {
  class WebpackWorker extends Worker {
    constructor()
  }

  export default WebpackWorker
}

declare const __BUILD_ARGS__: typeof import('../config/build.args')

interface Error {
  status?: number
}

interface Window {
  __VERSION__: string
}

type RouteConfig = {
  component: React.ComponentType
  index?: boolean
  path: string
  metaTags?: (prefetched?: any, ltxt: typeof import('node-polyglot').prototype.t) => MetaTags
  prefetch?: (url: string, locale: string) => Promise<any>
}

type RootComponentProps = {
  locals?: Record<string, any>
  staticURL?: string
}

type LayoutComponentProps = PropsWithChildren<{
  description?: string
  injectScripts?: boolean
  locale?: string
  title?: string
  url?: string
  resolveAssetPath?: (path: string) => string
}>
