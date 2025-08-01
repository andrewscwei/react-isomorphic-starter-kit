/// <reference types="vite/client" />

interface ImportMetaEnv {
  /* Build args */
  readonly BASE_PATH: string
  readonly BUILD_TIME: string
  readonly BUILD_NUMBER: string
  readonly DEBUG: boolean
  readonly DEFAULT_LOCALE: string
  readonly VERSION: string

  /* App env */
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
