import type { DependencyList } from 'react'
import { useEffect } from 'react'
import updateElementAttributes from './updateElementAttributes'

/**
 * Hook for updating relevant locale meta tags in the document head.
 *
 * @param locale - The locale.
 * @param deps - Additional dependencies.
 */
export default function useDocumentLocale(locale: string, deps?: DependencyList) {
  if (typeof document === 'undefined') return

  useEffect(() => updateElementAttributes('meta', [{
    name: 'property',
    value: 'og:locale',
    key: true,
  }, {
    name: 'content',
    value: locale,
  }], {
    parent: document.head,
    autoCreate: false,
  }), [locale, ...deps ?? []])

  useEffect(() => {
    const prevVal = document.documentElement.getAttribute('lang')
    const newVal = locale

    document.documentElement.setAttribute('lang', newVal)

    return () => {
      if (prevVal) {
        document.documentElement.setAttribute('lang', prevVal)
      }
      else {
        document.documentElement.removeAttribute('lang')
      }
    }
  }, [locale, ...deps ?? []])
}
