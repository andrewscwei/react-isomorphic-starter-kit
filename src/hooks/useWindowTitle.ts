import { DependencyList, useEffect } from 'react'

export default function useWindowTitle(title: string, deps: DependencyList = []) {
  useEffect(() => {
    if (typeof document === 'undefined') return
    document.title = title
  }, [title, ...deps])
}
