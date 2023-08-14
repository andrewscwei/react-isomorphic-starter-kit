import { DependencyList, useEffect } from 'react'
import updateElementAttributes from './updateElementAttributes'

export default function useThemeColor(color: string, deps?: DependencyList) {
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
