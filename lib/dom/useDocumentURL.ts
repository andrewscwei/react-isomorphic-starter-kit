import { useEffect, type DependencyList } from 'react'
import { updateElementAttributes } from './updateElementAttributes.js'

/**
 * Hook for updating relevant URL meta tags in the document head.
 *
 * @param url The URL.
 * @param deps Additional dependencies.
 */
export function useDocumentURL(url?: string, deps?: DependencyList) {
  useEffect(() => updateElementAttributes(url !== undefined ? 'link' : undefined, [
    { key: true, name: 'rel', value: 'canonical' },
    { name: 'href', value: url ?? '' },
  ], {
    parent: window.document.head,
  }), [url, ...deps ?? []])

  useEffect(() => updateElementAttributes(url !== undefined ? 'meta' : undefined, [
    { key: true, name: 'property', value: 'og:url' },
    { name: 'content', value: url ?? '' },
  ], {
    parent: window.document.head,
  }), [url, ...deps ?? []])
}
