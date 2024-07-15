import { useEffect, type DependencyList } from 'react'
import { updateElementAttributes } from './updateElementAttributes.js'

/**
 * Hook for updating the theme color meta tag in the document head.
 *
 * @param color The color.
 * @param deps Additional dependencies.
 */
export function useThemeColor(color: string, deps?: DependencyList) {
  useEffect(() => updateElementAttributes('meta', [
    { key: true, name: 'name', value: 'theme-color' },
    { name: 'content', value: color },
  ], {
    parent: window.document.head,
  }), [color, ...deps ?? []])
}
