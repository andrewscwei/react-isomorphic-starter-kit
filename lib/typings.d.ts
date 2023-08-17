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

type RouteObjectWithMetadata = import('react-router').RouteObject & {
  metadata?: (ltxt: (keyPath: string, ...args: any[]) => string) => Promise<{ title?: string; description?: string }>
}

type RootComponentProps = {
  routerProvider?: JSX.Element
  url?: string
}

type LayoutComponentProps = {
  injectScripts?: boolean
  metadata?: {
    description?: string
    locale?: string
    title?: string
    url?: string
  }
  resolveAssetPath?: (path: string) => string
}
