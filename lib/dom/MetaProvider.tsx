import { createContext, type PropsWithChildren } from 'react'
import { type Metadata } from './Metadata.js'

type MetaProviderProps = PropsWithChildren<MetaContextValue>

type MetaContextValue = {
  context?: Metadata
  default: Metadata
}

export function MetaProvider({ children, context, default: defaultValue }: MetaProviderProps) {
  if (context && Object.keys(context).length === 0) {
    for (const key in defaultValue) {
      if (Object.prototype.hasOwnProperty.call(defaultValue, key) === false) continue
      const typedKey = key as keyof Metadata
      context[typedKey] = defaultValue[typedKey] as any
    }
  }

  return (
    <MetaContext.Provider value={{ context, default: defaultValue }}>
      {children}
    </MetaContext.Provider>

  )
}

export const MetaContext = createContext<MetaContextValue | undefined>(undefined)

Object.defineProperty(MetaContext, 'displayName', { value: 'Meta' })
