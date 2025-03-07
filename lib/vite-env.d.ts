/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEBUG_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
