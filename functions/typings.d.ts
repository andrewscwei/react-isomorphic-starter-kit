declare module '*.html'

declare module '@build/main.edge.js' {
  import { type RenderFunction } from '@lib/esr'

  export const render: RenderFunction
}
