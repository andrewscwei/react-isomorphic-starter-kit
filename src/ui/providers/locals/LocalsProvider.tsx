import React, { createContext, PropsWithChildren } from 'react'

type LocalsContextValue = Record<string, any>

type LocalsProviderProps = PropsWithChildren<{
  locals?: LocalsContextValue
}>

export const LocalsContext = createContext<LocalsContextValue>({})

export default function LocalsProvider({
  children,
  locals = {},
}: LocalsProviderProps) {
  return (
    <LocalsContext.Provider value={locals}>
      {children}
    </LocalsContext.Provider>
  )
}
