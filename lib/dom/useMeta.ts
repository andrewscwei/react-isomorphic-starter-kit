import { useEffect, type DependencyList } from 'react'
import { updateElementAttributes } from './updateElementAttributes.js'
import { useAppleMeta } from './useAppleMeta.js'
import { useOpenGraphMeta } from './useOpenGraphMeta.js'
import { useTwitterMeta } from './useTwitterMeta.js'

type Params = {
  /**
   * The base title of the application.
   */
  baseTitle?: string

  /**
   * The document title.
   */
  title?: string

  /**
   * The document description.
   */
  description?: string

  /**
   * The theme color.
   */
  themeColor?: string

  /**
   * The document URL.
   */
  url?: string

  /**
   * The Apple meta tags (see {@link useAppleMeta}).
   */
  apple?: Parameters<typeof useAppleMeta>[0]

  /**
   * The Open Graph meta tags (see {@link useOpenGraphMeta}).
   */
  openGraph?: Parameters<typeof useOpenGraphMeta>[0]

  /**
   * The Twitter meta tags (see {@link useTwitterMeta}).
   */
  twitter?: Parameters<typeof useTwitterMeta>[0]
}

type Options = {
  auto?: boolean
}

/**
 * Hook for modifying head meta tags.
 *
 * @param params See {@link Params}.
 * @param deps Additional dependencies.
 */
export function useMeta({
  baseTitle,
  description,
  themeColor,
  title,
  url,
  apple = {},
  openGraph = {},
  twitter = {},
}: Params, {
  auto = false,
}: Options = {}, deps?: DependencyList) {
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
