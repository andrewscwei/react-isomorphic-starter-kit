import { useEffect, type DependencyList } from 'react'

export function useDOMEffect(effect: Parameters<typeof useEffect>[0], deps: DependencyList = []) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    return effect()
  }, [...deps])
}
