import React, { createContext, PropsWithChildren, useContext } from 'react'

type LocalsContextValue = Record<string, any>

type LocalsProviderProps = PropsWithChildren<{
  locals?: LocalsContextValue
}>

export const LocalsContext = createContext<LocalsContextValue>({})

export function useLocals() {
  const context = useContext(LocalsContext)

  if (context) {
    return context
  }
  else {
    throw Error('Cannot fetch locals, is the corresponding provider instated?')
  }
}

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
