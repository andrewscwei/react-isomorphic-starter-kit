import { useEffect, type DependencyList } from 'react'
import { updateElementAttributes } from './updateElementAttributes.js'

/**
 * Hook for updating relevant description meta tags in the document head.
 *
 * @param description The description.
 * @param deps Additional dependencies.
 */
export function useDocumentDescription(description?: string, deps?: DependencyList) {
  useEffect(() => updateElementAttributes(description !== undefined ? 'meta' : undefined, [
    { key: true, name: 'name', value: 'description' },
    { name: 'content', value: description ?? '' },
  ], {
    parent: window.document.head,
  }), [description, ...deps ?? []])

  useEffect(() => updateElementAttributes(description !== undefined ? 'meta' : undefined, [
    { key: true, name: 'property', value: 'og:description' },
    { name: 'content', value: description ?? '' },
  ], {
    parent: window.document.head,
  }), [description, ...deps ?? []])

  useEffect(() => updateElementAttributes(description !== undefined ? 'meta' : undefined, [
    { key: true, name: 'property', value: 'og:image:alt' },
    { name: 'content', value: description ?? '' },
  ], {
    parent: window.document.head,
  }), [description, ...deps ?? []])

  useEffect(() => updateElementAttributes(description !== undefined ? 'meta' : undefined, [
    { key: true, name: 'name', value: 'twitter:description' },
    { name: 'content', value: description ?? '' },
  ], {
    parent: window.document.head,
  }), [description, ...deps ?? []])
}
