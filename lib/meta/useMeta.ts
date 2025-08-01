import { useContext, type DependencyList } from 'react'
import { useAppleMeta } from './hooks/useAppleMeta.js'
import { useDOMEffect } from './hooks/useDOMEffect.js'
import { useOpenGraphMeta } from './hooks/useOpenGraphMeta.js'
import { useTwitterMeta } from './hooks/useTwitterMeta.js'
import { MetaContext } from './MetaProvider.js'
import { type Metadata } from './types/Metadata.js'
import { updateElementAttributes } from './utils/updateElementAttributes.js'

type Options = {
  auto?: boolean
}

/**
 * Hook for modifying head meta tags.
 *
 * @param params See {@link Params}.
 * @param deps Additional dependencies.
 */
export function useMeta(metadata: Metadata, {
  auto = true,
}: Options = {}, deps: DependencyList = []) {
  const context = useContext(MetaContext)
  const { baseTitle, canonicalURL, description, locale, noIndex, title, themeColor, apple, openGraph, twitter } = metadata

  if (context?.metadata) {
    assign(context.metadata, { ...metadata })
  }

  useDOMEffect(() => {
    const prevVal = window.document.documentElement.getAttribute('lang')

    if (locale) {
      window.document.documentElement.setAttribute('lang', locale)
    }
    else {
      window.document.documentElement.removeAttribute('lang')
    }

    return () => {
      if (prevVal) {
        window.document.documentElement.setAttribute('lang', prevVal)
      }
      else {
        window.document.documentElement.removeAttribute('lang')
      }
    }
  }, [locale, ...deps])

  useDOMEffect(() => {
    const prevTitle = window.document.title

    if (title !== undefined) window.document.title = title ?? ''

    return () => {
      window.document.title = prevTitle
    }
  }, [title, ...deps])

  useDOMEffect(() => updateElementAttributes('meta', [
    { key: true, name: 'name', value: 'description' },
    { name: 'content', value: description ?? '' },
  ]), [description, ...deps])

  useDOMEffect(() => updateElementAttributes('meta', [
    { key: true, name: 'name', value: 'robots' },
    { name: 'content', value: noIndex ? 'noindex, nofollow' : undefined },
  ]), [noIndex, ...deps])

  useDOMEffect(() => updateElementAttributes('link', [
    { key: true, name: 'rel', value: 'manifest' },
    { name: 'href', value: noIndex ? undefined : '/manifest.json' },
  ]), [noIndex, ...deps])

  useDOMEffect(() => updateElementAttributes('link', [
    { key: true, name: 'rel', value: 'canonical' },
    { name: 'href', value: noIndex ? undefined : canonicalURL },
  ]), [canonicalURL, noIndex, ...deps])

  useDOMEffect(() => updateElementAttributes('meta', [
    { key: true, name: 'name', value: 'theme-color' },
    { name: 'content', value: noIndex ? undefined : themeColor },
  ]), [themeColor, noIndex, ...deps])

  useAppleMeta(
    { title, ...apple },
    { auto, isEnabled: !noIndex },
    [...deps],
  )

  useOpenGraphMeta(
    { description, siteName: baseTitle, title, url: canonicalURL, ...openGraph },
    { auto, isEnabled: !noIndex },
    [...deps],
  )

  useTwitterMeta(
    { description, title, ...twitter },
    { auto, isEnabled: !noIndex },
    [...deps],
  )
}

function assign<T extends Record<string, any>>(target: T, assignee: T) {
  for (const key in assignee) {
    if (Object.prototype.hasOwnProperty.call(assignee, key) === false) continue

    const assignedValue = assignee[key]

    if (assignedValue === undefined || assignedValue === null) continue

    if (typeof assignedValue === 'object') {
      if (target[key] === undefined) {
        Object.assign(target, { [key]: {} })
      }

      assign(target[key], assignedValue)
    }
    else {
      target[key] = assignedValue
    }
  }
}
