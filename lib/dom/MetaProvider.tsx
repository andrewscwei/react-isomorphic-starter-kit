import { createContext, type PropsWithChildren } from 'react'
import { type Metadata } from './Metadata.js'

type MetaProviderProps = PropsWithChildren<MetaContextValue>

type MetaContextValue = {
  current?: Metadata
  default: Metadata
}

export function MetaProvider({ children, current, default: defaultValue }: MetaProviderProps) {
  if (current && Object.keys(current).length === 0) {
    for (const key in defaultValue) {
      if (Object.prototype.hasOwnProperty.call(defaultValue, key) === false) continue
      const typedKey = key as keyof Metadata
      current[typedKey] = defaultValue[typedKey] as any
    }
  }

  return (
    <MetaContext.Provider value={{ current, default: defaultValue }}>
      {children}
    </MetaContext.Provider>

  )
}

export const MetaContext = createContext<MetaContextValue | undefined>(undefined)

Object.defineProperty(MetaContext, 'displayName', { value: 'Meta' })
