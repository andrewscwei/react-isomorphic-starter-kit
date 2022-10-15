import { useContext } from 'react'
import { LocalsContext } from '../LocalsProvider'

export default function useLocals() {
  const context = useContext(LocalsContext)

  if (context) {
    return context
  }
  else {
    throw Error('Cannot fetch locals, is the corresponding provider instated?')
  }
}
