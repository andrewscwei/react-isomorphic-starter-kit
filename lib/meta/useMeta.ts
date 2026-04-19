import { type DependencyList, useContext, useEffect } from 'react'

import { useAppleMeta } from './hooks/useAppleMeta.js'
import { useFavicon } from './hooks/useFavicon.js'
import { useOpenGraphMeta } from './hooks/useOpenGraphMeta.js'
import { useTwitterMeta } from './hooks/useTwitterMeta.js'
import { MetaContext } from './MetaProvider.js'
import { type Metadata } from './types/Metadata.js'
import { updateElementAttributes } from './utils/updateElementAttributes.js'

type Options = {
  /**
   * Specifies whether meta tags should be automatically managed. Defaults to
   * `true`.
   */
  auto?: boolean
}

/**
 * Hook for modifying head meta tags.
 *
 * @param params See {@link Params}.
 * @param deps Additional dependencies.
 */
export function useMeta(metadata: Metadata, { auto = true }: Options = {}, deps: DependencyList = []) {
  const context = useContext(MetaContext)
  const resolved = resolve(metadata)

  if (context?.metadata) {
    assign(context.metadata, { ...resolved })
  }

  useEffect(() => {
    const prevVal = window.document.documentElement.getAttribute('lang')

    if (resolved.locale) {
      window.document.documentElement.setAttribute('lang', resolved.locale)
    } else {
      window.document.documentElement.removeAttribute('lang')
    }

    return () => {
      if (prevVal) {
        window.document.documentElement.setAttribute('lang', prevVal)
      } else {
        window.document.documentElement.removeAttribute('lang')
      }
    }
  }, [resolved.locale, ...deps])

  useEffect(() => {
    const prevTitle = window.document.title

    if (resolved.title !== undefined) window.document.title = resolved.title ?? ''

    return () => {
      window.document.title = prevTitle
    }
  }, [resolved.title, ...deps])

  useEffect(() => updateElementAttributes('meta', [
    { key: true, name: 'name', value: 'description' },
    { name: 'content', value: resolved.description ?? '' },
  ]), [resolved.description, ...deps])

  useEffect(() => updateElementAttributes('meta', [
    { key: true, name: 'name', value: 'robots' },
    { name: 'content', value: resolved.noIndex ? 'noindex, nofollow' : undefined },
  ]), [resolved.noIndex, ...deps])

  useEffect(() => updateElementAttributes('link', [
    { key: true, name: 'rel', value: 'canonical' },
    { name: 'href', value: resolved.canonicalURL },
  ]), [resolved.canonicalURL, ...deps])

  useEffect(() => updateElementAttributes('meta', [
    { key: true, name: 'name', value: 'theme-color' },
    { name: 'content', value: resolved.themeColor },
  ]), [resolved.themeColor, ...deps])

  useFavicon({
    dark: resolved.favicon?.dark,
    light: resolved.favicon?.light,
  })

  useAppleMeta(
    { ...resolved.apple },
    { auto },
    [...deps],
  )

  useOpenGraphMeta(
    { ...resolved.openGraph },
    { auto },
    [...deps],
  )

  useTwitterMeta(
    { ...resolved.twitter },
    { auto },
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
    } else {
      target[key] = assignedValue
    }
  }
}

function resolve(metadata: Metadata): Metadata {
  const out = { ...metadata }

  out.apple = {
    title: out.title,
    ...out.apple,
  }

  out.openGraph = {
    description: out.description,
    siteName: out.baseTitle,
    title: out.title,
    url: out.canonicalURL,
    ...out.openGraph,
  }

  out.twitter = {
    description: out.description,
    title: out.title,
    ...out.twitter,
  }

  return out
}
