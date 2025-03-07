/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEBUG: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
