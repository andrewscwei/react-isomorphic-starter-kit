import { useEffect, type DependencyList } from 'react'

/**
 * Hook for updating document language in the document head.
 *
 * @param lang The language.
 * @param deps Additional dependencies.
 */
export function useDocumentLang(lang: string, deps?: DependencyList) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const prevVal = window.document.documentElement.getAttribute('lang')
    const newVal = lang

    window.document.documentElement.setAttribute('lang', newVal)

    return () => {
      if (prevVal) {
        window.document.documentElement.setAttribute('lang', prevVal)
      }
      else {
        window.document.documentElement.removeAttribute('lang')
      }
    }
  }, [lang, ...deps ?? []])
}
