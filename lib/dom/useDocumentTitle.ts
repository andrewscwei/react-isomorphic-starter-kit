import { DependencyList, useEffect } from 'react'
import updateElementAttributes from './updateElementAttributes'

export default function useDocumentTitle(title: string, deps?: DependencyList) {
  if (typeof document === 'undefined') return

  useEffect(() => {
    const prevTitle = document.title
    document.title = title

    return () => {
      document.title = prevTitle
    }
  }, [title, ...deps ?? []])

  const metaTags = [{
    tagName: 'meta',
    keyAttribute: {
      name: 'name',
      value: 'og:title',
    },
    updateAttribute: {
      name: 'content',
      value: title,
    },
  }, {
    tagName: 'meta',
    keyAttribute: {
      name: 'name',
      value: 'twitter:title',
    },
    updateAttribute: {
      name: 'content',
      value: title,
    },
  }]

  for (const tag of metaTags) {
    useEffect(() => updateElementAttributes(tag.tagName, [
      { key: true, ...tag.keyAttribute },
      { ...tag.updateAttribute },
    ], {
      parent: document.head,
    }), [title, ...deps ?? []])
  }
}