import { useEffect, type DependencyList } from 'react'

/**
 * Hook for updating relevant locale meta tags in the document head.
 *
 * @param locale The locale.
 * @param deps Additional dependencies.
 */
export function useDocumentLocale(locale: string, deps?: DependencyList) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const prevVal = window.document.documentElement.getAttribute('lang')
    const newVal = locale

    window.document.documentElement.setAttribute('lang', newVal)

    return () => {
      if (prevVal) {
        window.document.documentElement.setAttribute('lang', prevVal)
      }
      else {
        window.document.documentElement.removeAttribute('lang')
      }
    }
  }, [locale, ...deps ?? []])
}
