/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface ImportMetaEnv {
  readonly BASE_PATH: string
  readonly BUILD_NUMBER: string
  readonly BUILD_TIME: string
  readonly DEBUG: boolean
  readonly DEFAULT_LOCALE: string
  readonly VERSION: string
}
