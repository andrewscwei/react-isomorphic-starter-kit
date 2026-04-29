import { createContext } from 'react'

import { type Metadata } from './types/Metadata.js'

type ContextValue = {
  metadata: Metadata
}

export const MetaContext = createContext<ContextValue | undefined>(undefined)

if (process.env.NODE_ENV === 'development') {
  MetaContext.displayName = 'MetaContext'
}
