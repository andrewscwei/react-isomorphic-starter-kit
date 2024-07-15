import { type DependencyList } from 'react'
import { useDocumentDescription } from './useDocumentDescription.js'
import { useDocumentTitle } from './useDocumentTitle.js'
import { useDocumentURL } from './useDocumentURL.js'

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
  useDocumentTitle(title, deps)
  useDocumentDescription(description, deps)
  useDocumentURL(url, deps)
}
