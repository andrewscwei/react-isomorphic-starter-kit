import 'react-router'

declare module 'react-router' {
  export interface IndexRouteObject {
    metadata?: (ltxt: (keyPath: string, ...args: any[]) => string) => Promise<import('./templates').Metadata>
  }

  export interface NonIndexRouteObject {
    metadata?: (ltxt: (keyPath: string, ...args: any[]) => string) => Promise<import('./templates').Metadata>
  }
}
