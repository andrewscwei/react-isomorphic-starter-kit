import { createContext, type PropsWithChildren, useMemo } from 'react'

import { type Metadata } from './types/Metadata.js'

type MetaProviderProps = PropsWithChildren<MetaContextValue>

type MetaContextValue = {
  metadata?: Metadata
}

/**
 * Context provider that holds a reference to the data for meta tags during
 * server-side rendering or edge-side rendering.
 *
 * @param props See {@link MetaProviderProps}.
 *
 * @returns The context provider.
 */
export function MetaProvider({ children, metadata }: MetaProviderProps) {
  const value = useMemo(() => ({ metadata }), [metadata])

  return (
    <MetaContext.Provider value={value}>
      {children}
    </MetaContext.Provider>
  )
}

export const MetaContext = createContext<MetaContextValue | undefined>(undefined)

if (process.env.NODE_ENV === 'development') {
  MetaContext.displayName = 'MetaContext'
}
