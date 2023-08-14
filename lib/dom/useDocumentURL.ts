import { DependencyList, useEffect } from 'react'
import updateElementAttributes from './updateElementAttributes'

export default function useDocumentURL(url: string, deps?: DependencyList) {
  if (typeof document === 'undefined') return

  const metaTags = [{
    tagName: 'link',
    keyAttribute: {
      name: 'rel',
      value: 'canonical',
    },
    updateAttribute: {
      name: 'href',
      value: url,
    },
  }, {
    tagName: 'meta',
    keyAttribute: {
      name: 'property',
      value: 'og:url',
    },
    updateAttribute: {
      name: 'content',
      value: url,
    },
  }]

  for (const tag of metaTags) {
    useEffect(() => updateElementAttributes(tag.tagName, [
      { key: true, ...tag.keyAttribute },
      { ...tag.updateAttribute },
    ], {
      parent: document.head,
    }), [url, ...deps ?? []])
  }
}
