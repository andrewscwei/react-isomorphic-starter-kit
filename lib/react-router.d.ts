import 'react-router'
import { type StaticHandlerContext } from 'react-router-dom/server'
import { type Metadata } from './templates'

declare module 'react-router' {
  export interface IndexRouteObject {
    metadata?: (context: StaticHandlerContext, options: { ltxt: (keyPath: string, ...args: any[]) => string }) => Promise<Metadata>
  }

  export interface NonIndexRouteObject {
    metadata?: (context: StaticHandlerContext, options: { ltxt: (keyPath: string, ...args: any[]) => string }) => Promise<Metadata>
  }
}
