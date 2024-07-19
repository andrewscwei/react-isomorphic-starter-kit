import { useContext, useEffect, type DependencyList } from 'react'
import { useLocation } from 'react-router'
import { joinURL } from '../utils/joinURL.js'
import { type Metadata } from './Metadata.js'
import { MetaContext } from './MetaProvider.js'
import { updateElementAttributes } from './updateElementAttributes.js'
import { useAppleMeta } from './useAppleMeta.js'
import { useOpenGraphMeta } from './useOpenGraphMeta.js'
import { useTwitterMeta } from './useTwitterMeta.js'

type Options = {
  auto?: boolean
}

function assign<T extends Record<string, any>>(target: T, assignee: T) {
  for (const key in assignee) {
    if (Object.prototype.hasOwnProperty.call(assignee, key) === false) continue

    const assignedValue = assignee[key]

    if (assignedValue === undefined || assignedValue === null) continue

    if (typeof assignedValue === 'object') {
      assign(target[key], assignedValue)
    }
    else {
      target[key] = assignedValue
    }
  }
}

/**
 * Hook for modifying head meta tags.
 *
 * @param params See {@link Params}.
 * @param deps Additional dependencies.
 */
export function useMeta(metadata: Metadata, {
  auto = false,
}: Options = {}, deps?: DependencyList) {
  const context = useContext(MetaContext)
  const { baseTitle, description, themeColor, title, url, apple = {}, openGraph = {}, twitter = {} } = metadata
  const location = useLocation()

  if (context?.context) {
    assign(context.context, {
      url: joinURL(context.default.baseURL ?? '', location.pathname),
      ...metadata,
    })
  }

  useEffect(() => {
    if (typeof window === 'undefined' || !metadata.locale) return

    const prevVal = window.document.documentElement.getAttribute('lang')

    window.document.documentElement.setAttribute('lang', metadata.locale)

    return () => {
      if (prevVal) {
        window.document.documentElement.setAttribute('lang', prevVal)
      }
      else {
        window.document.documentElement.removeAttribute('lang')
      }
    }
  }, [metadata.locale, ...deps ?? []])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const prevTitle = window.document.title

    if (title !== undefined) window.document.title = title ?? ''

    return () => {
      window.document.title = prevTitle
    }
  }, [title, ...deps ?? []])

  useEffect(() => updateElementAttributes(description !== undefined ? 'meta' : undefined, [
    { key: true, name: 'name', value: 'description' },
    { name: 'content', value: description ?? '' },
  ], {
    parent: window.document.head,
  }), [description, ...deps ?? []])

  useEffect(() => updateElementAttributes(url !== undefined ? 'link' : undefined, [
    { key: true, name: 'rel', value: 'canonical' },
    { name: 'href', value: url ?? '' },
  ], {
    parent: window.document.head,
  }), [url, ...deps ?? []])

  useEffect(() => updateElementAttributes(themeColor !== undefined ? 'meta' : undefined, [
    { key: true, name: 'name', value: 'theme-color' },
    { name: 'content', value: themeColor },
  ], {
    parent: window.document.head,
  }), [themeColor, ...deps ?? []])

  useAppleMeta({ title, ...apple }, { auto }, deps)
  useOpenGraphMeta({ description, siteName: baseTitle, title, url, ...openGraph }, { auto }, deps)
  useTwitterMeta({ description, title, ...twitter }, { auto }, deps)
}
