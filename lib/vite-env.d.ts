/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEBUG: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
