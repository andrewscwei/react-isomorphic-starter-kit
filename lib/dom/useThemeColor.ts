import type { DependencyList } from 'react'
import { useEffect } from 'react'
import { updateElementAttributes } from './updateElementAttributes'

/**
 * Hook for updating the theme color meta tag in the document head.
 *
 * @param color The color.
 * @param deps Additional dependencies.
 */
export function useThemeColor(color: string, deps?: DependencyList) {
  if (typeof document === 'undefined') return

  const metaTags = [{
    tagName: 'meta',
    keyAttribute: {
      name: 'name',
      value: 'theme-color',
    },
    updateAttribute: {
      name: 'content',
      value: color,
    },
  }]

  for (const tag of metaTags) {
    useEffect(() => updateElementAttributes(tag.tagName, [
      { key: true, ...tag.keyAttribute },
      { ...tag.updateAttribute },
    ], {
      parent: document.head,
    }), [color, ...deps ?? []])
  }
}
