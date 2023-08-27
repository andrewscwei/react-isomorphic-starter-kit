import 'react-router'
import type { Metadata } from './templates'

declare module 'react-router' {
  export interface IndexRouteObject {
    metadata?: (ltxt: (keyPath: string, ...args: any[]) => string) => Promise<Metadata>
  }

  export interface NonIndexRouteObject {
    metadata?: (ltxt: (keyPath: string, ...args: any[]) => string) => Promise<Metadata>
  }
}
