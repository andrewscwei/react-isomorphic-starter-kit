import { useEffect } from 'react'
import { updateElementAttributes } from '../utils/updateElementAttributes.js'

type Params = {
  /**
   * The URL of the favicon to use in light mode.
   */
  light?: string

  /**
   * The URL of the favicon to use in dark mode.
   */
  dark?: string
}

/**
 * Hook for updating favicon meta tags in the document head when dark mode is
 * toggled.
 *
 * @param params See {@link Params}.
 */
export function useFavicon({
  light,
  dark,
}: Params) {
  useEffect(() => updateElementAttributes('link', [
    { key: true, name: 'rel', value: 'icon' },
    { key: true, name: 'media', value: '(prefers-color-scheme: light)' },
    { name: 'type', value: 'image/x-icon' },
    { name: 'href', value: light },
  ], {
    autoCreate: true,
    autoDestroy: false,
  }), [light])

  useEffect(() => updateElementAttributes('link', [
    { key: true, name: 'rel', value: 'icon' },
    { key: true, name: 'media', value: '(prefers-color-scheme: dark)' },
    { name: 'type', value: 'image/x-icon' },
    { name: 'href', value: dark },
  ], {
    autoCreate: true,
    autoDestroy: false,
  }), [dark])
}
