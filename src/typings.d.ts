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

type RouteConfig = {
  component: typeof import('react').ComponentType
  path: string
  index?: boolean
  prefetch?: () => Promise<any>
}

interface Error {
  status?: number
}

interface Window {
  __LOCALS__: Record<string, any>
  __VERSION__: string
}
