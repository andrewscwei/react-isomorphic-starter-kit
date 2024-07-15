import { useEffect, type DependencyList } from 'react'
import { updateElementAttributes } from './updateElementAttributes.js'

/**
 * Hook for updating relevant title meta tags in the document head.
 *
 * @param title The title.
 * @param deps Additional dependencies.
 */
export function useDocumentTitle(title?: string, deps?: DependencyList) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const prevTitle = window.document.title

    if (title !== undefined) window.document.title = title ?? ''

    return () => {
      window.document.title = prevTitle
    }
  }, [title, ...deps ?? []])

  useEffect(() => updateElementAttributes(title !== undefined ? 'meta' : undefined, [
    { key: true, name: 'property', value: 'og:title' },
    { name: 'content', value: title ?? '' },
  ], {
    parent: window.document.head,
  }), [title, ...deps ?? []])

  useEffect(() => updateElementAttributes(title !== undefined ? 'meta' : undefined, [
    { key: true, name: 'name', value: 'twitter:title' },
    { name: 'content', value: title ?? '' },
  ], {
    parent: window.document.head,
  }), [title, ...deps ?? []])
}
