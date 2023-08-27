import type { DependencyList } from 'react'
import { useDocumentDescription } from './useDocumentDescription'
import { useDocumentTitle } from './useDocumentTitle'
import { useDocumentURL } from './useDocumentURL'

type Params = {
  /**
   * The document title (see {@link useDocumentTitle}).
   */
  title?: string

  /**
   * The document description (see {@link useDocumentDescription}).
   */
  description?: string

  /**
   * The document URL (see {@link useDocumentURL}).
   */
  url?: string
}

/**
 * Hook for modifying head meta tags.
 *
 * @param params See {@link Params}.
 * @param deps Additional dependencies.
 */
export function useMetaTags({ title, description, url }: Params, deps?: DependencyList) {
  if (title) useDocumentTitle(title, deps)
  if (description) useDocumentDescription(description, deps)
  if (url) useDocumentURL(url, deps)
}
