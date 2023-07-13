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

declare const __BUILD_ARGS__: typeof import('../../config/build.args')

interface Error {
  status?: number
}

interface Window {
  __LOCALS__: Record<string, any>
  __VERSION__: string
}

type RouteConfig = {
  component: React.ComponentType
  path: string
  index?: boolean
  prefetch?: () => Promise<any>
}

type RouterType = 'browser' | 'static'

type RootComponentProps<T extends RouterType> = {
  helmetContext?: Record<string, any>
  locals?: Record<string, any>
  routerProps?: T extends 'static' ? import('react-router-dom/server').StaticRouterProps : import('react-router-dom').BrowserRouterProps
  routerType?: T
}

type RootComponentType<T> = React.ComponentType<RootComponentProps<T>>
