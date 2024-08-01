/// <reference types="vite/client" />

/* eslint-disable @typescript-eslint/consistent-type-imports */

interface ImportMetaEnv {
  /* Build args */
  BASE_PATH: string
  BASE_URL: string
  BUILD_TIME: string
  BUILD_NUMBER: string
  DEBUG_MODE: string
  DEFAULT_LOCALE: import('@lib/i18n/index.js').Locale
  DEFAULT_METADATA: import('@lib/dom/index.js').Metadata
  VERSION: string

  /* App env */
}
