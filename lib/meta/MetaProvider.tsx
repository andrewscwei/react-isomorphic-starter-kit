import { type PropsWithChildren, useMemo } from 'react'

import { MetaContext } from './MetaContext.js'
import { type Metadata } from './types/Metadata.js'

type Props = PropsWithChildren<{
  metadata?: Metadata
}>

/**
 * Context provider that holds a reference to the data for meta tags during
 * server-side rendering or edge-side rendering.
 *
 * @param props See {@link Props}.
 *
 * @returns The context provider.
 */
export function MetaProvider({ children, metadata }: Props) {
  const value = useMemo(() => ({ metadata }), [metadata])

  return (
    <MetaContext.Provider value={value}>
      {children}
    </MetaContext.Provider>
  )
}
