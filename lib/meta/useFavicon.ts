import { useEffect, useState } from 'react'
import { updateElementAttributes } from './utils/updateElementAttributes.js'

type Params = {
  /**
   * Favicon for <link rel='alternate icon'>.
   */
  alternateIcon?: {
    defaultImage?: string
    darkImage?: string
  }
  /**
   * Favicon for <link rel='mask icon'>.
   */
  maskIcon?: {
    image?: string
  }
  /**
   * Default favicon (for <link rel='icon'>).
   */
  icon?: {
    defaultImage?: string
    darkImage?: string
  }
}

/**
 * Hook for updating favicon meta tags in the document head when dark mode is
 * toggled.
 *
 * @param params See {@link Params}.
 */
export function useFavicon({
  alternateIcon,
  icon,
  maskIcon,
}: Params) {
  const matchMedia = typeof window !== 'undefined' && typeof window.matchMedia !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : undefined
  const [isDarkMode, setIsDarkMode] = useState<boolean>(matchMedia?.matches === true)

  const colorSchemeChangeHandler = (event: MediaQueryListEvent) => setIsDarkMode(event.matches)

  useEffect(() => {
    matchMedia?.addEventListener('change', colorSchemeChangeHandler)

    return () => {
      matchMedia?.removeEventListener('change', colorSchemeChangeHandler)
    }
  }, [])

  useEffect(() => updateElementAttributes('link', [
    { key: true, name: 'rel', value: 'mask-icon' },
    { key: true, name: 'type', value: 'image/svg+xml' },
    ...maskIcon?.image ? [
      { name: 'href', value: maskIcon.image },
    ] : [],
  ], {
    autoCreate: !!maskIcon?.image,
  }), [maskIcon])

  useEffect(() => updateElementAttributes('link', [
    { key: true, name: 'rel', value: 'icon' },
    { key: true, name: 'type', value: 'image/x-icon' },
    ...!isDarkMode && icon?.defaultImage ? [
      { name: 'href', value: icon.defaultImage },
    ] : [],
    ...isDarkMode && icon?.darkImage ? [
      { name: 'href', value: icon.darkImage },
    ] : [],
  ], {
    autoCreate: !!icon?.defaultImage,
  }), [isDarkMode, icon])

  useEffect(() => updateElementAttributes('link', [
    { key: true, name: 'rel', value: 'alternate icon' },
    { key: true, name: 'type', value: 'image/png' },
    ...!isDarkMode && alternateIcon?.defaultImage ? [
      { name: 'href', value: alternateIcon.defaultImage },
    ] : [],
    ...isDarkMode && alternateIcon?.darkImage ? [
      { name: 'href', value: alternateIcon.darkImage },
    ] : [],
  ], {
    autoCreate: !!alternateIcon?.defaultImage,
  }), [isDarkMode, alternateIcon])
}
