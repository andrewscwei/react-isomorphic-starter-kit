import { DependencyList, useEffect } from 'react'
import updateElementAttributes from './updateElementAttributes'

export default function useDocumentDescription(description: string, deps?: DependencyList) {
  if (typeof document === 'undefined') return

  const metaTags = [{
    tagName: 'meta',
    keyAttribute: {
      name: 'name',
      value: 'description',
    },
    updateAttribute: {
      name: 'content',
      value: description,
    },
  }, {
    tagName: 'meta',
    keyAttribute: {
      name: 'property',
      value: 'og:description',
    },
    updateAttribute: {
      name: 'content',
      value: description,
    },
  }, {
    tagName: 'meta',
    keyAttribute: {
      name: 'property',
      value: 'og:image:alt',
    },
    updateAttribute: {
      name: 'content',
      value: description,
    },
  }, {
    tagName: 'meta',
    keyAttribute: {
      name: 'property',
      value: 'twitter:description',
    },
    updateAttribute: {
      name: 'content',
      value: description,
    },
  }]

  for (const tag of metaTags) {
    useEffect(() => updateElementAttributes(tag.tagName, [
      { key: true, ...tag.keyAttribute },
      { ...tag.updateAttribute },
    ], {
      parent: document.head,
    }), [description, ...deps ?? []])
  }
}
